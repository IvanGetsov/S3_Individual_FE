import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8080";
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    config.headers['Content-Type'] = 'application/json';

    return config;
  }
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
