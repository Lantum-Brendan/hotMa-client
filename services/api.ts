const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  console.log('Registration response:', data);

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}; 