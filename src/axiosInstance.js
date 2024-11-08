// Створіть окремий файл axiosInstance.js
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';
import { useContext } from 'react';

const useAxios = () => {
    const { authToken } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api',
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            if (authToken) {
                config.headers['Authorization'] = `Bearer ${authToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;