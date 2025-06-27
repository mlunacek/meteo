import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title }) => (
    <Box>
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingBottom={0}
        >
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ color: 'text.primary' }}
            >
                {title}
            </Typography>
        </Box>
    </Box>
);

export default PageHeader;
