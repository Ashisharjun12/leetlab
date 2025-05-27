import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});




// Auth API endpoints
export const authAPI = {
    login: (data) => axiosInstance.post('/auth/login', data),
    signup: (data) => axiosInstance.post('/auth/register', data),
    logout: () => axiosInstance.post('/auth/logout'),
    checkAuth: () => axiosInstance.get('/auth/check'),
};

// User API endpoints
export const userAPI = {
    getProfile: () => axiosInstance.get('/user/profile'),
    updateProfile: (data) => axiosInstance.put('/user/profile', data),
};

// Problem API endpoints
export const problemAPI = {
    getAllProblems: () => axiosInstance.get('/problem'),
    getProblem: (id) => axiosInstance.get(`/problem/${id}`),
    createProblem: (data) => axiosInstance.post('/problem', data),
    updateProblem: (id, data) => axiosInstance.put(`/problem/${id}`, data),
    deleteProblem: (id) => axiosInstance.delete(`/problem/${id}`),
};

// Admin API endpoints
export const adminAPI = {
    getAllUsers: () => axiosInstance.get('/admin/users'),
    updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
    deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
    changeRole: (userId) => axiosInstance.patch(`/admin/users/${userId}/role`),
};


//compnay api
export const companyAPI = {
    createCompany: (data)=>axiosInstance.post('/company',data),
    getAllCompanies: () => axiosInstance.get('/company')
}



