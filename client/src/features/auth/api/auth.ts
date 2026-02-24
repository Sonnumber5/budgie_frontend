import type { ExpenseDTO } from "../../../types/index"
import api from "../../../data/axios";

export const login = (email: string, password: string) => {
    return api.post(`/auth/login`, {email, password});
}

export const register = (email: string, password: string, name: string) => {
    return api.post(`/auth/register`, {email, password, name});
}

export const logout = () => {
    return api.post(`/auth/logout`);
}

export const me = () => {
    return api.get(`/auth/me`)
}