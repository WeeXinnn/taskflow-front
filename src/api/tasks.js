import axios from 'axios'; // Import axios library for making HTTP requests

const BASE = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getTasks = (params) => axios.get(`${BASE}/tasks`, { ...getHeaders(), params });
export const getTask = (id) => axios.get(`${BASE}/tasks/${id}`, getHeaders());
export const createTask = (data) => axios.post(`${BASE}/tasks`, data, getHeaders());
export const updateTask = (id, data) => axios.put(`${BASE}/tasks/${id}`, data, getHeaders());
export const deleteTask = (id) => axios.delete(`${BASE}/tasks/${id}`, getHeaders());
export const getStats = () => axios.get(`${BASE}/tasks/meta/stats`, getHeaders());