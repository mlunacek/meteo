import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
    AppBar as MuiAppBar,
    Toolbar,
    Divider,
    Typography,
    Box
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import { Menu as MenuIcon } from '@mui/icons-material';

import { useAtom, useAtomValue } from 'jotai';
import {
    showAppBarAtom,
    drawerOpenAtom,
    appBarTitleAtom,
    appBarTimeAtom,
    appBarElevationAtom,
} from '@/Layout/atoms';

export default function AppBar({ children }) {

    const showAppBar = useAtomValue(showAppBarAtom);
    const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);

    const appBarTile = useAtomValue(appBarTitleAtom);

    const appBarTime = useAtomValue(appBarTimeAtom);
    const appBarElevation = useAtomValue(appBarElevationAtom);

    const time = useMemo(() => {
        if (appBarTime) {
            const dt = DateTime.fromFormat(appBarTime, 'yyyy-MM-dd HH:mm:ss');
            return dt.toFormat("ha").toLowerCase();
        }
    }, [appBarTime])


    if (!showAppBar) {
        return null;
    }

    return (
        <MuiAppBar elevation={0} position="sticky" color="inherit" variant="dense">
            <Divider />
            <Toolbar variant="dense">

                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 1 }}
                    onClick={() => setDrawerOpen((prev) => !prev)}
                >
                    {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>

                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    component={Link}
                    sx={{ color: "grey", mr: 1 }}
                    to={"/"}
                >
                    <HomeFilledIcon />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Space between left and right sections
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 300,
                            textDecoration: 'none',
                            paddingRight: 1,
                            color: 'inherit',
                        }}
                    >
                        {appBarTile}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        {appBarElevation &&
                            <Typography
                                variant="subtitle"
                                sx={{
                                    mr: 2,
                                    fontWeight: 300,
                                    textDecoration: 'none',
                                    paddingRight: 1,
                                    color: 'grey',
                                }}
                            >
                                {parseInt(appBarElevation).toLocaleString()}'
                            </Typography>
                        }

                        {appBarTime &&
                            <Typography
                                variant="subtitle"
                                sx={{
                                    fontWeight: 300,
                                    textDecoration: 'none',
                                    paddingRight: 1,
                                    color: 'grey',
                                }}
                            >
                                {time}
                            </Typography>
                        }
                    </Box>

                </Box>

                {children}

            </Toolbar>

            <Divider />
        </MuiAppBar>
    );
}

