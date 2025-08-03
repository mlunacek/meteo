
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import windyColorScale from './windColorScale'
import StickyCell from './StickyCell'

const GraidentCell = ({ d, index, cellWidth, cellFontSize }) => {

    const cellStyle = {
        padding: '4px',
        margin: 0,
        fontSize: `${cellFontSize}em`,
        width: `${cellWidth}px`,
        border: '1px solid #ddd',  // Add borders to each cell
        textAlign: 'center',
        background: `linear-gradient(to right, ${d.prevColor}, ${d.currentColor}, ${d.nextColor})`
    };


    return (
        <td key={index} style={cellStyle}>
            {d.current ? d.current : ""}
        </td>
    );
};



export default function RowWindSpeed({ column, name, data, legendWidth, padding, cellWidth, cellHeight, cellFontSize }) {

    const scale = windyColorScale()

    const windSpeed = data.map((d) => d[column])

    const colors = windSpeed.map((value, index) => {
        // Handle the boundaries for i-1 and i+1
        const prevValue = index > 0 ? windSpeed[index - 1] : null;  // i-1 (or null for the first element)
        const nextValue = index < windSpeed.length - 1 ? windSpeed[index + 1] : null;  // i+1 (or null for the last element)

        return {
            prev: parseInt(prevValue),
            current: parseInt(value),  // i
            next: parseInt(nextValue),
            prevColor: scale((prevValue + value) / 2),
            currentColor: scale(value),
            nextColor: scale((nextValue + value) / 2)
        };
    });

    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name={name} units="mph" />
            {colors.map((d, index) => (
                <GraidentCell key={index} d={d} index={index} cellWidth={cellWidth} cellFontSize={cellFontSize} />
            ))}
        </tr>
    )
}

