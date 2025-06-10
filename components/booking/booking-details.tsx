"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, CreditCard, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface BookingDetailsProps {
  booking: {
    bookingNumber: string
    room: {
      number: string
      type: string
      image: string
    }
    checkIn: string
    checkOut: string
    guestName: string
    guestEmail: string
    status: "confirmed" | "completed" | "cancelled"
    totalAmount: number
  }
  onCancel: () => void
}

export default function BookingDetails({ booking, onCancel }: BookingDetailsProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = () => {
    switch (booking.status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = () => {
    switch (booking.status) {
      case "confirmed":
        return "Confirmed"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const isUpcoming = () => {
    const today = new Date()
    const checkIn = new Date(booking.checkIn)
    return checkIn > today && booking.status === "confirmed"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Room Image */}
        <div className="w-full md:w-1/3">
          <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
            <Image
              src={booking.room.image || "/placeholder.svg"}
              alt={`${booking.room.type} - Room ${booking.room.number}`}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Booking Info */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-medium text-primary">
              {booking.room.type} - Room {booking.room.number}
            </h3>
            <Badge className={`${getStatusColor()} font-normal text-sm px-3 py-1`}>{getStatusText()}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-secondary mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-gray-700">Check-in</p>
                <p className="text-gray-600">{formatDate(booking.checkIn)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-secondary mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-gray-700">Check-out</p>
                <p className="text-gray-600">{formatDate(booking.checkOut)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-secondary mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-gray-700">Guest</p>
                <p className="text-gray-600">{booking.guestName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-secondary mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-gray-700">Total Amount</p>
                <p className="text-gray-600">
                  ${booking.totalAmount} ({calculateNights()} nights)
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Option */}
          {isUpcoming() && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  <span className="text-sm">Free cancellation available until 24 hours before check-in</span>
                </div>
                <Button
                  onClick={onCancel}
                  className="bg-secondary hover:bg-secondary/90 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
                  aria-label="Cancel this booking"
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          )}

          {booking.status === "cancelled" && (
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">This booking has been cancelled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-lg border p-4 space-y-3">
        <h4 className="font-medium text-gray-700">Booking Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Booking Number:</span>
            <span className="ml-2 text-gray-700 font-medium">{booking.bookingNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-2 text-gray-700">{booking.guestEmail}</span>
          </div>
          <div>
            <span className="text-gray-500">Room Type:</span>
            <span className="ml-2 text-gray-700">{booking.room.type}</span>
          </div>
          <div>
            <span className="text-gray-500">Room Number:</span>
            <span className="ml-2 text-gray-700">{booking.room.number}</span>
          </div>
          <div>
            <span className="text-gray-500">Duration:</span>
            <span className="ml-2 text-gray-700">{calculateNights()} nights</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span
              className={`ml-2 font-medium ${
                booking.status === "confirmed"
                  ? "text-green-600"
                  : booking.status === "completed"
                    ? "text-blue-600"
                    : "text-red-600"
              }`}
            >
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Hotel Policies */}
      <div className="bg-white rounded-lg border p-4 space-y-3">
        <h4 className="font-medium text-gray-700">Hotel Policies</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Check-in Time:</span>
            <span className="ml-2 text-gray-700">3:00 PM</span>
          </div>
          <div>
            <span className="text-gray-500">Check-out Time:</span>
            <span className="ml-2 text-gray-700">11:00 AM</span>
          </div>
          <div>
            <span className="text-gray-500">Cancellation:</span>
            <span className="ml-2 text-gray-700">Free up to 24h before check-in</span>
          </div>
          <div>
            <span className="text-gray-500">Payment:</span>
            <span className="ml-2 text-gray-700">Fully paid</span>
          </div>
        </div>
      </div>
    </div>
  )
}
