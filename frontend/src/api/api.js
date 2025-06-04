import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth API endpoints
export const authAPI = {
  login: (data) => axiosInstance.post("/auth/login", data),
  signup: (data) => axiosInstance.post("/auth/register", data),
  logout: () => axiosInstance.post("/auth/logout"),
  checkAuth: () => axiosInstance.get("/auth/check"),
  me:()=>axiosInstance.get('/auth/me'),
  getUserDetails:(userId)=>axiosInstance.get(`/auth/details/${userId}`)
};

//upload file api
export const Upload = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post("/upload/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// User API endpoints
export const userAPI = {
  getProfile: () => axiosInstance.get("/user/profile"),
  updateProfile: (data) => axiosInstance.put("/user/profile", data),
  me: () => axiosInstance.get("/me"),
};

// Problem API endpoints
export const problemAPI = {
  getAllProblems: () => axiosInstance.get("/problem"),
  getProblem: (id) => axiosInstance.get(`/problem/${id}`),
  createProblem: (data) => axiosInstance.post("/problem", data),
  updateProblem: (id, data) => axiosInstance.put(`/problem/${id}`, data),
  deleteProblem: (id) => axiosInstance.delete(`/problem/${id}`),
};

// Admin API endpoints
export const adminAPI = {
  getAllUsers: () => axiosInstance.get("/admin/users"),
  updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  changeRole: (userId) => axiosInstance.patch(`/admin/users/${userId}/role`),
};

//compnay api
export const companyAPI = {
  createCompany: (data) => axiosInstance.post("/company", data),
  getAllCompanies: () => axiosInstance.get("/company"),
  getCompanyById: (id) => axiosInstance.get(`/company/${id}`),
};

//playlist
export const playlistAPI = {
  createPlaylist: (data) => axiosInstance.post("/playlist/create", data),
  getAllPlaylists: () => axiosInstance.get("/playlist"),
  getPlaylistDetails: (playlistId) =>
    axiosInstance.get(`/playlist/${playlistId}`),
  deletePlaylist: (playlistId) =>
    axiosInstance.delete(`/playlist/${playlistId}`),
  addProblemToPlaylist: (playlistId, problemIds) =>
    axiosInstance.post(`/playlist/${playlistId}/add-problem`, { problemIds }),
  removeProblemFromPlaylist: (playlistId, problemIds) =>
    axiosInstance.delete(`/playlist/${playlistId}/remove-problem`, {
      data: { problemIds },
    }),
};

// Submission API endpoints
export const submissionAPI = {
  getAllSubmissions: () => axiosInstance.get("/submission"),
  getSubmissionsForProblem: (problemId) =>
    axiosInstance.get(`/submission/get-submission/${problemId}`),
  getAllTheSubmissionsForProblem: (problemId) =>
    axiosInstance.get(`/submission/get-submission-for-count/${problemId}`),
};

// Execute Code API endpoint
export const executeAPI = {
  executeCode: (data) => axiosInstance.post("/execute-code", data),
  createSubmission: (problemId, data) =>
    axiosInstance.post(`/execute-code/${problemId}/submission`, data),
};

export const DiscussionAPI = {
  getDisscussionByProblemId: (id) => axiosInstance.get(`/discussion/${id}`),
  getAllCommentByDiscussionId:(discussionId, page = 1, limit = 10)=>axiosInstance.get(`/discussion/${discussionId}/comments?page=${page}&limit=${limit}`),
  addComment : (data)=>axiosInstance.post('/discussion/add-commnet',data),
  removeComment:(commentId)=>axiosInstance.delete(`/discussion/remove-comment/${commentId}`),
  editComment:(commentId,data)=>axiosInstance.put(`/discussion/comment/${commentId}`,data)
};
