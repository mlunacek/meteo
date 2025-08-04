import { useEffect, useState } from 'react';

import { Box, Button, Typography, Link } from '@mui/material';
import PageHeader from "@/utils/PageHeader";
import PageContainer from '@/utils/PageContainer';

import { fetchJson } from '@/utils/service';
import { useAuth } from '@/Auth/useAuth';

import { useAtomValue } from 'jotai';
import {
    refreshAtom
} from '@/Layout/atoms';


import WindTable from '../Components/MinimalStationTable/WindTable';

const WeatherStationsDarkPage = () => {
    const user = useAuth();
    const [data, setData] = useState();
    const refresh = useAtomValue(refreshAtom)


    useEffect(() => {
        const fetchData = async () => {
            const tmp = await fetchJson({
                key: "station_weather_data/all/timeseries.json",
                bucket: "dev-mlunacek-weather-data",
                operation: "get_object",
            });
            setData(tmp)

        };
        if (user?.isAuthenticated) {
            fetchData();
        }
    }, [user?.isAuthenticated, refresh]);

    return (
        <PageContainer padding={0} backgroundColor={"#2b2f33"}>

            <WindTable
                data={data}
                timezone={"America/Denver"}
                rowSpacing={20}
            />

        </PageContainer>
    )
};

export default WeatherStationsDarkPage;