import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
    AppBar as MuiAppBar,
    Toolbar,
    Divider,
    Typography,
    Select,
    MenuItem,
    Box,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useLocation, useNavigate } from 'react-router-dom';
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
    forceMobileAtom
} from '@/Layout/atoms';

import {
    locationsAtom,
    locationAtom,
    hrrrViewAtom
} from '@/HRRR/atoms'

import { SvgIcon } from '@mui/material';

function MSquareIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 30 30">
            <rect width="30" height="30" rx="3" fill="#1976d2" />
            <text x="6" y="22" fontSize="20" fill="white" fontWeight="bold">M</text>
        </SvgIcon>
    );
}


export default function AppBar({ children }) {

    const theme = useTheme();
    const pagelocation = useLocation();
    const navigate = useNavigate();
    const onLocationPage = pagelocation.pathname.startsWith('/location/');

    const locations = useAtomValue(locationsAtom);
    const [location, setLocation] = useAtom(locationAtom)
    const [view, setView] = useAtom(hrrrViewAtom)

    const showAppBar = useAtomValue(showAppBarAtom);
    const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);
    const [forceMobile, setForceMobile] = useAtom(forceMobileAtom);

    const appBarTile = useAtomValue(appBarTitleAtom);

    const appBarTime = useAtomValue(appBarTimeAtom);
    const appBarElevation = useAtomValue(appBarElevationAtom);


    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const isLandscape = useMediaQuery('(orientation: landscape)');
    const isMobileLandscape = isLandscape && window.innerWidth <= 900;

    useEffect(() => {
        setForceMobile(isSmallScreen || isMobileLandscape)
    }, [isSmallScreen, isMobileLandscape])


    const time = useMemo(() => {
        if (appBarTime) {
            const dt = DateTime.fromFormat(appBarTime, 'yyyy-MM-dd HH:mm:ss');
            return dt.toFormat("ha").toLowerCase();
        }
    }, [appBarTime])


    if (!showAppBar) {
        return null;
    }

    const handleLocationChange = (event) => {
        navigate(`/location/${event.target.value}`)
    }
    const handleViewChange = (event) => setView(event.target.value);

    // console.log("location?.id", location?.id)

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
                    <MSquareIcon />
                    {/* <HomeFilledIcon /> */}
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',// Space between left and right sections
                        width: '100%',
                    }}
                >
                    {/* <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 300,
                            textDecoration: 'none',
                            paddingRight: 1,
                            color: 'inherit',
                        }}
                    >
                        {appBarTile}
                    </Typography> */}

                    {onLocationPage && location &&
                        <Select
                            value={location?.id}
                            onChange={handleLocationChange}
                            variant="outlined"
                            size="small"

                            sx={{ backgroundColor: 'white', borderRadius: 1, width: 150, marginLeft: 1 }}
                        >
                            {locations.map((d, i) => (
                                <MenuItem key={i} value={d?.id}>{d?.name}</MenuItem>
                            ))}

                        </Select>
                    }

                    {onLocationPage && forceMobile && (
                        <Select
                            value={view}
                            onChange={handleViewChange}
                            variant="outlined"
                            size="small"
                            sx={{ backgroundColor: 'white', borderRadius: 1, width: 100, marginLeft: 1 }}
                        >
                            <MenuItem value="basic">Basic</MenuItem>
                            <MenuItem value="skewt">SkewT</MenuItem>
                        </Select>
                    )}



                    {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
                    </Box> */}

                </Box>

                {children}

            </Toolbar>

            <Divider />
        </MuiAppBar >
    );
}

