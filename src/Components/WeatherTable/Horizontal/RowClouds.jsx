import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTime } from 'luxon';

import StickyCell from './StickyCell'

// Function to convert timestamp string to 12-hour time format with am/pm
function formatClouds(temp) {
    if (temp !== 0) {
        return `${parseInt(temp)}`
    }

    return ""  // Concatenate the temperature with the degree symbol
}

export default function RowClouds({
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

    // console.log(data)

    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name="Clouds" units="%" />
            {data.map((d, index) => (
                <td
                    style={{
                        width: `${cellWidth}px`,
                        fontSize: `${cellFontSize}em`,
                        // background: `linear-gradient(to right, ${d.sunValue.p}, ${d.sunValue.n})`
                        background: `${d?.dayNightColor}`,
                        borderLeft: selected === index ? `${selectedWidth}px solid ${selectedColor}` : '',
                        borderRight: selected === index ? `${selectedWidth}px solid ${selectedColor}` : '',
                    }}
                    key={index}
                    onClick={() => handleCellClick(index)}
                    align="center">
                    {formatClouds(d?.surface?.[column])}
                </td>
            ))}
        </tr>
    )
}
