import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const adminApi = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5005') + '/admin',
});

// Request interceptor to add token
adminApi.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().adminToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401
adminApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const { logoutAdmin } = useAuthStore.getState();
            logoutAdmin();
            // Redirect happens automatically because of AdminProtectedRoute or route guard
        }
        return Promise.reject(error);
    }
);

export default adminApi;
