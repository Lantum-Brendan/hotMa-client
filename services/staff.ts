const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const createStaffUser = async (userData: { name: string; email: string; password: string; role: string }) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  console.log('Creating staff user with data:', userData); // Log the request data

  const response = await fetch(`${API_URL}/api/staff/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include the token in the request headers
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  console.log('Staff creation response:', data); // Log the response for debugging

  if (!response.ok) {
    throw new Error(data.message || 'Staff creation failed');
  }

  return data;
}; 