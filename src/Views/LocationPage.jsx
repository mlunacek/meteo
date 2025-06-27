import { useEffect, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import PageHeader from "@/utils/PageHeader";
import PageContainer from '@/utils/PageContainer';

import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { locationsAtom, locationAtom } from '@/HRRR/atoms'

import { appBarTitleAtom, appBarElevationAtom, appBarTimeAtom } from '@/Layout/atoms';


const LocationPage = () => {

    const params = useParams();
    const locations = useAtomValue(locationsAtom);
    const setAppBarTitle = useSetAtom(appBarTitleAtom);

    const [location, setLocation] = useState();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);


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
            console.log("location", location)
            // getLocationData(location, setData)
            setAppBarTitle(location.name)
            setLoading(false)
            return () => {
                setAppBarTitle(null);  // Blank title on exit
            };
        }
    }, [location])



    return (
        <Box >
            <PageContainer>

                {!loading &&
                    <Box>
                        {location.name}
                    </Box>

                }


            </PageContainer>
        </Box >
    )
}

export default LocationPage