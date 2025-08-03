import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTime } from 'luxon';

import StickyCell from './StickyCell'

// Function to convert timestamp string to 12-hour time format with am/pm
function formatPrecip(temp) {
    if (temp === "slight_chance") {
        return "s"
    }
    else if (temp === "chance") {
        return "c"
    }
    else if (!temp) {
        return ""
    }

    return "x"  // Concatenate the temperature with the degree symbol
}

export default function RowSnowEvent({ column, data, legendWidth, padding, cellWidth, cellHeight, cellFontSize }) {

    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name="Snowfall" units="" />
            {data.map((d, index) => (
                <td
                    style={{
                        width: `${cellWidth}px`,
                        fontSize: `${cellFontSize}em`,
                        // background: `linear-gradient(to right, ${d.sunValue.p}, ${d.sunValue.n})`
                        background: `${d.dayNightColor}`,
                    }}
                    key={index}
                    align="center">
                    {formatPrecip(d?.[column])}
                </td>
            ))}
        </tr>
    )
}
