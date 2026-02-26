import api from "../../../data/axios";

export const loginAPI = (email: string, password: string) => {
    return api.post(`/auth/login`, {email, password});
}

export const registerAPI = (email: string, password: string, name: string) => {
    return api.post(`/auth/register`, {email, password, name});
}

export const logoutAPI = () => {
    return api.post(`/auth/logout`);
}

export const me = () => {
    return api.get(`/auth/me`)
}