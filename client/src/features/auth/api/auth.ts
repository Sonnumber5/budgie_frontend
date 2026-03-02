// auth.ts - API functions for authentication endpoints.
// All requests use the shared Axios instance which sends cookies automatically.
import api from "../../../data/axios";

// Sends credentials to the server; the server sets an HTTP-only JWT cookie on success.
export const loginAPI = (email: string, password: string) => {
    return api.post(`/auth/login`, {email, password});
}

// Registers a new user account and redirects to login on success.
export const registerAPI = (email: string, password: string, name: string) => {
    return api.post(`/auth/register`, {email, password, name});
}

// Clears the server-side session and invalidates the auth cookie.
export const logoutAPI = () => {
    return api.post(`/auth/logout`);
}

// Returns the currently authenticated user based on the cookie.
// Used on app load to restore session state without requiring re-login.
export const me = () => {
    return api.get(`/auth/me`)
}