import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'Something went wrong. Please try again later.';

        if (!error.response) {
            message = 'Unable to connect to the server. Please check your internet connection.';
        } else {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 401) {
                message = 'Your session has expired. Please log in again.';
            } else if (status === 403) {
                message = "You don't have permission to perform this action.";
            } else if (status === 404) {
                message = 'The requested resource was not found.';
            } else if (status === 500) {
                message = 'A server error occurred. Our team has been notified.';
            }

            // Override with backend message if available and not too "technical"
            if (data?.message && !data.message.toLowerCase().includes('prisma') && !data.message.toLowerCase().includes('database')) {
                message = data.message;
            }
        }

        // Return a cleaner error object
        return Promise.reject({
            message,
            status: error.response?.status,
            originalError: error
        });
    }
);

export default api;
