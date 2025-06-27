import { Container, Box } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'xlg', padding }) => {

    const minPadding = padding ? padding : 0

    return (
        <Box
            border={0}
            display="flex"
            sx={{
                borderBottom: 'none !important',
                boxShadow: 'none !important',
                padding: 0,
                paddingLeft: { xs: minPadding, sm: minPadding, md: minPadding + 2, lg: 3, xl: 4 },
                paddingRight: { xs: minPadding, sm: minPadding, md: minPadding + 2, lg: 3, xl: 4 },
                margin: 0,
                backgroundColor: 'background.dashboard',
            }}
        >
            <Container
                maxWidth={maxWidth}
                sx={{
                    spacing: { xs: 0, sm: 0.5, md: 2, lg: 2, xl: 4 },
                    paddingTop: { xs: 0, sm: 0.5, md: 2, lg: 3, xl: 4 },
                    paddingLeft: { xs: 0, sm: 0, md: 2, lg: 3, xl: 4 },
                    paddingRight: { xs: 0, sm: 0, md: 2, lg: 3, xl: 4 },
                    borderBottom: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'background.dashboard',
                }}
                component="main"
            >
                {children}
            </Container>
        </Box>
    );
};

export default PageContainer;