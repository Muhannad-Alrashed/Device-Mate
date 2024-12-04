import axios from 'axios';

const axios2 = axios.create({
    // url: "http://localhost:3001",       // Static URL
    url: process.env.REACT_APP_API_URL, // Dynamic URL
});

export default axios2;
