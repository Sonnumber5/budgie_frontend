import type { SavingsFundDTO } from "../../../types";
import api from "../../../data/axios";

export const createSavingsFund = (data: SavingsFundDTO) => {
    return api.post('/savings-funds', data);
}

export const getArchivedSavingsFunds = () => {
    return api.get('/savings-funds?includeArchived=true');
}

export const getActiveSavingsFunds = () => {
    return api.get('/savings-funds?includeArchived=false');
}

export const updateSavingsFund = (id: number, data: SavingsFundDTO) => {
    return api.post(`/savings-funds/${id}`, data);
}

export const deleteSavingsFund = (id: number) => {
    return api.delete(`/savings-funds/${id}`);
}