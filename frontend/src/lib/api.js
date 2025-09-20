import axios from "axios";

const API = import.meta.env.VITE_API_URL || "/api";
const instance = axios.create({
    baseURL: API,
    headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default {
    get: (url) => instance.get(url),
    post: (url, body) => instance.post(url, body),
    put: (url, body) => instance.put(url, body),
    del: (url) => instance.delete(url),
};
