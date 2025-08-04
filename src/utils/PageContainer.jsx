import { Container, Box } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'xlg', padding, backgroundColor = 'background.dashboard' }) => {

    const minPadding = padding ? padding : 0

    return (
        <Box
            border={0}
            display="flex"
            sx={{
                minHeight: '100dvh', // fallback: '100vh'
                borderBottom: 'none !important',
                boxShadow: 'none !important',
                padding: 0,
                paddingLeft: { xs: minPadding, sm: minPadding, md: minPadding + 2, lg: 3, xl: 4 },
                paddingRight: { xs: minPadding, sm: minPadding, md: minPadding + 2, lg: 3, xl: 4 },
                margin: 0,
                backgroundColor: { backgroundColor },
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
                    backgroundColor: { backgroundColor },
                }}
                component="main"
            >
                {children}
            </Container>
        </Box>
    );
};

export default PageContainer;