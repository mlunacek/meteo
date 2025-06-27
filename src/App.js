import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material'

import AppBar from '@/Layout/AppBar';
import Layout from '@/Layout/Layout';

import { AuthPage } from '@/Auth/page';
import RequireAuth from '@/Auth/RequireAuth';
import AboutPage from '@/Views/AboutPage';
import MeteoPage from '@/Views/MeteoPage';
import LocationPage from '@/Views/LocationPage';


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
          <Route path="/location/:id" element={
            <RequireAuth>
              <LocationPage />
            </RequireAuth>
          } />
          <Route path="/location" element={
            <RequireAuth>
              <MeteoPage />
            </RequireAuth>
          } />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;