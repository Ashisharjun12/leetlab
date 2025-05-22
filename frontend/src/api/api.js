

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
})




