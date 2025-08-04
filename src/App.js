import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material'

import AppBar from '@/Layout/AppBar';
import Layout from '@/Layout/Layout';

import { AuthPage } from '@/Auth/page';
import RequireAuth from '@/Auth/RequireAuth';
import AboutPage from '@/Views/AboutPage';
import MeteoPage from '@/Views/MeteoPage';
import WeatherStationsPage from '@/Views/WeatherStationsPage';
import WeatherStationsDarkPage from '@/Views/WeatherStationsDarkPage';

import LocationPage from '@/Views/LocationPage';
import ResponsiveLayout from '@/Views/ResponsiveLayout';

function App() {




  return (
    <Box>
      <CssBaseline />
      <AppBar />
      <Layout>
        <Routes>
          <Route path="/auth" element={
            <AuthPage />
          } />
          <Route path="/about" element={
            <AboutPage />
          } />
          <Route path="/" element={
            <MeteoPage />
          } />
          <Route path="/mobile" element={
            <ResponsiveLayout />
          } />
          <Route path="/location/:id" element={
            // <RequireAuth>
            <LocationPage />
            // </RequireAuth>
          } />
          <Route path="/location" element={
            <RequireAuth>
              <MeteoPage />
            </RequireAuth>
          } />
          <Route path="/weather-stations" element={
            // <RequireAuth>
            <WeatherStationsPage />
            // </RequireAuth>
          } />
          <Route path="/weather-stations-dark" element={
            // <RequireAuth>
            <WeatherStationsDarkPage />
            // </RequireAuth>
          } />
        </Routes>

      </Layout>
    </Box >
  );
}

export default App;