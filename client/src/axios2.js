import axios from 'axios';

const axios2 = axios.create({
    // baseURL: "http://localhost:3001",        // Development
    baseURL: `https://${process.env.REACT_APP_API_URL}`,     // Production
    withCredentials: true,
});

export default axios2;