import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchRooms = async () => {
  const response = await fetch(`${API_URL}/api/rooms`);
  const data = await response.json();
  console.log('Fetched rooms:', data); // Log the response for debugging

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rooms');
  }

  return data;
};

export const updateRoom = async (roomNumber: string, updatedData: any) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  console.log(`Updating room ${roomNumber} with data:`, updatedData);

  const response = await fetch(`${API_URL}/api/rooms/${roomNumber}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    const errorData = await response.text(); // Read as text to avoid SyntaxError
    try {
      const errorJson = JSON.parse(errorData); // Try to parse as JSON if it is
      throw new Error(errorJson.message || `Failed to update room ${roomNumber}`);
    } catch (e) {
      throw new Error(`Failed to update room ${roomNumber}: ${errorData}`); // Fallback to raw text
    }
  }

  const data = await response.json();
  console.log('Room update response:', data);

  return data;
};

export const deleteRoom = async (id: string) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  console.log(`Deleting room with ID: ${id}`);

  const response = await fetch(`${API_URL}/api/rooms/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // No need to parse JSON for DELETE, as it might return an empty body or just a status
  if (!response.ok) {
    const errorData = await response.json(); // Try to parse error message if available
    throw new Error(errorData.message || 'Failed to delete room');
  }

  return { message: 'Room deleted successfully' };
}; 