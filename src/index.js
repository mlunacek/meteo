import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider as JotaiProvider } from 'jotai';

import { CssBaseline } from '@mui/material';

import { Amplify } from 'aws-amplify';
import awsconfig from './Auth/aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Optional: Import Amplify UI styles
Amplify.configure(awsconfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Authenticator.Provider>
        <CssBaseline />
        <JotaiProvider>
          <App />
        </JotaiProvider>
      </Authenticator.Provider>
    </BrowserRouter >
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();