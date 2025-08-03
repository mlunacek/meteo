import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import { last, first, max, mean, isEmpty, sortBy } from 'lodash';

import "./SkewT.css";
import useContainerWidth from "@/utils/useContainerWidth";

import windIndication from "./windIndicationBox";
import '@/Components/WeatherTable/assets/main.css';
import { ConsoleLogger } from "@aws-amplify/core";

import { useAtom, useSetAtom } from 'jotai'
import { yExtentAtom, zoomTransformAtom } from '@/HRRR/atoms';



/**
 * Saturation vapor pressure in mb
 */
function saturationVaporPressure(tempC) {
    const epsilon = 0.622;
    const A = 6.112;
    const B = 17.67;
    const C = 243.5;
    return A * Math.exp((B * tempC) / (tempC + C));
}

function cToF(celsius) {
    return `${celsius}°`;
    // return `${(celsius * 9 / 5) + 32}°`;
}

function saturationMixingRatio(T, p) {
    // Approximate saturation mixing ratio in g/kg
    const es = 6.112 * Math.exp((17.67 * T) / (T + 243.5)); // hPa
    return 622 * es / (p - es); // g/kg
}

function computeCCL(pressures, Tenv, Td, psurf) {

    pressures.reverse()
    Tenv.reverse()
    console.log(pressures)
    console.log(Tenv)
    console.log(Td)
    console.log(psurf)

    const qSurface = saturationMixingRatio(Td, psurf); // Surface mixing ratio
    console.log("qSurface", qSurface)

    for (let i = 0; i < pressures.length; i++) {
        const p = pressures[i];
        const T = Tenv[i];
        const qEnv = saturationMixingRatio(T, p);

        if (qEnv <= qSurface) {
            return p; // CCL found at this pressure
        }
    }
    return null; // No CCL found in range
}

function computeLCLPressure(T0, T_LCL, P0) {
    const T0_K = T0 + 273.15;
    const T_LCL_K = T_LCL + 273.15;
    const P_LCL = P0 * Math.pow(T_LCL_K / T0_K, 3.5);  // Poisson's equation
    return P_LCL;
}

function computeLCL(T, Td) {
    const term1 = 1 / (Td - 56);
    const term2 = Math.log(T / Td) / 800;
    const T_LCL = (1 / (term1 + term2)) + 56;
    return T_LCL;
}
/**
 * Temperature (°C) for constant mixing ratio and pressure
 * @param {number} w - Mixing ratio (g/kg)
 * @param {number} P - Pressure (mb)
 */
function tempForMixingRatio(w, P) {
    const epsilon = 0.622;
    const A = 6.112;
    const B = 17.67;
    const C = 243.5;
    const w_kgkg = w / 1000;
    const e_s = (P * w_kgkg) / (epsilon + w_kgkg);

    if (e_s <= 0) return NaN;  // skip invalid values

    const ln_es = Math.log(e_s / A);
    const tempC = (C * ln_es) / (B - ln_es);

    return tempC;
}

function interpolateProfile(profile, resolution = 1) {
    let highRes = [];

    for (let i = 0; i < profile.length - 1; i++) {
        const p1 = profile[i].press;
        const t1 = profile[i].temp;
        const p2 = profile[i + 1].press;
        const t2 = profile[i + 1].temp;

        for (let P = p1; P <= p2; P += resolution) {
            const frac = (P - p1) / (p2 - p1);
            const T = t1 + frac * (t2 - t1);
            highRes.push({ press: P, temp: T });
        }
    }

    // Include last point
    highRes.push(profile[profile.length - 1]);

    return highRes;
}


function dryAdiabat(T0_C, P0, P) {
    return {
        press: P,
        temp: (T0_C + 273.15) * Math.pow(P / P0, 0.286) - 273.15
    }

    // const res = P.map((p) => {
    //     return {
    //         press: p,
    //         temp: (T0_C + 273.15) * Math.pow(p / P0, 0.286) - 273.15
    //     }
    // })
    // res.push({
    //     press: P0,
    //     temp: T0_C
    // })
    // return res
}

function pressureToAltitude(pressureMb) {
    const seaLevelPressure = 1013.25; // Standard sea-level pressure in mb
    const exponent = 0.190284;
    const scaleHeightFt = 145366.45;

    const altitude = scaleHeightFt * (1 - Math.pow(pressureMb / seaLevelPressure, exponent));
    return `${(altitude / 1000).toFixed(1)}K`;
}

function median(arr) {
    if (isEmpty(arr)) return undefined;

    const sorted = sortBy(arr);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        // Even length: average the two middle numbers
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        // Odd length: return the middle number
        return sorted[mid];
    }
}



function computeYExtent(data) {
    const data_y_extent = d3.extent(data?.map((d) => d.press))
    return [data_y_extent[1] + 25, data_y_extent[0]]
}


const SkewT = ({ data = [], inHeight, zoomPressure = 150 }) => {

    const angle = 45 // 40 on mobile?

    const svgRef = useRef();
    const previousExtentRef = useRef(null);
    const previousXExtentRef = useRef();
    const previousYExtentRef = useRef();
    const previousPlinesRef = useRef();
    const currentScaleRef = useRef(1);
    const initialRenderRef = useRef(false);

    const setExportYExtent = useSetAtom(yExtentAtom)
    const setZoomTransform = useSetAtom(zoomTransformAtom)

    const [containerRef, width] = useContainerWidth();

    const initializedRef = useRef(false);
    const [zoomFactor, setZoomFactor] = useState()
    const [svg, setSvg] = useState();

    const margin = { top: 20, right: 10, bottom: 50, left: 35 };
    const deg2rad = Math.PI / 180;
    const tan = Math.tan(angle * deg2rad);

    const height = useMemo(() => {

        if (width && inHeight) {

            // console.log("height/width", inHeight / width)
            if (inHeight / width > 1.65) {
                return width * 1.65
            }

            if (inHeight === -1) {
                return width
            }
            else if (inHeight > 0) {
                return inHeight
            }
        }

    }, [width, inHeight])

    const currentScale = useMemo(() => {
        if (!zoomFactor) return currentScaleRef.current;
        const newScale = zoomFactor.k

        if (
            !currentScaleRef.current || Math.abs(newScale - currentScaleRef.current) > 0.1
        ) {
            currentScaleRef.current = newScale;
        }

        return currentScaleRef.current;

    }, [zoomFactor])


    const extent_y = useMemo(() => {
        if (!data?.length) return previousYExtentRef.current;

        const newExtent = computeYExtent(data)
        if (
            !previousYExtentRef.current ||
            Math.abs(newExtent[0] - previousYExtentRef.current[0]) > 1 || // Tolerance as needed
            Math.abs(newExtent[1] - previousYExtentRef.current[1]) > 1
        ) {
            previousYExtentRef.current = newExtent;
        }

        return previousYExtentRef.current;

    }, [data])

    useEffect(() => {
        if (extent_y) {
            setExportYExtent([extent_y[0], extent_y[1]])
        }
    }, [extent_y, currentScale])


    const extent_x = useMemo(() => {
        if (!data?.length || !extent_y || !tan || !height || !width) return previousXExtentRef.current;

        const newXExtent = computeXExtent(data, extent_y, tan, height, width)

        if (
            !previousXExtentRef.current ||
            Math.abs(newXExtent[0] - previousXExtentRef.current[0]) > 1 || // Tolerance as needed
            Math.abs(newXExtent[1] - previousXExtentRef.current[1]) > 1
        ) {
            previousXExtentRef.current = newXExtent;
        }

        return previousXExtentRef.current;


    }, [data, extent_y, tan, height, width])


    const plines = useMemo(() => {
        return data?.map((d) => d.press).slice(0, data?.length - 1)
    }, [data])

    const pticks = useMemo(() => {
        if (!data?.length) return previousPlinesRef.current;

        const pressures = data.map(d => d.press).slice(0, data.length - 1);
        if (!previousPlinesRef.current ||
            pressures.some((d, i) => d !== previousPlinesRef.current[i]) ||
            pressures.length !== previousPlinesRef.current.length
        ) {
            previousPlinesRef.current = pressures;
        }

        return previousPlinesRef.current;
    }, [data]);

    const surface = useMemo(() => {
        if (data?.length > 0) {
            return last(data)?.press
        }
    }, [data])



    const surfaceTemp = useMemo(() => {
        if (data?.length > 0) {
            return last(data)?.temp
        }
    }, [data])


    const pticksLookup = useMemo(() => {
        const lookup = Object.fromEntries(data?.map(d => [d.press, d]));
        return lookup

    }, [data, pticks])

    const x = useMemo(() => {
        if (extent_x) {
            return d3.scaleLinear().domain([extent_x[0], extent_x[1]])
        }
    }, [extent_x]);

    const y = useMemo(() => {
        if (extent_y) {
            return d3.scaleLog().domain([extent_y[1], extent_y[0]])
        }
    }, [extent_y]);

    // useEffect(() => {
    //     if (extent_x && extent_y) {
    //         console.log("extent ratio --> ", (extent_y[0] - extent_y[1]) / (extent_x[1] - extent_x[0]))
    //     }
    // }, [extent_x, extent_y])

    function computeXExtent(data, extent_y, tan, height, width) {

        const aspect = width / height;

        const idealRatio = 9 / aspect
        const baseTemp = -50
        const max_temp = ((extent_y[0] - extent_y[1]) + idealRatio * baseTemp) / idealRatio
        const axisRange = (max_temp - baseTemp)

        const y = d3.scaleLog().domain([extent_y[1], extent_y[0]]).range([0, height])
        const x = d3.scaleLinear().domain([baseTemp, max_temp]).range([0, width])

        const medianTemp = median(data?.map((d) => d.temp))
        const medianPress = median(data?.map((d) => d.press))
        const medianX = (x(medianTemp) + (y(extent_y[0]) - y(medianPress)) / tan)
        const medianTempMark = x.invert(medianX)

        const newExtent = [medianTempMark - axisRange / 2, medianTempMark + axisRange / 2]
        const threshold = 2;
        if (
            previousExtentRef.current &&
            Math.abs(newExtent[0] - previousExtentRef.current[0]) < threshold &&
            Math.abs(newExtent[1] - previousExtentRef.current[1]) < threshold
        ) {
            return previousExtentRef.current;
        } else {
            previousExtentRef.current = newExtent;
            return newExtent;
        }
    }


    useEffect(() => {
        if (!initializedRef.current && svgRef.current) {
            // console.log("initializing svg");

            const wrapper = d3.select(svgRef.current);
            const svg = wrapper.append("svg");

            // console.log("svg", svg);

            svg.append("defs")
                .append("clipPath")
                .attr("id", "clipper");

            const mainGroup = svg.append("g")
                .attr("class", "main")
                .attr("clip-path", "url(#clipper)");

            mainGroup.append("g").attr("class", "zoom-layer");

            const zoomLayer = mainGroup.select(".zoom-layer");

            zoomLayer.append("g").attr("class", "skewtbg");
            zoomLayer.append("g").attr("class", "skewt");
            zoomLayer.append("g").attr("class", "windbarb");

            const mainAxisGroup = svg.append("g")
                .attr("class", "main-axis");

            mainAxisGroup.append("g").attr("class", "axis-left");
            mainAxisGroup.append("g").attr("class", "axis-right");
            mainAxisGroup.append("g").attr("class", "axis-bottom");

            initializedRef.current = true;
            console.log("Setting SVG")
            setSvg(svg)
        }
    }, [svgRef, initializedRef, y]);


    const zoomBehavior = useMemo(() => {

        return d3.zoom()
            .scaleExtent([1, 5])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", (event) => {

                const svg = d3.select(svgRef.current).select("svg");

                const transform = event.transform;


                console.log("zoomBehavior transform", transform)
                const scale = transform.k;
                const fixedY = (height - margin.top - margin.bottom) * (1 - scale);

                const lockedTransform = d3.zoomIdentity
                    .translate(transform.x, fixedY)
                    .scale(scale);


                const zx = lockedTransform.rescaleX(x);
                const zy = lockedTransform.rescaleY(y);
                const zoomLayer = svg.select(".zoom-layer");

                zoomLayer.attr("transform", lockedTransform);
                // console.log(lockedTransform);


                const skewtbg = zoomLayer.select(".skewtbg");
                const skewtgroup = zoomLayer.select(".skewt");
                skewtbg.selectAll("line, path").attr("stroke-width", 1 / scale);
                skewtgroup.selectAll("line, path").attr("stroke-width", 2 / scale);
                skewtgroup.selectAll("circle").attr("r", 4 / scale);
                skewtgroup.selectAll(".metpy-line").attr("stroke-width", 0.5 / scale);

                const axisLeft = svg.select(".axis-left");
                const axisRight = svg.select(".axis-right");
                const axisBottom = svg.select(".axis-bottom");
                axisBottom.call(d3.axisBottom(zx).ticks(10).tickFormat(d => cToF(d)));
                axisLeft.call(d3.axisLeft(zy).tickValues(plines).tickSize(5).tickFormat(d => `${pressureToAltitude(d)}`))

                axisRight.call(d3.axisRight(zy).tickValues(pticks).tickSize(5)) //.tickFormat(d => `${pressureToAltitude(d)}`))
                windIndication(axisRight, zy, pticks, pticksLookup, svg.select("defs"))

                // const lockedTransform = transform;
                setZoomFactor(lockedTransform)
                setZoomTransform(lockedTransform)

            });

    }, [svgRef, height, margin, pticks, pticksLookup])

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.call(zoomBehavior);
    }, [zoomBehavior]);

    // useEffect(() => {
    //     if()
    //     setExportYExtent([extent_y[0], extent_y[1] * currentScale])

    // }, [zoomFactor, currentScale, extent_y])




    useEffect(() => {
        if (!y) return;
        if (!x) return;
        if (!zoomPressure) return;

        const svg = d3.select(svgRef.current).select("svg");

        console.log("calling zoom pressure")

        const ymax = y.domain()[1]
        const ymin = zoomPressure

        console.log(ymax, ymin)

        const domainExtent = y.domain(); // [topp, basep]
        const initialSpan = Math.log(domainExtent[1]) - Math.log(domainExtent[0]);
        const targetSpan = Math.log(ymax) - Math.log(ymin);
        const scale = initialSpan / targetSpan;
        const fixedY = (height - margin.top - margin.bottom) * (1 - scale);
        const fixedX = (width - margin.left - margin.right) * (1 - scale) / 2;

        // what is the x translation?
        const medianTemp = median(data?.map((d) => d.temp))
        const medianPress = median(data?.map((d) => d.press))
        const medianX = (x(medianTemp) + (y(extent_y[0]) - y(medianPress)) / tan)
        const medianTempMark = x.invert(medianX)

        // console.log("medianTempMark", medianTempMark, fixedX)

        const lockedTransform = d3.zoomIdentity
            .translate(fixedX, fixedY)
            .scale(scale);

        svg.transition()
            .duration(30)
            .call(zoomBehavior.transform, lockedTransform);

    }, [zoomPressure, y, x, svgRef])

    // Just manage resize
    useEffect(() => {

        console.log("currentScale", currentScale)
        // if (!currentScale) return;
        if (!height) return;
        if (!width) return;
        if (!extent_x) return;
        if (!extent_y) return;

        const svg = d3.select(svgRef.current).select("svg");
        const scale = currentScale;
        const h = height - margin.top - margin.bottom;
        const w = width - margin.left - margin.right;

        const mainGroup = svg.select(".main");
        const mainAxisGroup = svg.select(".main-axis");

        const axisLeft = mainAxisGroup.select(".axis-left");
        const axisRight = mainAxisGroup.select(".axis-right");
        const axisBottom = mainAxisGroup.select(".axis-bottom");

        const skewtbg = svg.select(".skewtbg");
        const clipPath = svg.select("#clipper")

        function drawBackground(initialRender = false) {

            const pp = d3.range(extent_y[1], extent_y[0] + 1, 10);
            const dryad = d3.range(-60, 240, 20);

            const dryline = d3.line()
                .x((d, i) => x((273.15 + d) / Math.pow((1000 / pp[i]), 0.286) - 273.15) + (y(extent_y[0]) - y(pp[i])) / tan)
                .y((_, i) => y(pp[i]));


            // Temp lines
            const tempLines = skewtbg.selectAll(".templine")
                .data(d3.range(-300, 100, 10))
                .join("line")
                .attr("class", d => d === 0 ? "tempzero templine" : "gridline templine")
                .attr("y1", 0)
                .attr("y2", h)
                .attr("x1", d => x(d) - 0.5 + (y(extent_y[0]) - y(extent_y[1])) / tan)
                .attr("x2", d => x(d) - 0.5)
                .attr("stroke-width", 1 / scale);

            if (!initialRender) {
                tempLines.transition().duration(500)
                    .attr("x1", d => x(d) - 0.5 + (y(extent_y[0]) - y(extent_y[1])) / tan)
                    .attr("x2", d => x(d) - 0.5);
            }

            // Pressure lines
            const pressureLines = skewtbg.selectAll(".pressureline")
                .data(plines)
                .join("line")
                .attr("class", "gridline pressureline")
                .attr("x1", -w)
                .attr("x2", w * 2)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke-width", 1 / scale);

            if (!initialRender) {
                pressureLines.transition().duration(500)
                    .attr("y1", d => y(d))
                    .attr("y2", d => y(d));
            }

            // Surface line
            const surfaceLines = skewtbg.selectAll(".surfaceline")
                .data([surface])
                .join("line")
                .attr("class", "surfaceline")
                .attr("x1", -w)
                .attr("x2", w * 2)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke-width", 1 / scale);

            if (!initialRender) {
                surfaceLines.transition().duration(500)
                    .attr("y1", d => y(d))
                    .attr("y2", d => y(d));
            }

            // Dry adiabats
            const dryLines = skewtbg.selectAll(".dryadiabatline")
                .data(dryad.map(d => Array(pp.length).fill(d)))
                .join("path")
                .attr("class", "gridline dryadiabatline")
                .attr("stroke-width", 1 / scale)
                .attr("d", dryline);

            if (!initialRender) {
                dryLines.transition().duration(500)
                    .attr("d", dryline);
            }
        }


        function resize() {

            // console.log("calling resize")

            x.range([0, w]);
            y.range([0, h]);

            svg.attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom);

            mainGroup.attr("transform", `translate(${margin.left},${margin.top})`);
            mainAxisGroup.attr("transform", `translate(${margin.left},${margin.top})`);

            clipPath.selectAll("*").remove();
            clipPath.append("rect")
                .attr("x", 0)  // Start at 0 since clipPath is relative to the clipped element
                .attr("y", 0)
                .attr("width", w)
                .attr("height", h);

            drawBackground(true);

            axisBottom.attr("transform", `translate(0,${h})`).call(d3.axisBottom(x).ticks(10).tickFormat(d => cToF(d)));
            axisLeft.call(d3.axisLeft(y).tickValues(plines).tickSize(5).tickFormat(d => `${pressureToAltitude(d)}`))
            axisRight.attr("transform", `translate(${w},0)`).call(d3.axisRight(y))//.tickValues(pticks).tickSize(5).tickFormat(d => `${pressureToAltitude(d)}`));
            // windIndication(axisRight, y, pticks, pticksLookup, svg.select("defs"))


        }

        console.log("Resize triggered")

        resize()

        d3.select(window).on("resize.skewt", resize);
        // svg.transition()
        //     .duration(0)
        //     .call(zoomBehavior.transform,
        //         zoomFactor);

        return () => {
            d3.select(window).on("resize.skewt", null);
        };


    }, [svgRef, currentScale, height, width, extent_x, extent_y, x, y])



    useEffect(() => {
        // const wrapper = d3.select(svgRef.current);

        if (!x) return;
        if (!y) return;
        if (!extent_x) return;
        if (!extent_y) return;
        if (!width) return;
        if (!height) return;

        const svg = d3.select(svgRef.current).select("svg");
        const scale = currentScale
        // console.log("scale", scale)

        const mainGroup = svg.select(".main");
        const mainAxisGroup = svg.select(".main-axis");

        const zoomLayer = mainGroup.select(".zoom-layer");
        const skewtbg = zoomLayer.select(".skewtbg");
        const skewtgroup = zoomLayer.select(".skewt");

        const axisLeft = mainAxisGroup.select(".axis-left");
        const axisRight = mainAxisGroup.select(".axis-right");
        const axisBottom = mainAxisGroup.select(".axis-bottom");
        const clipPath = svg.select("#clipper")


        function plotData(initialRender = true) {
            const h = width - margin.top - margin.bottom;
            const w = width - margin.left - margin.right;

            const valid = data.filter(d => d.temp > -1000 && d.dwpt > -1000);
            const skewtgroup = zoomLayer.select(".skewt");
            // const barbgroup = zoomLayer.select(".windbarb");

            // skewtgroup.selectAll("*").remove();
            // barbgroup.selectAll("*").remove();

            if (!valid.length) return;

            const line = d3.line()
                .x(d => x(d.temp) + (y(extent_y[0]) - y(d.press)) / tan)
                .y(d => y(d.press));

            const dewLine = d3.line()
                .x(d => x(d.dwpt) + (y(extent_y[0]) - y(d.press)) / tan)
                .y(d => y(d.press));


            const tempLines = skewtgroup.selectAll(".temp")
                .data([valid])
                .join("path")
                .attr("class", "temp skline")
                .attr("stroke-width", 2 / scale)
                .attr("fill", "none")
                .transition().duration(500)
                .attr("d", line);


            // Dewpoint Line
            skewtgroup.selectAll(".dwpt")
                .data([valid])
                .join("path")
                .attr("class", "dwpt skline")
                .attr("stroke-width", 2 / scale)
                .attr("fill", "none")
                .transition().duration(500)
                .attr("d", dewLine);

            const pressures = d3.range(100, surface, 10);

            let intersectionFound = false;
            const da = []
            const inter = interpolateProfile(data, 1)
            for (let i = 0; i < inter.length; i++) {
                const tmp = dryAdiabat(surfaceTemp, surface, inter[i]?.press);
                if (tmp.temp > inter[i]?.temp) {
                    da.push({ temp: tmp.temp, press: tmp.press })
                    intersectionFound = true;
                    break;
                }
            }

            const firstLast = [da[0], { temp: surfaceTemp, press: surface }]

            const intersectionLine = intersectionFound ? [firstLast] : [[{ temp: surfaceTemp + 0.1, press: surface }, { temp: surfaceTemp, press: surface }]]

            // console.log(intersectionLine[0])
            // Dry adiabat line
            const adiabatLineRender = skewtgroup.selectAll(".surface-line")
                .data(intersectionLine)
                .join("path")
                .attr("class", "surface-line")
                .attr("stroke", "#4daf4a")
                .attr("stroke-width", 2 / scale)
                .attr("fill", "none")
                .transition().duration(500)
                .attr("d", line);

            // adiabatLine.exit().remove();

            // Intersection Point Circle
            const intersectionPoint = intersectionFound ? [da[0]] : [{ temp: surfaceTemp, press: surface }];
            const adiabatPointRender = skewtgroup.selectAll(".adiabat-point")
                .data(intersectionPoint)
                .join("circle")
                .attr("class", "adiabat-point")
                .attr("r", 4 / scale)
                .attr("fill", "#4daf4a")
                .transition().duration(500)
                .attr("cx", d => x(d.temp) + (y(extent_y[0]) - y(d.press)) / tan)
                .attr("cy", d => y(d.press));

            // skewtgroup.selectAll(".adiabat-point")
            //     .data(intersectionPoint)
            //     .exit().remove();

            // console.log("initialRender", initialRender)


            // LCL Line
            const lclLine = skewtgroup.selectAll(".lclpy")
                .data(data?.lcl_press ? [data.lcl_press] : [])
                .join("line")
                .attr("class", "lclpy metpy-line")
                .attr("x1", -w)
                .attr("x2", w * 2)
                .attr("stroke-width", 0.5 / scale)
                .attr("stroke", 'black');

            if (!initialRender) {
                lclLine.transition().duration(500)
                    .attr("y1", d => y(d))
                    .attr("y2", d => y(d));
            } else {
                lclLine.attr("y1", d => y(d))
                    .attr("y2", d => y(d));
            }

            // CCL Line
            const cclLine = skewtgroup.selectAll(".cclpy")
                .data(data?.ccl_press ? [data.ccl_press] : [])
                .join("line")
                .attr("class", "cclpy metpy-line")
                .attr("x1", -w)
                .attr("x2", w * 2)
                .attr("stroke-width", 0.5 / scale)
                .attr("stroke", 'black');

            if (!initialRender) {
                cclLine.transition().duration(500)
                    .attr("y1", d => y(d))
                    .attr("y2", d => y(d));
            } else {
                cclLine.attr("y1", d => y(d))
                    .attr("y2", d => y(d));
            }

        }

        // resize();
        const first = !initialRenderRef.current;
        plotData(first);
        initialRenderRef.current = true

        // if (!initialRenderRef.current) {
        //     plotData(true);
        //     initialRenderRef.current = false
        // }
        // else {
        //     plotData(true);
        // }

        if (!zoomFactor) {
            svg.transition()
                .duration(0)
                .call(zoomBehavior.transform,
                    d3.zoomIdentity.translate(0, 0).scale(1));
        }
        else {
            svg.transition()
                .duration(0)
                .call(zoomBehavior.transform,
                    zoomFactor);
        }


    }, [data, height, width, x, y, extent_x, extent_y, surface, surfaceTemp, currentScale]);






    return (
        <Box
            ref={containerRef}
            sx={{
                width: "100%",
                // height: "100%",
                display: "flex",
                alignItems: "top",
                justifyContent: "center",
            }}
        >
            <div ref={svgRef} />
        </Box>
    );
};

export default SkewT;
