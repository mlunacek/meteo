
import { zip } from 'lodash'

export function calculateHeight(inHeight, width) {

    // console.log("height/width", inHeight / width)
    if (inHeight / width > 1.65) {
        return width * 1.65
    }

    if (inHeight === -1) {
        return width
    }
    else if (inHeight > 0) {
        return inHeight
    }
}

export function computeYExtent(data) {

}

export function formatLineData(data) {
    return data.map((d) => {
        return {
            'timestamp': d.timestamp,
            'ccl': d.sounding.ccl_press,
            'lcl': d.sounding.lcl_press
        }
    })
}

export function formatHeatmapData(data) {
    const tmp = data.map((d) => {
        return zip(d.sounding.pres, d.sounding.wind_speed, d.sounding.wind_dir).slice(0, -1).map((row) => {
            return {
                'timestamp': d.timestamp,
                'pressure': row[0],
                'wind_speed': row[1],
                'wind_dir': row[2]
            }
        })
    })
    return tmp.flat()
}