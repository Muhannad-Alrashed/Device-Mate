import axios from 'axios';

const axios2 = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001", // Use env variable or fallback to localhost
});

export default axios2;
