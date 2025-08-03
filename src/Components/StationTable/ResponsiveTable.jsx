import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import {
    Box
} from '@mui/material';

// import VerticalTable from './Vertical/Table';
import HorizontalTable from './Horizontal/Table';
import useContainerWidth from "@/utils/useContainerWidth";

import '@/Components/WeatherTable/assets/main.css';

export default function ResponsiveTable({ data }) {

    const [containerRef, width] = useContainerWidth();

    // Detect orientation: true if portrait
    const isPortrait = useMediaQuery('(orientation: portrait)');


    // Optional: Track orientation state for debugging or effects
    const [orientation, setOrientation] = useState('portrait');

    useEffect(() => {
        setOrientation(isPortrait ? 'portrait' : 'landscape');
    }, [isPortrait]);

    return (

        <Box
            ref={containerRef}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "top",
                justifyContent: "center",
            }}
        >
            <HorizontalTable
                data={data}
                timezone={"America/Denver"}
            />
        </Box>
    );
}