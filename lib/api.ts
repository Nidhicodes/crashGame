import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export async function getUser(walletAddress: string) {
  console.log('🔍 getUser called for:', walletAddress);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${walletAddress}`);
    console.log('📡 getUser response status:', response.status);
    
    if (response.status === 404) {
      console.log('👤 User not found in database');
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user = await response.json();
    console.log('👤 getUser result:', user);
    return user;
  } catch (error) {
    console.error('❌ getUser error:', error);
    throw error;
  }
}


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

export const getDailyStats = async () => {
    const response = await api.get('/stats/daily');
    return response.data;
};

export const getWeeklyStats = async () => {
    const response = await api.get('/stats/weekly');
    return response.data;
};
