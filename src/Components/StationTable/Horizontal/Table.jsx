import React, { useLayoutEffect, useEffect, useRef, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Link, Typography, Collapse } from '@mui/material';
import { DateTime } from 'luxon';
import { first } from 'lodash';

import { useAtom } from 'jotai'
import { timestampAtom } from '@/Components/atoms';

import RowWindSpeed from './RowWindSpeed';
import RowWindDirection from './RowWindDirection';
import RowTime from './RowTime';

// import { nwsHorizontalExpandAtom } from '@/NWS/atoms';

// import RowWindDirection from './RowWindDirection';

// 
// import RowDate from './RowDate';
// import RowTemperature from './RowTemperature';
// import RowPrecip from './RowPrecip';
// import RowSnowfall from './RowSnowfall';
// import RowClouds from './RowClouds';
// import RowBreak from './RowBreak';
// import RowRainEvent from './RowRainEvent';
// import RowThunderstormEvent from './RowThunderstormEvent';
// import RowThunderProp from './RowThunderProp';
// import RowSnowEvent from './RowShowEvent';
// import RowHazeEvent from './RowHazeEvent';
// import RowIcon from './RowIcon'
// import RowPrecipPercent from './RowPrecipPercent';
// import RowLCL from './RowLCL';
// import RowSounding from './RowSounding';



const formatTime24hr = (time) => {
    const hours = time.getHours()
    const minutes = time.getMinutes() / 60
    return hours + minutes
};

const selectedColor = "black"
const selectedWidth = 1

// const heights = [3, 4, 5, 6, 7, 8, 9, 10]
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start);


export default function HorizontalTable({ data, timezone }) {


    const padding = 5;
    const cellWidth = 45;
    const cellHeight = 20;
    const cellHeightSmall = 16;
    const legendWidth = 80;
    const windsAloft = 0.7

    // const [selected, setSelected] = (data?.data.length-1)
    const [timestamp, setTimestamp] = useAtom(timestampAtom);

    const selected = useMemo(() => {
        return data?.data.length - 1
    }, [data?.data])


    const nightColor = "#eaeaf6"
    const dayColor = "#f8f8f8"

    const windSpeedFontSize = 0.8
    const tempFontSize = 0.7
    const timeFontSize = 0.7


    const tableStyle = {
        tableLayout: 'fixed',  // Forces the table to respect cell width
        minWidth: '600px', // Or whatever makes sense for your columns
        // width: 'max-content', // Let it grow based on content
    };

    // const expand = useAtomValue(nwsHorizontalExpandAtom)

    const tableRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - tableRef.current.offsetLeft);
        setScrollLeft(tableRef.current.scrollLeft);
    };

    const heights = useMemo(() => {
        const length = first(data)?.sounding?.pres?.length
        return range(length - 7, length - 2)
    }, [data])

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - tableRef.current.offsetLeft;
        const walk = (x - startX) * 1; // Scroll speed multiplier
        tableRef.current.scrollLeft = scrollLeft - walk;
    };

    useLayoutEffect(() => {
        const el = tableRef.current;
        if (!el) return;

        const scrollToRight = () =>
            el.scrollTo({ left: el.scrollWidth, behavior: 'auto' });

        // Ensure it runs after the table has painted
        requestAnimationFrame(scrollToRight);

        // If the table width changes (e.g., data loads), keep snapping to right
        const table = el.querySelector('table');
        const ro = new ResizeObserver(scrollToRight);
        if (table) ro.observe(table);

        return () => ro.disconnect();

    }, [tableRef.current]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCellClick = (colIndex) => {
        // setSelected(colIndex)
        setTimestamp(colIndex)
        // console.log(`Clicked column: ${colIndex}`, data[colIndex]['timestamp']);
    };

    if (!data) {
        return <>Loading</>
    }





    console.log("data", data)

    return (
        <Box sx={{
            overflowX: 'auto',
            width: '100%',
            maxWidth: '100%',
        }}
        >

            <div
                ref={tableRef}
                style={{
                    paddingTop: 0,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    // maxWidth: '100%',
                    display: 'block',  // Ensures block context for overflow
                    cursor: isDragging ? 'grabbing' : 'grab',
                    WebkitOverflowScrolling: 'touch', // Smooth scroll on mobile
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >

                <table style={tableStyle}>
                    <tbody>

                        <RowTime
                            column="timestamp"
                            timezone={timezone}
                            data={data?.data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            cellFontSize={timeFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />


                        <RowWindSpeed
                            column="wind_speed"
                            name={"Wind"}
                            data={data?.data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            cellFontSize={windSpeedFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowWindSpeed
                            column="wind_gust"
                            name={"Gusts"}
                            data={data?.data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            cellFontSize={windSpeedFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowWindDirection
                            column="wind_direction"
                            data={data?.data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />


                        {/* <RowTime
                            column="timestamp"
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            cellFontSize={timeFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        

                       

                        <RowWindDirection
                            column="wind_dir"
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowBreak
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                            cellFontSize={windSpeedFontSize}
                        /> */}




                    </tbody>
                </table>
            </div>
        </Box>
    );
}

