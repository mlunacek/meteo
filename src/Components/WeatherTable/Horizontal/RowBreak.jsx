import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTime } from 'luxon';
import StickyCell from './StickyCell'

// Function to convert timestamp string to 12-hour time format with am/pm
function formatTemperature(temp) {
    if (temp) {
        return `${temp}°`;
    }  // Concatenate the temperature with the degree symbol
    return ""
}

export default function RowBreak({ data, legendWidth, padding, cellWidth, cellHeight, cellFontSize }) {

    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name="" units="" color="white" />

            {data.map((d, index) => (
                <td
                    style={{
                        width: `${cellWidth}px`,
                        fontSize: `${cellFontSize}em`,
                    }}
                    key={index}
                    align="center">
                </td>
            ))}
        </tr>
    )
}
