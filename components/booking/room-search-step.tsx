"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Search } from "lucide-react"
import type { BookingData } from "@/app/booking/page"

interface RoomSearchStepProps {
  data: BookingData
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  setError: (error: string) => void
  setIsLoading: (loading: boolean) => void
}

export default function RoomSearchStep({ data, onUpdate, onNext, setError, setIsLoading }: RoomSearchStepProps) {
  const [formData, setFormData] = useState({
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guests: data.guests.toString(),
    roomType: data.roomType,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = async () => {
    // Validation
    if (!formData.checkIn || !formData.checkOut || !formData.guests) {
      setError("Please fill in all required fields")
      return
    }

    const checkInDate = new Date(formData.checkIn)
    const checkOutDate = new Date(formData.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      setError("Check-in date cannot be in the past")
      return
    }

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date")
      return
    }

    const guestCount = Number.parseInt(formData.guests)
    if (guestCount < 1 || guestCount > 8) {
      setError("Number of guests must be between 1 and 8")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to /api/rooms/search
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update booking data
      onUpdate({
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: guestCount,
        roomType: formData.roomType,
      })

      onNext()
    } catch (error) {
      setError("Failed to search rooms. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-medium text-primary">Find Your Perfect Room</CardTitle>
        <p className="text-gray-600">Search available rooms for your stay</p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="check-in" className="text-sm font-medium text-gray-700">
              Check-in Date *
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="check-in"
                type="date"
                value={formData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                aria-label="Select check-in date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-out" className="text-sm font-medium text-gray-700">
              Check-out Date *
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="check-out"
                type="date"
                value={formData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                aria-label="Select check-out date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
              Number of Guests *
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="8"
                value={formData.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                placeholder="1"
                aria-label="Number of guests"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-type" className="text-sm font-medium text-gray-700">
              Room Type (Optional)
            </Label>
            <Select
              value={formData.roomType || "any"}
              onValueChange={(value) => handleInputChange("roomType", value === "any" ? "" : value)}
            >
              <SelectTrigger
                id="room-type"
                className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                aria-label="Select room type"
              >
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="standard">Standard Room</SelectItem>
                <SelectItem value="deluxe">Deluxe Room</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="presidential">Presidential Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSearch}
            className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-[200px]"
            aria-label="Search available rooms"
          >
            <Search className="w-5 h-5 mr-2" aria-hidden="true" />
            Search Rooms
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
