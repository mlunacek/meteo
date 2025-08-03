

import windyColorScale from '@/Components/WeatherTable/windColorScale'
import { ConsoleLogger } from '@aws-amplify/core'
import { get } from 'lodash';
import { scaleLinear } from 'd3';

export default function windIndication(axisRight, zy, pticks, pticksLookup, defs) {

    // console.log(pticksLookup[200])

    const getWindSpeedAtPressure = (p) => parseInt(pticksLookup[p]['wspd'])
    const getWindDirectionAtPressure = (p) => pticksLookup[p]['wdir']

    const colorScale = windyColorScale()

    // const colorScale = scaleLinear()
    //     .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])  // Adjust domain based on your wind speeds
    //     .range(['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']);

    const windData = pticks.map(p => ({
        pressure: p,
        speed: getWindSpeedAtPressure(p),
        direction: getWindDirectionAtPressure(p), // Degrees, meteorological
    }));

    defs.selectAll('.temp-gradient').remove();
    // console.log(defs)

    const res = []
    pticks.forEach((d, i) => {

        if (i === 0) {

            const current = zy(pticks[i])
            const next = zy(pticks[i + 1])

            const bottomHeight = (next - current) / 2
            const topHeight = bottomHeight

            const grad = defs.append('linearGradient')
                .attr('class', 'temp-gradient')
                .attr('id', `gradient-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');

            grad.append('stop')
                .attr('offset', '10%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            grad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            const rgrad = defs.append('linearGradient')
                .attr('class', 'temp-gradient')
                .attr('id', `rgradient-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');

            rgrad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            rgrad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i + 1]['speed']));


            const tmp = {
                'i': i,
                'bottomHeight': bottomHeight,
                'topHeight': topHeight,
                'speed': i,
                'fill': `url(#gradient-${i})`,
                'rfill': `url(#rgradient-${i})`
            }


            res.push(tmp)
        }
        else if (i < pticks.length - 1) {

            const prev = zy(pticks[i - 1])
            const current = zy(pticks[i])
            const next = zy(pticks[i + 1])

            const bottomHeight = (next - current) / 2
            const topHeight = (current - prev) / 2

            const grad = defs.append('linearGradient')
                .attr('class', 'temp-gradient')
                .attr('id', `gradient-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');

            grad.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            grad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i + 1]['speed']));

            const rgrad = defs.append('linearGradient')
                .attr('class', 'temp-gradient')
                .attr('id', `rgradient-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');

            rgrad.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            rgrad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i]['speed']));



            const tmp = {
                'i': i,
                'bottomHeight': bottomHeight,
                'topHeight': topHeight,
                'speed': colorScale(i),
                'fill': `url(#gradient-${i})`,
                'rfill': `url(#rgradient-${i})`
            }
            res.push(tmp)
        }
        else {

            const prev = zy(pticks[i - 1])
            const current = zy(pticks[i])

            const bottomHeight = (current - prev) / 2
            const topHeight = (current - prev) / 2

            const grad = defs.append('linearGradient')
                .attr('class', 'temp-gradient')
                .attr('id', `gradient-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');

            grad.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            grad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            const rgrad = defs.append('linearGradient')
                .attr('class', 'temp-gradient')
                .attr('id', `rgradient-${i}`)
                .attr('x1', '0%').attr('y1', '0%')
                .attr('x2', '0%').attr('y2', '100%');

            rgrad.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', colorScale(windData[i]['speed']));

            rgrad.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', colorScale(windData[i]['speed']));



            const tmp = {
                'i': i,
                'bottomHeight': bottomHeight,
                'topHeight': topHeight,
                'speed': i,
                'fill': `url(#gradient-${i})`,
                'rfill': `url(#rgradient-${i})`
            }
            res.push(tmp)
        }

        // console.log(res)

    })

    axisRight.selectAll('*').remove(); // Clear existing axis

    const ticks = axisRight.selectAll('.windTick')
        .data(windData)
        .enter()
        .append('g')
        .attr('class', 'windTick')
        .attr('transform', d => `translate(0, ${zy(d.pressure)})`);


    // Add icons using <text> and your icon font
    ticks.append('text')
        .attr('class', 'iconfont')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#5b7e9e')
        .attr('font-size', 18)
        .attr('transform', d => `rotate(${d.direction})`) // Adjust rotation if needed
        .text('4'); // Replace with your actual arrow character from iconfont

    // Top Red
    ticks.append('rect')
        .attr('x', -42)
        .attr('y', (d, i) => 0)
        .attr('width', 25)
        .attr('height', (d, i) => res[i]?.bottomHeight)
        .attr('fill', (d, i) => res[i]?.fill)
        // .attr('stroke', (d, i) => "blue")
        // .attr('stroke-width', 2)     // Border thickness
        .attr('fill-opacity', 0.8)

    // Bottom blue
    ticks.append('rect')
        .attr('x', -42)
        .attr('y', (d, i) => -1 * res[i]?.topHeight)
        .attr('width', 25)
        .attr('height', (d, i) => res[i]?.topHeight)
        .attr('fill', (d, i) => res[i]?.rfill)
        // .attr('stroke', (d, i) => 'black')
        // .attr('stroke-width', 0.5)
        .attr('fill-opacity', 0.8)

    ticks.append('text')
        .attr('class', 'windvalue')
        .attr('x', -30)
        .attr('y', 0)
        .attr('fill', 'black')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text((d, i) => d.speed)
}