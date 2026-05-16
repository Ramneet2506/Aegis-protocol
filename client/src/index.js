import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from "react-hot-toast";
import './index.css';
import App from './App';
<>
  <Toaster position="top-right" />
  <App />
</>
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
