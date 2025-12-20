import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Phiên đăng nhập đã hết hạn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const recipeAPI = {
  recommend: (ingredients) => 
    API.post('/recipes/recommend', { ingredients }),
  
  saveRecipe: (recipeData) => 
    API.post('/recipes/save', recipeData),
  
  getSavedRecipes: () => 
    API.get('/recipes/saved'),
  
  deleteSavedRecipe: (id) => 
    API.delete(`/recipes/saved/${id}`),
  
  getHistory: () => 
    API.get('/recipes/history'),
  
  generateImage: () => 
    API.post('/recipes/image'),
};

export const authAPI = {
  login: (credentials) => 
    API.post('/auth/login', credentials),
  
  register: (userData) => 
    API.post('/auth/register', userData),
  
  getProfile: () => 
    API.get('/auth/me'),
  
  updateProfile: (userData) => 
    API.put('/auth/profile', userData),
};

export default API;