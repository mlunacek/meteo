import {
    select,
    scaleTime,
    scaleLinear,
    axisBottom,
    color
} from "d3"

export default function windyColorScale() {
    const color_index = [
        0,
        6,
        8,
        10,
        12,
        15,
        18,
        20,
        25,
        30,
        40
    ]

    // const windy_colors = [
    //     "rgb(244,244,244)",
    //     "rgb(244,244,244)",
    //     "rgb(118,222,250)",
    //     "rgb(0,211,224)",
    //     "rgb(0,233,113)",
    //     "rgb(28,232,0)",
    //     "rgb(104,220,0)",
    //     "rgb(38, 130, 142)",
    //     "rgb(62,74,137)",
    //     "rgb(72, 40, 120)",
    //     "rgb(68, 1, 84)"
    // ]


    const windy_colors = [
        "rgb(244,244,244)",
        "rgb(244,244,244)",
        "rgb(118,222,250)",
        "rgb(0,211,224)",
        "rgb(0,233,113)",
        "rgb(28,232,0)",
        "rgb(104,220,0)",
        "rgb(166,203,0)",
        "rgb(255,155,3)",
        "rgb(255,102,31)",
        "rgb(255,18,129)"
    ]

    const windy_hex_colors = windy_colors.map((d) => { return color(d).formatHex() })
    return scaleLinear().domain(color_index).range(windy_hex_colors);
}
