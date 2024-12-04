import axios from 'axios';

const axios2 = axios.create({
    url: process.env.REACT_APP_API_URL || "http://localhost:3001", // Dynamic URL
});

export default axios2;
