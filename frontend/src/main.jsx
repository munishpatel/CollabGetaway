import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { YjsProvider } from './context/YjsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <YjsProvider 
        roomName="collab-getaway-default-room" 
        userName={localStorage.getItem("collabUserName") || "Anonymous"}
      >
        <App />
      </YjsProvider>
    </BrowserRouter>
  </React.StrictMode>
);