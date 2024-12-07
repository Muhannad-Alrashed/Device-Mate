import axios from 'axios';

const axios2 = axios.create({
    baseURL: process.env.REACT_APP_API_URL          // Production
        || 'http://localhost:3001',                 // Development
    withCredentials: true,
});


export default axios2;