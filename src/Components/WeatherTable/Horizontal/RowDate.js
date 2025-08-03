import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTime } from 'luxon';

import StickyCell from './StickyCell'
import { pad } from 'lodash';

export default function RowDate({ column, data, legendWidth, padding, cellWidth, cellHeight }) {

    const results = useMemo(() => {
        if (!data) return

        // console.log(data)

        const formattedTimestamps = data?.map((d) => d[column]).map(timestamp => {
            const dt = DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss');
            const date = dt.toFormat('ccc dd'); // Date in 'YYYY-MM-DD' format

            return {
                date
            };
        });

        const groupedDates = formattedTimestamps.reduce((acc, { date }) => {
            if (acc.has(date)) {
                acc.get(date).count += 1; // If exists, increment the count
            } else {
                acc.set(date, { count: 1, date }); // If not, initialize the count to 1
            }
            return acc;
        }, new Map());

        // Convert the Map back to an array while maintaining the original order
        return Array.from(groupedDates.values());

    }, [data])


    return (
        <tr style={{ padding: `${padding}px`, height: `${cellHeight}px` }}>
            <StickyCell padding={padding} legendWidth={legendWidth} name="Date" />

            {/* <td style={{
                position: 'sticky',
                left: 0,
                background: '#ececec',
                zIndex: 100,
                fontSize: `0.6em`,
                width: `${legendWidth}px`,
                padding: `${padding}px`,
                textAlign: 'right', // Align text to the right
            }}>
                Date
                <span
                    style={{
                        display: 'inline-block',
                        width: '20px',
                        textAlign: 'center', // Align unit text in the center of the span
                    }}
                >

                </span>
            </td> */}
            {results.map((d, index) => (
                <td
                    style={{
                        width: `${cellWidth * d.count}px`,
                        border: '1px solid lightgrey', // Add thin light grey border
                    }}
                    key={index}

                    colSpan={d.count}
                    align="center">
                    {d.date}
                </td>
            ))}
        </tr>
    )
}
