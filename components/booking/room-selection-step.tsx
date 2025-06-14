"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import Image from "next/image"
import { BookingData } from "@/app/booking/page"
import { fetchRooms } from "@/services/rooms"

interface Room {
  _id: string
  roomNumber: string
  type: string
  status: "available" | "occupied" | "maintenance" | "cleaning"
  floor: number
  view: string
  price: number
  amenities: string[]
  imageLink?: string
}

interface RoomSelectionStepProps {
  data: BookingData
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
  setError: (error: string) => void
  setIsLoading: (loading: boolean) => void
}

export default function RoomSelectionStep({ data, onUpdate, onNext, onPrev, setError, setIsLoading }: RoomSelectionStepProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(data.selectedRoom?._id || "")
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const rooms = await fetchRooms()
        console.log('Fetched Rooms:', rooms)
        setAvailableRooms(rooms)
        
        // Filter rooms based on type if specified
        if (data.roomType && data.roomType !== 'any') {
          const filtered = rooms.filter(room => 
            room.type.toLowerCase() === data.roomType?.toLowerCase()
          )
          console.log('Filtered Rooms:', filtered)
          setFilteredRooms(filtered)
        } else {
          setFilteredRooms(rooms)
        }
      } catch (err) {
        console.error('Error fetching rooms:', err)
        setError('Failed to load rooms. Please try again.')
      }
    }

    loadRooms()
  }, [data.roomType, setError])

  const handleRoomSelect = async (room: Room) => {
    setSelectedRoomId(room._id)
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to check availability
      await new Promise(resolve => setTimeout(resolve, 800))

      onUpdate({ selectedRoom: room })
      onNext()
    } catch (error) {
      setError("Failed to select room. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNights = () => {
    if (data.checkIn && data.checkOut) {
      const checkIn = new Date(data.checkIn)
      const checkOut = new Date(data.checkOut)
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  const nights = calculateNights()

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-4">
              <span><strong>Check-in:</strong> {new Date(data.checkIn).toLocaleDateString()}</span>
              <span><strong>Check-out:</strong> {new Date(data.checkOut).toLocaleDateString()}</span>
              <span><strong>Guests:</strong> {data.guests}</span>
              <span><strong>Nights:</strong> {nights}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="border-primary text-primary hover:bg-primary hover:text-white"
              aria-label="Go back to search"
            >
              <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              Modify Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Room Cards */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-primary mb-2">Available Rooms</h2>
          <p className="text-gray-600">Choose your perfect accommodation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card 
              key={room._id} 
              className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                selectedRoomId === room._id ? 'ring-2 ring-secondary' : ''
              }`}
            >
              <div className="relative h-48">
                <Image
                  src={room.imageLink || "/placeholder.svg"}
                  alt={`${room.type} - Room ${room.roomNumber}`}
                  fill
                  className="object-cover"
                />
                {selectedRoomId === room._id && (
                  <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded-full text-xs font-medium">
                    Selected
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-medium text-primary">Room {room.roomNumber}</CardTitle>
                    <CardDescription className="text-lg text-gray-600">{room.type}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-medium text-primary">{room.price.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Amenities:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" aria-hidden="true" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Total for {nights} night{nights > 1 ? 's' : ''}:</span>
                      <span className="text-lg font-medium text-primary">{(room.price * nights).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={() => handleRoomSelect(room)}
                  disabled={selectedRoomId === room._id}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                  aria-label={`Select ${room.type} room ${room.roomNumber}`}
                >
                  {selectedRoomId === room._id ? 'Selected' : 'Select Room'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
