import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material'

import AppBar from '@/Layout/AppBar';
import Layout from '@/Layout/Layout';

import { AuthPage } from '@/Auth/page';
import RequireAuth from '@/Auth/RequireAuth';
import HomePage from '@/Views/HomePage';
import AboutPage from '@/Views/AboutPage';
import MeteoPage from '@/Views/MeteoPage';


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
          <Route path="/" element={
            <HomePage />
          } />
          <Route path="/about" element={
            <AboutPage />
          } />
          <Route path="/meteo" element={
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