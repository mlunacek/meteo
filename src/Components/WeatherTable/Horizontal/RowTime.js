
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTime } from 'luxon';
import { zip } from 'lodash'
import StickyCell from './StickyCell'

export default function RowTime({
    column,
    data,
    sunValues,
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

    const formattedTimestamps = data.map((d) => {

        const dt = DateTime.fromFormat(d['timestamp'], 'yyyy-MM-dd HH:mm:ss');

        // Extract day of week and date
        const dayOfWeek = dt.toFormat('cccc'); // Full name of the day of the week
        const date = dt.toFormat('ccc dd'); // Date in 'YYYY-MM-DD' format

        // Extract time of day with AM/PM
        const timeOfDay = dt.toFormat("ha").toLowerCase(); // Time in 'hh:mm AM/PM' format
        const border = timeOfDay === '11pm' ? 1 : 0
        return {
            dayOfWeek,
            date,
            border,
            timeOfDay,
            sunValue: d['sunValue'],
            dayNightColor: d['dayNightColor']
        };
    });

    // formattedTimestamps.forEach((d) => {
    //     console.log(d)
    // })

    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name="Hours" />
            {formattedTimestamps.map((d, index) => (
                <td
                    style={{
                        width: `${cellWidth}px`,
                        fontSize: `${cellFontSize}em`,
                        color: "grey",
                        borderRight: `${d.border}px solid lightgrey`,
                        // borderLeft: index === 0 ? '1px solid lightgrey' : '',
                        // background: `linear-gradient(to right, ${d.sunValue?.p}, ${d.sunValue?.n})`
                        background: `${d.dayNightColor}`,
                        borderLeft: selected === index ? `${selectedWidth}px solid ${selectedColor}` : '',
                        borderRight: selected === index ? `${selectedWidth}px solid ${selectedColor}` : '',
                    }}
                    onClick={() => handleCellClick(index)}
                    key={index}
                    align="center">
                    {d.timeOfDay}
                </td>
            ))}
        </tr>
    )
}
