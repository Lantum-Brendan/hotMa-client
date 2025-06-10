"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Users, Wifi, Waves, MapPin, Phone, Mail, Shield, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredRooms = [
  {
    id: 1,
    number: "101",
    type: "Ocean View Suite",
    price: 299,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Ocean View", "King Bed", "Balcony", "Mini Bar"],
  },
  {
    id: 2,
    number: "205",
    type: "Deluxe Room",
    price: 199,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Garden View", "Queen Bed", "Work Desk", "Coffee Maker"],
  },
  {
    id: 3,
    number: "301",
    type: "Presidential Suite",
    price: 599,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["Panoramic View", "2 Bedrooms", "Living Room", "Jacuzzi"],
  },
]

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
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")
  const [roomType, setRoomType] = useState("")
  const [searchError, setSearchError] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setSearchError("")
    setIsSearching(true)

    // Basic validation
    if (!checkIn || !checkOut || !guests) {
      setSearchError("Please fill in all required fields")
      setIsSearching(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate 409 error for demonstration
      if (Math.random() > 0.7) {
        setSearchError("No rooms available for selected dates")
        setIsSearching(false)
        return
      }

      // Success - would redirect to search results
      console.log("Search successful", { checkIn, checkOut, guests, roomType })
    } catch (error) {
      setSearchError("An error occurred while searching. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                      onChange={(e) => setCheckIn(e.target.value)}
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
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                      aria-label="Select check-out date"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests" className="text-sm font-normal text-gray-700">
                    Number of Guests *
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="8"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                      placeholder="1"
                      aria-label="Number of guests"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-type" className="text-sm font-normal text-gray-700">
                    Room Type (Optional)
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
                      <SelectItem value="standard">Standard Room</SelectItem>
                      <SelectItem value="deluxe">Deluxe Room</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="presidential">Presidential Suite</SelectItem>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={`${room.type} - Room ${room.number}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-medium text-primary">Room {room.number}</CardTitle>
                      <CardDescription className="text-lg font-normal text-gray-600">{room.type}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-medium text-primary">${room.price}</p>
                      <p className="text-sm font-normal text-gray-500">per night</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Amenities:</h4>
                    <ul className="grid grid-cols-2 gap-1 text-sm font-normal text-gray-600">
                      {room.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
                    aria-label={`View details for ${room.type} room ${room.number}`}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                  <span className="font-normal text-white/80">123 Ocean Drive, Coastal City</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-secondary" aria-hidden="true" />
                  <a
                    href="tel:+1234567890"
                    className="font-normal text-white/80 hover:text-white transition-colors"
                    aria-label="Call hotel phone number"
                  >
                    +1 (234) 567-8900
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
  )
}
