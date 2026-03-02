// axios.ts - Configured Axios instance shared by all API modules.
// baseURL points to the local Express backend running on port 3001.
// withCredentials: true ensures HTTP-only cookies (JWT) are sent with every request,
// which is required for the cookie-based auth strategy.
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true
});

export default api;