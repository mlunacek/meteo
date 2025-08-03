import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Link, Typography, Collapse } from '@mui/material';
import { DateTime } from 'luxon';
import { first } from 'lodash';

import { useAtom } from 'jotai'
import { timestampAtom } from '@/Components/atoms';

// import { nwsHorizontalExpandAtom } from '@/NWS/atoms';

import RowWindDirection from './RowWindDirection';
import RowWindSpeed from './RowWindSpeed';
import RowTime from './RowTime';
import RowDate from './RowDate';
import RowTemperature from './RowTemperature';
import RowPrecip from './RowPrecip';
import RowSnowfall from './RowSnowfall';
import RowClouds from './RowClouds';
import RowBreak from './RowBreak';
import RowRainEvent from './RowRainEvent';
import RowThunderstormEvent from './RowThunderstormEvent';
import RowThunderProp from './RowThunderProp';
import RowSnowEvent from './RowShowEvent';
import RowHazeEvent from './RowHazeEvent';
import RowIcon from './RowIcon'
import RowPrecipPercent from './RowPrecipPercent';
import RowLCL from './RowLCL';
import RowSounding from './RowSounding';



const formatTime24hr = (time) => {
    const hours = time.getHours()
    const minutes = time.getMinutes() / 60
    return hours + minutes
};

const selectedColor = "black"
const selectedWidth = 1

// const heights = [3, 4, 5, 6, 7, 8, 9, 10]
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start);


export default function HorizontalTable({ location, data }) {


    const padding = 5;
    const cellWidth = 35;
    const cellHeight = 20;
    const cellHeightSmall = 16;
    const legendWidth = 80;
    const windsAloft = 0.7

    const [selected, setSelected] = useState(0)
    const [timestamp, setTimestamp] = useAtom(timestampAtom);



    const nightColor = "#eaeaf6"
    const dayColor = "#f8f8f8"

    const windSpeedFontSize = 0.8
    const tempFontSize = 0.7
    const timeFontSize = 0.7

    const forecastWeatherLink = useMemo(() => {
        if (location) {
            return `https://forecast.weather.gov/MapClick.php?lat=${location.lat}&lon=${location.lon}&lg=english&FcstType=graphical`
        }
    }, [location])



    const tableStyle = {
        tableLayout: 'fixed',  // Forces the table to respect cell width
        minWidth: '1000px', // Or whatever makes sense for your columns
        width: 'max-content', // Let it grow based on content
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

    useEffect(() => {
        setSelected(timestamp)
    }, [timestamp])

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCellClick = (colIndex) => {
        setSelected(colIndex)
        setTimestamp(colIndex)
        // console.log(`Clicked column: ${colIndex}`, data[colIndex]['timestamp']);
    };

    if (!data) {
        return <>Loading</>
    }

    // console.log("heights", heights)

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
                    maxWidth: '100%',
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
                        <RowDate
                            column="timestamp"
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeight}
                            cellWidth={cellWidth}
                        />

                        <RowTime
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

                        <RowIcon
                            data={data}
                            padding={0.5}
                            cellWidth={cellWidth}
                            cellHeight={cellHeight}
                            cellFontSize={timeFontSize}
                            legendWidth={legendWidth}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowTemperature
                            column="temperature"
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeightSmall}
                            cellWidth={cellWidth}
                            cellFontSize={tempFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowPrecip
                            column="precip_amount"
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeightSmall}
                            cellWidth={cellWidth}
                            cellFontSize={tempFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowClouds
                            column="sky_cover"
                            data={data}
                            legendWidth={legendWidth}
                            padding={padding}
                            cellHeight={cellHeightSmall}
                            cellWidth={cellWidth}
                            cellFontSize={tempFontSize}
                            handleCellClick={handleCellClick}
                            selected={selected}
                            selectedColor={selectedColor}
                            selectedWidth={selectedWidth}
                        />

                        <RowWindSpeed
                            column="wind_speed"
                            name={"Wind"}
                            data={data}
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
                            data={data}
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
                        />


                        {/* {heights?.map((h, i) => {
                            return (
                                <RowSounding
                                    key={i}
                                    columnIndex={h}
                                    data={data}
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

                            )
                        })}


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

