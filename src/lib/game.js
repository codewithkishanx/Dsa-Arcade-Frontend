import api from "./api.js";

export const getLevels = () => api.get("/api/v1/levels").then((r) => r.data);
export const getLevel = (id) => api.get(`/api/v1/levels/${id}`).then((r) => r.data);
export const getStage = (id) => api.get(`/api/v1/stages/${id}`).then((r) => r.data);
export const startStage = (id) => api.post(`/api/v1/stages/${id}/start`).then((r) => r.data);
export const submitStage = (id, payload) => api.post(`/api/v1/stages/${id}/submit`, payload).then((r) => r.data);
export const getHint = (id) => api.post(`/api/v1/stages/${id}/hint`).then((r) => r.data);
export const getSolution = (id) => api.get(`/api/v1/stages/${id}/solution`).then((r) => r.data);
export const getStats = () => api.get("/api/v1/users/me/stats").then((r) => r.data);
export const getProgress = () => api.get("/api/v1/users/me/progress").then((r) => r.data);
