"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Users, Wifi, Waves, MapPin, Phone, Mail, Shield, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchRooms } from "@/services/rooms"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"

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

const amenities = [
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Outdoor infinity pool with ocean views",
  },
  {
    icon: Wifi,
    title: "Free Wi-Fi",
    description: "High-speed internet throughout the property",
  },
]

export default function HomePage() {
  const [roomType, setRoomType] = useState("any")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [searchError, setSearchError] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllRooms, setShowAllRooms] = useState(false)

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms()
        console.log('Fetched Rooms:', data)
        setRooms(data)
        setFilteredRooms(data)
      } catch (err) {
        console.error('Error fetching rooms:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadRooms()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Available</Badge>
      case "occupied":
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Occupied</Badge>
      case "maintenance":
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Maintenance</Badge>
      case "cleaning":
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Cleaning</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleSearch = async () => {
    setSearchError("")
    setIsSearching(true)

    try {
      // Log search parameters
      console.log('Search Parameters:', {
        checkIn,
        checkOut,
        roomType,
        endpoint: 'http://localhost:5000/api/rooms/search'
      })

      // Filter rooms based on room type
      const filtered = rooms.filter(room => 
        roomType === "any" ? true : room.type.toLowerCase() === roomType.toLowerCase()
      )
      setFilteredRooms(filtered)
      
      if (filtered.length === 0) {
        setSearchError("No rooms available for selected type")
      }

      // Log filtered results
      console.log('Filtered Rooms:', filtered)
    } catch (error) {
      console.error('Search Error:', error)
      setSearchError("An error occurred while searching. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Get unique room types from the rooms data
  const roomTypes = Array.from(new Set(rooms.map(room => room.type)))

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <Navbar />
      <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Luxury hotel pool with ocean view"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4">Welcome to HotMa</h1>
            <p className="text-xl md:text-2xl text-white/90 font-normal">Your perfect coastal getaway awaits</p>
          </div>

          {/* Search Widget */}
          <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-medium text-primary text-center">Find Your Perfect Room</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="check-in" className="text-sm font-normal text-gray-700">
                    Check-in Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        console.log('Check-in Date Set:', e.target.value)
                      }}
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                      aria-label="Select check-in date"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="check-out" className="text-sm font-normal text-gray-700">
                    Check-out Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value)
                        console.log('Check-out Date Set:', e.target.value)
                      }}
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                      aria-label="Select check-out date"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-type" className="text-sm font-normal text-gray-700">
                    Room Type
                  </Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger
                      id="room-type"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                      aria-label="Select room type"
                    >
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {searchError && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
                  <p className="text-error text-sm font-normal" role="alert" aria-live="polite">
                    {searchError}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 text-lg font-normal transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        aria-label="Search available rooms"
                      >
                        {isSearching ? "Searching..." : "Search Rooms"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Book as Guest, no account needed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium text-primary mb-4">Featured Rooms</h2>
            <p className="text-lg font-normal text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium accommodations
            </p>
          </div>

            {isLoading ? (
              <div className="text-center py-10">Loading rooms...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">Error: {error}</div>
            ) : (
              <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRooms.slice(0, showAllRooms ? filteredRooms.length : 6).map((room) => (
                    <Card key={room._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                          src={room.imageLink || "/placeholder.svg?height=200&width=300"}
                          alt={`${room.type} - Room ${room.roomNumber}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                            <CardTitle className="text-xl font-medium text-primary">Room {room.roomNumber}</CardTitle>
                      <CardDescription className="text-lg font-normal text-gray-600">{room.type}</CardDescription>
                    </div>
                    <div className="text-right">
                            <p className="text-2xl font-medium text-primary">{room.price.toLocaleString()} FCFA</p>
                      <p className="text-sm font-normal text-gray-500">per night</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Amenities:</h4>
                    <ul className="grid grid-cols-2 gap-1 text-sm font-normal text-gray-600">
                      {room.amenities.slice(0, 4).map((amenity, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/booking?step=2&roomType=${room.type}&checkIn=${checkIn}&checkOut=${checkOut}`}>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
                      aria-label={`View available ${room.type} rooms`}
                    >
                      View Available Rooms
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
                {filteredRooms.length > 6 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowAllRooms(!showAllRooms)}
                      className="hover:bg-primary hover:text-white transition-colors"
                    >
                      {showAllRooms ? "Show Less" : "See More Rooms"}
                    </Button>
                  </div>
                )}
              </>
            )}
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 px-4 bg-accent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium text-primary mb-4">Hotel Amenities</h2>
            <p className="text-lg font-normal text-gray-600 max-w-2xl mx-auto">
              Enjoy world-class facilities designed for your comfort and relaxation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-6 p-6 bg-white rounded-lg shadow-md">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <amenity.icon className="w-8 h-8 text-secondary" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-primary mb-2">{amenity.title}</h3>
                  <p className="text-gray-600 font-normal">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-medium mb-4">HotMa Hotel</h3>
              <p className="font-normal text-white/80 mb-4">
                Experience luxury and comfort at our coastal paradise. Your perfect getaway awaits.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-secondary" aria-hidden="true" />
                    <span className="font-normal text-white/80">000001 Buea, South West Cameroon </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-secondary" aria-hidden="true" />
                  <a
                    href="tel:+1234567890"
                    className="font-normal text-white/80 hover:text-white transition-colors"
                    aria-label="Call hotel phone number"
                  >
                      +237 677 88 99 66
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-secondary" aria-hidden="true" />
                  <a
                    href="mailto:info@hotmahotel.com"
                    className="font-normal text-white/80 hover:text-white transition-colors"
                    aria-label="Send email to hotel"
                  >
                    info@hotmahotel.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-secondary" aria-hidden="true" />
                  <Link
                    href="/privacy"
                    className="font-normal text-white/80 hover:text-white transition-colors"
                    aria-label="View privacy policy"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <LogIn className="w-5 h-5 text-secondary" aria-hidden="true" />
                  <Link
                    href="/staff/login"
                    className="font-normal text-white/80 hover:text-white transition-colors"
                    aria-label="Staff login portal"
                  >
                    Staff Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="font-normal text-white/60">
              © {new Date().getFullYear()} HotMa Hotel Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
