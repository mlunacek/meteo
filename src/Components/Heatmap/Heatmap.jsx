import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Box } from "@mui/material";
import { last, first, max, mean, isEmpty, sortBy, zip } from 'lodash';

import '@/Components/WeatherTable/assets/main.css';
import useContainerWidth from "@/utils/useContainerWidth";

import windyColorScale from '@/Components/WeatherTable/windColorScale'

import { useAtomValue } from 'jotai'
import { yExtentAtom, zoomTransformAtom } from '@/HRRR/atoms';

import {
    calculateHeight,
    computeYExtent,
    formatHeatmapData,
    formatLineData
} from './utils';

const Heatmap = ({ data = [], inHeight }) => {

    const angle = 45 // 40 on mobile?

    const [containerRef, width] = useContainerWidth();
    const svgRef = useRef();
    const initializedRef = useRef();
    const previousXExtentRef = useRef();
    const previousYExtentRef = useRef();

    const margin = { top: 20, right: 10, bottom: 50, left: 35 };
    const colorScale = windyColorScale()
    const extent_y = useAtomValue(yExtentAtom)
    const zoomTransform = useAtomValue(zoomTransformAtom)

    const height = useMemo(() => {
        if (width && inHeight) {
            return calculateHeight(inHeight, width)
        }
    }, [width, inHeight])

    const heatmapData = useMemo(() => {
        if (data) {
            return formatHeatmapData(data)
        }
    }, [data])

    const lineData = useMemo(() => {
        if (data) {
            return formatLineData(data)
        }
    })

    const extent_x = useMemo(() => {
        if (!heatmapData) return;
        return d3.extent(heatmapData.map((d) => new Date(d.timestamp)))
    }, [heatmapData])

    // const extent_y = useMemo(() => {
    //     if (!heatmapData) return;
    //     return d3.extent(heatmapData.map((d) => d.pressure))
    // }, [heatmapData])

    const x = useMemo(() => {
        if (extent_x) {
            return d3.scaleTime().domain([extent_x[0], extent_x[1]])
        }
    }, [extent_x]);

    const y = useMemo(() => {
        if (extent_y) {
            return d3.scaleLog().domain([extent_y[1], extent_y[0]])
        }
    }, [extent_y]);

    const pticks = useMemo(() => {
        if (!heatmapData) return;
        return [...new Set(heatmapData.map(d => d.pressure))].sort((a, b) => b - a);
    }, [data]);

    useEffect(() => {
        if (!initializedRef.current && svgRef.current) {

            const wrapper = d3.select(svgRef.current);
            const svg = wrapper.append("svg");

            svg.append("defs")
                .append("clipPath")
                .attr("id", "clipper");

            const mainGroup = svg.append("g")
                .attr("class", "main")
                .attr("clip-path", "url(#clipper)");

            mainGroup.append("g").attr("class", "zoom-layer");

            const zoomLayer = mainGroup.select(".zoom-layer");
            zoomLayer.append("g").attr("class", "datalayer");

            const mainAxisGroup = svg.append("g")
                .attr("class", "main-axis");

            mainAxisGroup.append("g").attr("class", "axis-left");
            mainAxisGroup.append("g").attr("class", "axis-right");
            mainAxisGroup.append("g").attr("class", "axis-bottom");

            initializedRef.current = true;
        }

    }, [svgRef, initializedRef]);

    // Just manage resize
    useEffect(() => {

        if (!height) return;
        if (!width) return;
        if (!extent_x) return;
        if (!extent_y) return;

        const svg = d3.select(svgRef.current).select("svg");
        const scale = 1;
        const h = height - margin.top - margin.bottom;
        const w = width - margin.left - margin.right;

        const mainGroup = svg.select(".main");
        const mainAxisGroup = svg.select(".main-axis");

        const axisLeft = mainAxisGroup.select(".axis-left");
        const axisRight = mainAxisGroup.select(".axis-right");
        const axisBottom = mainAxisGroup.select(".axis-bottom");

        const datalayer = svg.select(".datalayer");
        const clipPath = svg.select("#clipper")

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

            axisBottom.attr("transform", `translate(0,${h})`).call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%H")))
            axisLeft.call(d3.axisLeft(y).tickValues(pticks).tickSize(5).tickFormat(d => `${(d)}`))


        }

        resize()

        d3.select(window).on("resize.skewt", resize);

        return () => {
            d3.select(window).on("resize.skewt", null);
        };


    }, [svgRef, height, width, extent_x, extent_y, x, y, pticks])

    useEffect(() => {
        if (!x) return;
        if (!y) return;
        if (!svgRef) return;
        if (!heatmapData?.length) return;

        // console.log(heatmapData[0])

        const oneHourMs = 60 * 60 * 1000;
        const referenceTime = new Date(heatmapData[0].timestamp);
        const timeWidth = x(new Date(referenceTime.getTime() + oneHourMs)) - x(referenceTime);

        const svg = d3.select(svgRef.current).select("svg");
        const datalayer = svg.select(".datalayer");

        // console.log("heatmapData", heatmapData)

        datalayer.selectAll(".heatmap-rect")
            .data(heatmapData)
            .join("rect")
            .attr("class", "heatmap-rect")
            .attr("x", d => x(new Date(d.timestamp)))
            .attr("y", d => y(d.pressure - 25))  // Shift down by one "row" if needed
            .attr("width", d => timeWidth - 0.5)
            .attr("height", d => (y(d.pressure - 25 + 50) - y(d.pressure - 25)) - 0.5)
            .attr("fill", d => colorScale(d.wind_speed))
            .attr("stroke", "none")
            .attr("fill-opacity", 0.8);

    }, [svgRef, x, y, heatmapData])


    useEffect(() => {
        if (!x) return;
        if (!y) return;
        if (!svgRef.current) return;
        if (!zoomTransform) return;

        const svg = d3.select(svgRef.current);
        const zoomLayer = svg.select(".zoom-layer");

        const translateY = (height - margin.top - margin.bottom) * (1 - zoomTransform.k);

        const yOnlyTransform = d3.zoomIdentity.translate(0, translateY)

        // Apply transform to the group
        zoomLayer.attr("transform", yOnlyTransform);
        // const zx = yOnlyTransform.rescaleX(x);
        const zy = zoomTransform.rescaleY(y);

        const axisLeft = svg.select(".axis-left");

        axisLeft.call(d3.axisLeft(zy).tickValues(pticks).tickSize(5).tickFormat(d => `${(d)}`))



    }, [zoomTransform, pticks, y, x, height, margin]);




    return (
        <Box
            border={1}
            ref={containerRef}
            sx={{
                width: "100%",
                // height: "600px",
                display: "flex",
                alignItems: "top",
                justifyContent: "center",
            }}
        >
            <div ref={svgRef} />
        </Box>
    );
};

export default Heatmap;
