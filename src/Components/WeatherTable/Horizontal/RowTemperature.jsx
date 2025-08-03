import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTime } from 'luxon';
import StickyCell from './StickyCell'

// Function to convert timestamp string to 12-hour time format with am/pm
function formatTemperature(temp) {
    if (temp) {
        return `${parseInt(temp)}°`;
    }  // Concatenate the temperature with the degree symbol
    return ""
}

export default function RowTemperature({
    column,
    data,
    legendWidth,
    padding,
    cellWidth,
    cellHeight,
    cellFontSize,
    handleCellClick,
    selected,
    selectedColor,
    selectedWidth
}) {

    // console.log(data.map((d) => d.sunValue))

    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name="Temp" units="°F" />

            {data.map((d, index) => (
                <td
                    style={{
                        width: `${cellWidth}px`,
                        fontSize: `${cellFontSize}em`,
                        background: `${d.dayNightColor}`,
                        borderLeft: selected === index ? `${selectedWidth}px solid ${selectedColor}` : '',
                        borderRight: selected === index ? `${selectedWidth}px solid ${selectedColor}` : '',
                    }}
                    key={index}
                    onClick={() => handleCellClick(index)}
                    align="center">
                    {formatTemperature(d?.surface?.[column])}
                </td>
            ))}
        </tr>
    )
}
