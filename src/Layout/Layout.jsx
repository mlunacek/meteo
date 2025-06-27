import React, { useState, useMemo, useEffect } from 'react';

import {
    Box,
    Grid,
    Paper,
    Drawer,
    CssBaseline,
    Toolbar,
    Typography,
    useMediaQuery,
    Fade,
    Collapse,
    Divider
} from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

import { Drawer as CustomDrawer } from '@/Layout/Drawer';
import { useAtom, useAtomValue } from 'jotai';
import { showHeaderAtom, drawerOpenAtom, showFooterAtom } from '@/Layout/atoms';

const drawerWidth = 240;

const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'isMobile' && prop !== 'open',
})((props) => ({
    // flexGrow: 1,
    padding: props.theme.spacing(3),
    marginLeft: 0, //props.isMobile ? 0 : props.open ? drawerWidth : 0,
    transition: props.theme.transitions.create(['margin', 'width'], {
        easing: props.theme.transitions.easing.sharp,
        duration: props.theme.transitions.duration.leavingScreen,
    }),
})
);


function Layout({ children }) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenAtom);
    const showHeader = useAtomValue(showHeaderAtom);
    const atomShowFooter = useAtomValue(showFooterAtom);
    const [drawerTop, setDrawerTop] = useState(0);

    const paddingTop = useMemo(() => {
        return isMobile ? 8 : 0;
    }, [isMobile])

    const headerHeight = useMemo(() => {
        if (showHeader) {
            // return isMobile ? '90px' : '130px';
            return '130px';
        }
        return 0;
    }, [isMobile, showHeader]);

    useEffect(() => {
        if (isMobile) {
            setDrawerOpen(false)
        }
        // if (isMobile) {
        //     setDrawerOpen(false); //false
        //     setDrawerTop(85);
        // } else {
        //     setDrawerTop(showHeader ? '180px' : '50px');
        // }
        setDrawerTop(showHeader ? '180px' : '180px');
    }, [isMobile, showHeader]);

    // console.log("isMobile", isMobile)

    return (
        <Box
            sx={{
                display: 'flex',
                overflow: 'visible',
                minHeight: `calc(100vh - ${drawerTop})`,
            }}
        >
            <CssBaseline />

            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    flexShrink: 0,
                    width: drawerOpen ? drawerWidth : 0,
                    display: isMobile && !drawerOpen ? 'none' : 'block',
                    zIndex: isMobile ? 10 : 2000, // Elevate for mobile overlay
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        ...(isMobile
                            ? {

                            }
                            : {
                                position: 'sticky',
                                top: headerHeight,
                                alignSelf: 'flex-start',
                                maxHeight: `calc(100vh - ${headerHeight})`,
                            }),
                    },
                }}
            >
                <Box p={2} paddingTop={paddingTop}>
                    {/* <Toolbar /> */}
                    <CustomDrawer open={drawerOpen}>{children}</CustomDrawer>
                </Box>
            </Drawer>

            <Box sx={{
                overflow: 'hidden', // or 'auto', 'scroll', etc., depending on your need
                width: '100%',
                height: '100%',
            }}>

                {/* <Main open={drawerOpen} isMobile={isMobile}> */}
                {children}
                {/* </Main> */}
            </Box>
        </Box>
    );
}

export default Layout;
