import axios from 'axios';

const axios2 = axios.create({
    // baseURL: "http://localhost:8080",        // Development
    baseURL: process.env.REACT_APP_API_URL,     // Production
    withCredentials: true,
});

export default axios2;