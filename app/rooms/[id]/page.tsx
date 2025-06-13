"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Room {
  roomNumber: string;
  type: string;
  status: string;
  floor: number;
  view: string;
  price: number;
  amenities: string[];
  imageLink: string;
}

export default function RoomDetailsPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch room details');
        }
        setRoom(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (isLoading) return (
    <>
      <Navbar />
      <div className="pt-16 text-center p-20">Loading...</div>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="pt-16 text-center p-20 text-red-500">Error: {error}</div>
    </>
  );
  if (!room) return (
    <>
      <Navbar />
      <div className="pt-16 text-center p-20">Room not found</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-neutral">
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1200px',
          margin: '30px auto',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 50%', minWidth: '400px' }}>
              <img 
                src={room.imageLink} 
                alt={`Room ${room.roomNumber}`} 
                style={{
                  width: '100%',
                  height: '500px',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ flex: '1 1 50%', padding: '30px', display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '2.5em' }}>Room {room.roomNumber}</h1>
              <p style={{ marginBottom: '10px', fontSize: '1.2em' }}><strong>Type:</strong> {room.type}</p>
              <p style={{ marginBottom: '10px', fontSize: '1.2em' }}><strong>Status:</strong> {room.status}</p>
              <p style={{ marginBottom: '10px', fontSize: '1.2em' }}><strong>Floor:</strong> {room.floor}</p>
              <p style={{ marginBottom: '10px', fontSize: '1.2em' }}><strong>View:</strong> {room.view}</p>
              <p style={{ marginBottom: '10px', fontSize: '1.2em' }}><strong>Price:</strong> {room.price} CFA</p>
              <p style={{ marginBottom: '30px', fontSize: '1.2em' }}><strong>Amenities:</strong> {room.amenities.join(', ')}</p>
              
              {/* Placeholder for blurred content lines */}
              <div style={{ background: '#f0f0f0', height: '15px', width: '80%', marginBottom: '10px', borderRadius: '4px' }}></div>
              <div style={{ background: '#f0f0f0', height: '15px', width: '70%', marginBottom: '10px', borderRadius: '4px' }}></div>
              <div style={{ background: '#f0f0f0', height: '15px', width: '90%', borderRadius: '4px' }}></div>

              <div className="mt-auto flex justify-end">
                <Link href={`/booking/guest-details?roomId=${id}`}>
                  <Button 
                    className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}