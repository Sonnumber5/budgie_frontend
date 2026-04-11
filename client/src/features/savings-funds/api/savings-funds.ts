import type { SavingsFundDTO } from "../../../types";
import api from "../../../data/axios";

// Sends a POST request to create a new savings fund.
export const createSavingsFund = (data: SavingsFundDTO) => {
    return api.post('/savings-funds', data);
}

// Fetches all archived savings funds for the authenticated user.
export const getArchivedSavingsFunds = () => {
    return api.get('/savings-funds?includeArchived=true');
}

// Fetches all active (non-archived) savings funds for the authenticated user.
export const getActiveSavingsFunds = () => {
    return api.get('/savings-funds?includeArchived=false');
}

// Fetches a single savings fund by its ID.
export const getSavingsFundById = (fundId: number) => {
    return api.get(`/savings-funds/${fundId}`);
}

// Sends a PUT request to update a savings fund's name and goal.
export const updateSavingsFund = (id: number, data: SavingsFundDTO) => {
    return api.put(`/savings-funds/${id}`, data);
}

// Sends a DELETE request to permanently remove a savings fund.
export const deleteSavingsFund = (id: number) => {
    return api.delete(`/savings-funds/${id}`);
}

// Sends a PATCH request to archive a savings fund by its ID.
export const archiveSavingsFundAPI = (id: number) => {
    return api.patch(`/savings-funds/${id}/archive`);
}