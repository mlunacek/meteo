
import { fetchJson, fetchGzipCsv, submitSQS } from '@/utils/service';
import { includes, keys } from 'lodash'
import { DateTime } from 'luxon';
import SunCalc from 'suncalc';

import { iconsMap } from './iconsMap';
import { get } from 'lodash'

const nightColor = "#eaeaf6"
const dayColor = "#f8f8f8"

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function convertMpsToMph(ms) {
    return ms * 2.23694;
}

const formatTime24hr = (time) => {
    const hours = time.getHours()
    const minutes = time.getMinutes() / 60
    return hours + minutes
};

function getSunValue({
    location, timestamp
}) {

    const dt = DateTime.fromFormat(timestamp, 'yyyy-MM-dd HH:mm:ss');
    // console.log(timestamp, dt)
    const times = SunCalc.getTimes(dt, location?.lat, location?.lon);
    const sunrise = times.sunrise;  // Sunrise time
    const sunset = times.sunset;    // Sunset time
    const start = dt.hour - formatTime24hr(sunrise)
    const end = formatTime24hr(sunset) - dt.hour

    // console.log(start, end)

    if (start > 0 && end > 0) {
        return 'day'
    }
    else if (start < 0 && end > 0) {
        return 'night' //morning
    }
    else if (start > 0 && end < 0) {
        return 'night'
    }
    return 'unknown'
}

function getForecastLabel({
    sky_cover_percent,
    rain_showers,
}) {
    let label = "";

    // Sky Cover
    if (sky_cover_percent <= 10) label = "noClouds";
    else if (sky_cover_percent <= 35) label = "partlyClouds";
    else if (sky_cover_percent <= 70) label = "mostlyClouds";
    else label = "allClouds";

    // What about rain
    if (rain_showers) {
        if (label === 'noClouds') {
            label = "partlyClouds"
        }
        if (rain_showers > 0 && rain_showers < 3) {
            label += "-r2"
        }
        else if (rain_showers > 3) {
            label += "-r3"
        }
    }

    return label;
}



export async function getLocationData(location, setData) {

    // console.log("getLocationData", location)
    const tmp = await fetchJson({
        key: `locations/${location.id}.json`,
        bucket: "dev-mlunacek-weather-data",
        operation: "get_object",
    })

    tmp.forEach((row) => {

        // convert to mountain time
        const utcTime = DateTime.fromFormat(row?.timestamp, "yyyy-MM-dd HH:mm:ss", { zone: 'UTC' })
        const mountainTime = utcTime.setZone('America/Denver');
        const mountainStr = mountainTime.toFormat('yyyy-MM-dd HH:mm:ss')
        row['timestamp'] = mountainStr

        console.log(row.surface)


        // convert to 
        row['surface']['pressure'] = row['surface']['pres']
        row['surface']['cape'] = row['surface']['cape']
        row['surface']['dewpoint'] = celsiusToFahrenheit(row['surface']['dpt'])
        row['surface']['temperature'] = celsiusToFahrenheit(row['surface']['tmp'])
        row['surface']['wind_speed'] = convertMpsToMph(row['surface']['wind_speed'])
        row['surface']['wind_gust'] = convertMpsToMph(row['surface']['gust'])

        // row['surface']['wind_speed'] = (row['surface']['wind_speed'])
        // row['surface']['wind_gust'] = (row['surface']['gust'])

        row['surface']['wind_dir'] = row['surface']['wind_dir']
        row['surface']['precip_amount'] = row['surface']['apcp']
        row['surface']['sky_cover'] = row['surface']['tcdc']
        row['dayNight'] = getSunValue({ location, timestamp: row['timestamp'] })
        row['dayNightColor'] = row['dayNight'] === 'day' ? dayColor : nightColor

        const forecastLabel = getForecastLabel({
            sky_cover_percent: row['surface']['sky_cover'],
            rain_showers: row['surface']['precip_amount']
        })

        row['icon'] = get(get(iconsMap, forecastLabel), row['dayNight'])

    })

    // console.log(tmp)


    // const data = tmp.map((d) => {
    //     const m = {}

    //     keys(d).forEach((k) => {
    //         if (!includes(["timestamp", 'location', 'source'], k)) {
    //             m[`hrrr-${k}`] = +d[k]
    //         }

    //     })
    //     m['source'] = "hrrr"
    //     m['location'] = d['location']
    //     m['timestamp'] = d['timestamp']
    //     return m
    // })

    if (setData) {
        setData(tmp);
    }
    return tmp;
}

