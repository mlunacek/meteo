import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import {
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useSetAtom } from 'jotai'
import { drawerOpenAtom } from '@/Layout/atoms';

export function Drawer() {


    const location = useLocation();
    const setDrawerOpen = useSetAtom(drawerOpenAtom);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isSelected = (path) => {
        return location.pathname?.startsWith(path);
    };

    const isEqual = (path) => {
        return location.pathname === path;
    };

    const handleDrawerItemClick = () => {
        if (isMobile) {
            setDrawerOpen(false);
        }
    };

    return (
        <List>


            <ListItemButton
                selected={isEqual('/')}
                disabled={false}
                component={Link}
                to={"/"}
                onClick={handleDrawerItemClick}
            >
                <ListItemText primary={'Home'} />
            </ListItemButton>

            <ListItemButton
                selected={isSelected('/about')}
                disabled={false}
                component={Link}
                to={"/about"}
                onClick={handleDrawerItemClick}
            >
                <ListItemText primary={'About'} />
            </ListItemButton>


        </List>
    );
}
