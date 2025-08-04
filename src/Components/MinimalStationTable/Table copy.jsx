import React, { useLayoutEffect, useEffect, useRef, useState, useMemo } from 'react';
import { Paper, Box, Link, Typography, Collapse } from '@mui/material';
import { DateTime } from 'luxon';
import { first } from 'lodash';

import { useAtom } from 'jotai'

import { last } from 'lodash';

const tableStyle = {
    // tableLayout: 'fixed',  // Forces the table to respect cell width
    // minWidth: '600px', // Or whatever makes sense for your columns
    // width: 'max-content', // Let it grow based on content
};


const thStyle = {
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    padding: "8px",
    fontWeight: 600,
};

const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #f0f0f0",
};

const wrapCell = {
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    fontSize: "18px",
    width: "85px"
};

function windTime(s, timezone) {
    const d = last(s?.data)
    const dt = DateTime.fromISO(d['timestamp'], { zone: timezone });
    // Extract time of day with AM/PM
    const timeOfDay = dt.toFormat('hh:mm').toLowerCase();
    return timeOfDay
}

function windSpeed(s) {
    const d = last(s?.data)
    return parseInt(d.wind_speed)
}


function windGust(s) {
    const d = last(s?.data)
    if (d.wind_gust > d.wind_speed) {
        return `g ${parseInt(d.wind_gust)}`
    }
    return ""
}


function windDirection(s) {
    const d = last(s?.data)
    return d.wind_direction
}

function generateStyle(value) {
    const arrowStyle = {
        fontFamily: 'iconfont', // Assuming iconfont is a loaded font in your project
        color: '#5b7e9e', // Setting the color for the arrow
        fontSize: '18px', // Adjust the font size to suit your needs
        transform: `rotate(${value}deg)`, // Rotate the number 4 based on the value prop
        display: 'inline-block',
        transformOrigin: 'center', // Make sure the rotation happens around the center
    };
    return arrowStyle;
}



const cellWidth = 10

export default function Table({ data, timezone }) {



    if (!data?.length) {
        return <p>No stations to show.</p>;
    }

    return (
        <Box sx={{
            overflowX: 'auto',
            width: '100%',
            maxWidth: '100%',
        }}
        >
            <table style={tableStyle}>

                <tbody>
                    {data?.map((s) => (
                        <tr key={s.metadata.id}>
                            <td style={wrapCell}>
                                <a href={s.metadata.link} target="_blank" rel="noreferrer">
                                    {s.metadata.name}
                                </a>
                            </td>
                            <td style={{
                                width: "50px",
                                fontSize: '16px'
                            }}
                            >{Number(s.metadata.elevation).toLocaleString()}</td>

                            <td style={{
                                width: "50px",
                                fontSize: '16px'
                            }}
                            >{windTime(s, timezone)}</td>
                            <td
                                style={{
                                    width: `50px`,
                                    fontSize: '12px',
                                    // display: "flex",
                                    alignItems: "center",
                                }}
                                align="center">
                                <div style={generateStyle(windDirection(s))}>{windDirection(s) ? 4 : ""}</div>
                            </td>
                            <td style={{
                                width: `50px`,
                                fontSize: '18px',
                                // display: "flex",
                                alignItems: "center",
                            }}
                            >{windSpeed(s)}</td>
                            <td
                                style={{
                                    width: `70px`,
                                    fontSize: '18px',
                                    // display: "flex",
                                    alignItems: "center",
                                }}
                            >{windGust(s)}</td>



                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    )

}
