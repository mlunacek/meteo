import { Box, Typography, Link } from '@mui/material';
import PageHeader from "@/utils/PageHeader";
import PageContainer from '@/utils/PageContainer';

const AboutPage = () => {

    return (
        <PageContainer padding={2}>
            <PageHeader title="About" />

            <Typography>
                This data is pulled from <a href="https://www.weather.gov" target="_blank" rel="noopener noreferrer">weather.gov</a>
            </Typography>



        </PageContainer>
    )
};

export default AboutPage;