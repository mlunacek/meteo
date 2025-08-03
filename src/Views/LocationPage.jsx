import { useEffect, useState, useMemo } from 'react';
import { Box, Skeleton, Grid, Paper, Typography, Button, Drawer, IconButton } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useParentSize } from '@visx/responsive';

import PageHeader from "@/utils/PageHeader";
import PageContainer from '@/utils/PageContainer';
import { styled } from '@mui/material/styles';

import { useParams } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { locationsAtom, locationAtom, hrrrViewAtom } from '@/HRRR/atoms'
import { getLocationData } from '@/HRRR/data/service'
import {
    forceMobileAtom
} from '@/Layout/atoms';


import { appBarTitleAtom, appBarElevationAtom, appBarTimeAtom } from '@/Layout/atoms';

import { timestampAtom } from '../Components/atoms';
import ResponsiveTable from '../Components/WeatherTable/ResponsiveTable';
import SkewT from '../Components/SkewT/SkewT';
import Timestamps from '../Components/Timestamps/Timestamps';
import Heatmap from '../Components/Heatmap/Heatmap';


const LocationPage = () => {

    const params = useParams();
    const view = useAtomValue(hrrrViewAtom);
    const locations = useAtomValue(locationsAtom);
    const timestamp = useAtomValue(timestampAtom);
    const setAppBarTitle = useSetAtom(appBarTitleAtom);
    const forceMobile = useAtomValue(forceMobileAtom);

    const [open, setOpen] = useState(true);
    const drawerWidth = 600;

    const [location, setLocation] = useAtom(locationAtom);
    const [data, setData] = useState();
    const [sounding, setSounding] = useState();
    const [loading, setLoading] = useState(true);
    const [height, setHeight] = useState(650)
    const [width, setWidth] = useState(6)
    const [zoomPressure, setZoomPressure] = useState(150)

    useEffect(() => {
        setLoading(true)
    }, [params])

    useEffect(() => {
        if (locations && params?.id) {
            locations.forEach((d) => {
                if (d.id === params?.id) {
                    setLocation(d)
                }
            })
        }
    }, [params?.id, locations])

    useEffect(() => {
        if (location) {
            // console.log("location", location)
            getLocationData(location, setData)
            setAppBarTitle(location.name)

            return () => {
                setAppBarTitle(null);  // Blank title on exit
            };
        }
    }, [location])

    useEffect(() => {
        if (data && timestamp >= 0) {

            // console.log(data[timestamp])

            const tmp = data[timestamp]?.sounding?.pres?.map((d, i) => {
                return {
                    'timestamp': timestamp,
                    'hght': data[timestamp]?.sounding?.height[i],
                    'press': data[timestamp]?.sounding?.pres[i],
                    'temp': data[timestamp]?.sounding?.tmp[i],
                    'dwpt': data[timestamp]?.sounding?.dpt[i],
                    'wspd': data[timestamp]?.sounding?.wind_speed[i],
                    'wdir': data[timestamp]?.sounding?.wind_dir[i],
                }
            })
            // tmp['lcl_tmp'] = data[timestamp]?.sounding?.lcl_tmp
            // tmp['lcl_press'] = data[timestamp]?.sounding?.lcl_press
            // tmp['ccl_tmp'] = data[timestamp]?.sounding?.ccl_tmp
            // tmp['ccl_press'] = data[timestamp]?.sounding?.ccl_press


            setSounding(tmp)
        }
    }, [data, timestamp])

    useEffect(() => {
        if (sounding) {
            setLoading(false)
        }
    }, [sounding])


    useEffect(() => {
        console.log("data", data)
    }, [data])


    function handelHeight(inputHeight) {
        if (height === 600) {
            setHeight(-1)
        }
        else {
            setHeight(600)
        }
    }



    return (
        <Box>

            <Timestamps />

            <Box sx={{ flex: 1, maxWidth: '100%', paddingLeft: 2, paddingRight: 2 }}>
                <ResponsiveTable
                    location={location}
                    data={data} />
            </Box>


            <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: forceMobile ? 'column' : 'row', gap: 2 }}>


                {(!forceMobile || view === 'basic') && (
                    <Box sx={{ flex: 1, maxWidth: forceMobile ? '100%' : '50%' }}>

                        {/* <Heatmap
                            data={data}
                            inHeight={height} /> */}

                    </Box>
                )}

                {(!forceMobile || view === 'skewt') && (
                    <Box sx={{ flex: 1, maxWidth: forceMobile ? '100%' : '50%' }}>

                        <Button onClick={() => setZoomPressure(500)}>18K</Button>
                        <Button onClick={() => setZoomPressure(350)}>25K</Button>
                        <Button onClick={() => setZoomPressure(150)}>45K</Button>

                        {/* <SkewT
                            data={sounding}
                            inHeight={height}
                            zoomPressure={zoomPressure} /> */}

                    </Box>

                )}

            </Box>
        </Box>


    )
}

export default LocationPage