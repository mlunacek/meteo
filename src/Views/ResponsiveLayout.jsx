import React, { useState } from 'react';
import {
    AppBar, Toolbar, Box, Typography, Select, MenuItem, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function ResponsiveLayout() {
    const theme = useTheme();

    // break at lg == 1200
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const isLandscape = useMediaQuery('(orientation: landscape)');

    // Only consider mobile landscape if width is small enough
    const isMobileLandscape = isLandscape && window.innerWidth <= 900;

    const forceMobile = isSmallScreen || isMobileLandscape;

    const [location, setLocation] = useState('denver');
    const [view, setView] = useState('view1');

    const handleLocationChange = (event) => setLocation(event.target.value);
    const handleViewChange = (event) => setView(event.target.value);

    console.log(window.innerWidth, isLandscape, isMobileLandscape, isSmallScreen)

    return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            <AppBar position="static">
                <Toolbar sx={{ gap: 2 }}>

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        My App
                    </Typography>

                    <Select
                        value={location}
                        onChange={handleLocationChange}
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: 'white', borderRadius: 1 }}
                    >
                        <MenuItem value="denver">Denver</MenuItem>
                        <MenuItem value="boulder">Boulder</MenuItem>
                        <MenuItem value="vicky">Vicky</MenuItem>
                    </Select>

                    {forceMobile && (
                        <Select
                            value={view}
                            onChange={handleViewChange}
                            variant="outlined"
                            size="small"
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                        >
                            <MenuItem value="view1">View 1</MenuItem>
                            <MenuItem value="view2">View 2</MenuItem>
                            <MenuItem value="view3">View 3</MenuItem>
                        </Select>
                    )}

                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: forceMobile ? 'column' : 'row', gap: 2 }}>

                {(!forceMobile || view === 'view1') && (
                    <Box sx={{ flex: 1, p: 2, border: '1px solid', borderRadius: 2 }}>
                        <Typography variant="h6">View 1 - {location}</Typography>
                        <p>Content for View 1</p>
                    </Box>
                )}

                {(!forceMobile || view === 'view2') && (
                    <Box sx={{ flex: 1, p: 2, border: '1px solid', borderRadius: 2 }}>
                        <Typography variant="h6">View 2 - {location}</Typography>
                        <p>Content for View 2</p>
                    </Box>
                )}

                {(!forceMobile || view === 'view3') && (
                    <Box sx={{ flex: 1, p: 2, border: '1px solid', borderRadius: 2 }}>
                        <Typography variant="h6">View 3 - {location}</Typography>
                        <p>Content for View 3</p>
                    </Box>
                )}

            </Box>
        </Box>
    );
}
