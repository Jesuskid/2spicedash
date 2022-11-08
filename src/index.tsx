import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GemProvider } from './GemContext';
const APP_ID = '2veCjTTSOVtcYuw3kCohS7SVFjZPBc8j0nQyFa00'
const APP_URL = 'https://2nlnyiqavans.usemoralis.com:2053/server'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <MoralisProvider appId={APP_ID} serverUrl={APP_URL}>
      <GemProvider>
        <App />
      </GemProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
