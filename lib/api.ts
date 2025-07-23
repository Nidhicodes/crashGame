import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getUser = async (walletAddress: string) => {
  const response = await api.get(`/users/${walletAddress}`);
  return response.data;
};

export const updateUser = async (walletAddress: string, data: any) => {
  const response = await api.put(`/users/${walletAddress}`, data);
  return response.data;
};

export const getGameHistory = async (walletAddress: string) => {
  const response = await api.get(`/stats/${walletAddress}`);
  return response.data;
};

export const getLeaderboard = async (type: string) => {
  const response = await api.get(`/leaderboard/${type}`);
  return response.data;
};

export const saveGameResult = async (data: any) => {
  const response = await api.post('/games', data);
  return response.data;
};
