


export default function StickyCell({ legendWidth, padding, name, units, color = '#ececec', children }) {

    return (
        <td style={{
            position: 'sticky',
            left: 0,
            background: color,
            zIndex: 10,
            fontSize: `0.7em`,
            color: 'grey',
            width: `${legendWidth}px`,
            padding: `${padding}px`,
            textAlign: 'right', // Align text to the right
        }}>
            {name}
            {children}
            <span
                style={{
                    display: 'inline-block',
                    width: '35px',
                    color: 'black',
                    textAlign: 'center', // Align unit text in the center of the span
                }}
            >
                {units}
            </span>
        </td>
    )

}