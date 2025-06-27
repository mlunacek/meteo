import { useEffect } from 'react';
import { Box, Typography, Link } from '@mui/material';
import PageHeader from "@/utils/PageHeader";
import PageContainer from '@/utils/PageContainer';
import { fetchJson } from '@/utils/service';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/Auth/useAuth';

import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { locationsAtom } from '@/HRRR/atoms'
import LoginInvite from './LoginInvite';

const MeteoPage = () => {

    const user = useAuth();
    const [locations, setLocations] = useAtom(locationsAtom);

    useEffect(() => {
        const fetchLocations = async () => {
            const tmp = await fetchJson({
                key: "locations.json",
                bucket: "dev-mlunacek-weather-data",
                operation: "get_object",
            });
            setLocations(tmp)

        };
        if (user?.isAuthenticated) {
            fetchLocations();
        }
    }, [user?.isAuthenticated]);

    useEffect(() => {
        if (locations) {
            console.log(locations)
        }
    }, [locations])


    return (
        <PageContainer padding={2}>
            <PageHeader title="Meteo" />


            {
                user?.isAuthenticated ?
                    <Box sx={{ p: 2, width: "100%", maxWidth: "1200px", mx: "auto" }}>
                        {locations?.map((location, i) => (
                            <Box key={i}>
                                <Link
                                    key={location.id}
                                    component={RouterLink}
                                    to={`/location/${location.id}`}
                                    underline="hover"
                                    sx={{ flex: "1 1 200px" }} // Flex-grow layout for wider links
                                >
                                    {location.name}
                                </Link>
                            </Box>
                        ))}
                    </Box>
                    :
                    <LoginInvite />

            }




        </PageContainer>
    )
};

export default MeteoPage;