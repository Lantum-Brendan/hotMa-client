"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import { fetchBookings } from "@/services/api/booking"
import { BookingResponse } from "@/services/api/booking"
import { formatCurrency } from "@/services/booking"

export default function GuestBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchBookings() // Assuming fetchBookings doesn't require a guest ID for now
      setBookings(response.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-medium text-primary mb-6">My Bookings</h1>

        <div className="flex justify-end mb-4">
          <Button onClick={loadBookings} disabled={isLoading} className="bg-accent hover:bg-accent/90 text-primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isLoading ? "Refreshing..." : "Refresh Bookings"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading your bookings...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : bookings.length === 0 ? (
          <Card className="bg-accent/30 border-accent max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-4">You haven't made any reservations yet. Start by booking a room!</p>
              <Link href="/">
                <Button className="bg-secondary hover:bg-secondary/90 text-white">
                  Book a Room
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.bookingNumber} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium text-primary">{booking.room.type}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Room {booking.room.roomNumber} • #{booking.bookingNumber}
                      </CardDescription>
                    </div>
                    {/* You might want to add a status badge here if status is available in BookingResponse */}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>HotMa Hotel • {booking.room.view || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(booking.calculation.total)}</span>
                  </div>
                  <div className="pt-3 flex justify-end">
                    <Link href={`/dashboard/bookings/${booking.bookingNumber}`} className="text-primary hover:underline flex items-center text-sm">
                      View Details
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 