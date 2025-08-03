import { useEffect, useState } from 'react';

import { Box, Typography, Link } from '@mui/material';
import PageHeader from "@/utils/PageHeader";
import PageContainer from '@/utils/PageContainer';

import { fetchJson } from '@/utils/service';
import { useAuth } from '@/Auth/useAuth';

import ResponsiveTable from '../Components/StationTable/ResponsiveTable';

const WeatherStationsPage = () => {
    const user = useAuth();
    const [data, setData] = useState();

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
    }, [user?.isAuthenticated]);



    return (
        <PageContainer padding={2}>
            <PageHeader title="Weather Stations" />

            <Box border={0} paddingTop={0}>
                {data?.map(item => (
                    <Box key={item.metadata.id} paddingTop={2}>
                        <Box paddingBottom={0.5}>
                            <Link
                                href={item.metadata?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.metadata.name}
                            </Link> {item.metadata?.elevation?.toLocaleString()}
                        </Box>
                        <ResponsiveTable data={item} />
                    </Box>
                ))}
            </Box>

        </PageContainer>
    )
};

export default WeatherStationsPage;