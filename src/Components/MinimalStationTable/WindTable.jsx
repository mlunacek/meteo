import React from "react";
import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { DateTime } from "luxon";
import { last } from "lodash";

// -------- helpers --------
function getLatest(s) {
    return last(s?.data) || null;
}

function windTime(s, timezone) {
    const d = getLatest(s);
    if (!d) return "";
    const dt = DateTime.fromISO(d.timestamp, { zone: timezone });
    return dt.toFormat("hh:mm").toLowerCase();
}

function windSpeed(s) {
    const d = getLatest(s);
    return d ? Math.round(d.wind_speed) : 0;
}

function windGustValue(s) {
    const d = getLatest(s);
    if (!d) return 0;
    return Math.round(d.wind_gust) > Math.round(d.wind_speed) ? Math.round(d.wind_gust) : 0;
}

function windDirection(s) {
    const d = getLatest(s);
    return d ? d.wind_direction : 0;
}

function arrowStyle(deg) {
    return {
        fontFamily: "iconfont",
        color: "#cfe0f0",
        fontSize: 16,
        transform: `rotate(${deg}deg)`,
        display: "inline-block",
        transformOrigin: "center",
        width: "1em",
        textAlign: "center",
    };
}

function getColorForValue(value, colorMap, fallback = "#ffffff") {
    for (const stop of colorMap) {
        if (value <= stop.upto) return stop.color;
    }
    return fallback;
}

// -------- component --------
export default function WindTable({
    data,
    timezone,
    rowSpacing = 8, // px between rows
    colorMap = [
        { upto: 5, color: "#cceed9ff" },
        { upto: 10, color: "#7fd1a7" },
        { upto: 15, color: "#4db08b" },
        { upto: 20, color: "#f2b36b" },
        { upto: 25, color: "#ef7f58" },
        { upto: 30, color: "#e04a3a" },
    ],
}) {
    if (!data?.length) return <p style={{ color: "#fff" }}>No stations to show.</p>;

    return (
        <Box
            sx={{
                overflowX: "auto",
                width: "100%",
                maxWidth: "100%",
                bgcolor: "#2b2f33",
                color: "white",
                borderRadius: 0,
                p: { xs: 1, sm: 1.5 },
                "& a": { color: "#33c8edff", textDecorationColor: "rgba(255,255,255,0)" },
            }}
        >
            <Table
                size="small"
                sx={{
                    borderCollapse: "separate",
                    borderSpacing: `0 ${rowSpacing}px`,
                    // remove the underline on every cell
                    "& td, & th": { borderBottom: "none" },
                    "& tbody td": { py: 1.5, px: 2 }, // 1.5=12px vertical, 2=16px horizontal
                    "& tbody tr": {
                        backgroundColor: "#3a3f45",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        borderRadius: "8px",
                    },
                    "& tbody tr > td:first-of-type": { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
                    "& tbody tr > td:last-of-type": { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
                }}
            >
                <TableBody>
                    {data.map((s) => {
                        const speed = windSpeed(s);
                        const gust = windGustValue(s);
                        const speedColor = getColorForValue(speed, colorMap);
                        const gustColor = gust ? getColorForValue(gust, colorMap) : undefined;
                        const showG = gust > 0;

                        return (
                            <TableRow key={s.metadata.id}>
                                <TableCell
                                    sx={{
                                        width: { xs: 140, sm: 180 },
                                        fontSize: { xs: 18, sm: 20 },
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    <a href={s.metadata.link} target="_blank" rel="noreferrer">
                                        {s.metadata.name}
                                    </a>
                                </TableCell>

                                {/* <TableCell sx={{ width: { xs: 64, sm: 72 }, fontSize: { xs: 12, sm: 14 }, opacity: 0.9 }}>
                                    {Number(s.metadata.elevation).toLocaleString()}
                                </TableCell> */}

                                <TableCell sx={{
                                    width: { xs: 60, sm: 70 },
                                    fontSize: { xs: 14, sm: 16 },
                                    opacity: 0.7,
                                    color: "white"
                                }}>
                                    {windTime(s, timezone)}
                                </TableCell>

                                <TableCell align="center" sx={{ width: { xs: 44, sm: 50 } }}>
                                    <div style={arrowStyle(windDirection(s))}>
                                        {windDirection(s) ? 4 : ""}
                                    </div>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: { xs: 120, sm: 130 },
                                        fontSize: { xs: 20, sm: 22 },
                                        fontWeight: 700,
                                        color: speedColor,
                                    }}
                                >
                                    <Box sx={{ display: "inline-flex", alignItems: "baseline", gap: 0.5 }}>
                                        <span style={{ color: speedColor }}>{speed}</span>
                                        {showG && (
                                            <>
                                                <span style={{
                                                    opacity: 0.7,
                                                    lineHeight: 1,
                                                    color: "white",
                                                    opacity: 0.7,
                                                    fontWeight: 200,
                                                    fontSize: { xs: 14, sm: 16 },
                                                    paddingLeft: 2,
                                                    paddingRight: 2
                                                }}>g</span>
                                                <span style={{ color: gustColor }}>{gust}</span>
                                            </>
                                        )}
                                    </Box>
                                </TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
}
