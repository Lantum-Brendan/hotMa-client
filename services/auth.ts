import { registerUser } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const handleRegistration = async (userData: { name: string; email: string; password: string }) => {
  try {
    const data = await registerUser(userData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleLogin = async (userData: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log('Login response:', data); // Log the response for debugging

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the token and user data in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserRole = () => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      return user.role;
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      return null;
    }
  }
  return null;
}; 