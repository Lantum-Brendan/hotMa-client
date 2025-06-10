"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, AlertCircle, Shield, Phone, Mail } from "lucide-react"
import BookingDetails from "@/components/booking/booking-details"
import Link from "next/link"

interface BookingData {
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

export default function ManageBookingPage() {
  const [searchData, setSearchData] = useState({
    bookingNumber: "",
    email: "",
    cancellationCode: "",
  })
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookingFound, setBookingFound] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [showCancellationDialog, setShowCancellationDialog] = useState(false)
  const [cancellationCode, setCancellationCode] = useState("")
  const [cancellationError, setCancellationError] = useState("")
  const [cancellationSuccess, setCancellationSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleCaptcha = () => {
    // Simulate CAPTCHA verification
    setCaptchaVerified(true)
  }

  const validateSearchForm = () => {
    if (!searchData.bookingNumber.trim()) {
      setError("Booking number is required")
      return false
    }
    if (!searchData.email.trim()) {
      setError("Email address is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!captchaVerified) {
      setError("Please complete the CAPTCHA verification")
      return false
    }
    return true
  }

  const handleSearchBooking = async () => {
    if (!validateSearchForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to /api/booking-history/guest
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate booking not found
      if (Math.random() > 0.8) {
        setError("No booking found with the provided details. Please check and try again.")
        setIsLoading(false)
        return
      }

      // Mock booking data
      const mockBooking: BookingData = {
        bookingNumber: searchData.bookingNumber,
        room: {
          number: "205",
          type: "Ocean View Suite",
          image: "/placeholder.svg?height=200&width=300",
        },
        checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
        checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 10 days from now
        guestName: "John Doe",
        guestEmail: searchData.email,
        status: "confirmed",
        totalAmount: 897,
      }

      setBookingData(mockBooking)
      setBookingFound(true)
    } catch (error) {
      setError("An error occurred while retrieving your booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = () => {
    setShowCancellationDialog(true)
  }

  const handleCancellationSubmit = async () => {
    if (!cancellationCode.trim()) {
      setCancellationError("Please enter your cancellation code")
      return
    }

    setIsLoading(true)
    setCancellationError("")

    try {
      // Simulate API call to /api/bookings/:bookingId/cancel
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate invalid cancellation code
      if (cancellationCode !== "CX12345") {
        setCancellationError("Invalid cancellation code. Please check and try again.")
        setIsLoading(false)
        return
      }

      // Update booking status
      if (bookingData) {
        setBookingData({
          ...bookingData,
          status: "cancelled",
        })
      }

      setCancellationSuccess(true)
      setTimeout(() => {
        setShowCancellationDialog(false)
      }, 3000)
    } catch (error) {
      setCancellationError("An error occurred while cancelling your booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetSearch = () => {
    setBookingFound(false)
    setBookingData(null)
    setSearchData({
      bookingNumber: "",
      email: "",
      cancellationCode: "",
    })
    setCaptchaVerified(false)
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-medium text-primary mb-2">Manage Your Booking</h1>
          <p className="text-gray-600">Retrieve and manage your reservation details</p>
        </div>

        {!bookingFound ? (
          /* Search Form */
          <Card className="bg-accent/50 border-accent shadow-lg max-w-xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-medium text-primary">Find Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="booking-number" className="text-sm font-medium text-gray-700">
                    Booking Number *
                  </Label>
                  <Input
                    id="booking-number"
                    type="text"
                    value={searchData.bookingNumber}
                    onChange={(e) => handleInputChange("bookingNumber", e.target.value)}
                    className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                    placeholder="Enter your booking number"
                    aria-label="Booking number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={searchData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                    placeholder="Enter the email used for booking"
                    aria-label="Email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellation-code" className="text-sm font-medium text-gray-700">
                    Cancellation Code (Optional)
                  </Label>
                  <Input
                    id="cancellation-code"
                    type="text"
                    value={searchData.cancellationCode}
                    onChange={(e) => handleInputChange("cancellationCode", e.target.value)}
                    className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                    placeholder="Enter your cancellation code if available"
                    aria-label="Cancellation code"
                  />
                </div>

                {/* CAPTCHA */}
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center">
                          {captchaVerified && <span className="text-secondary text-sm">✓</span>}
                        </div>
                        <span className="text-sm text-gray-700">I'm not a robot</span>
                      </div>
                      {!captchaVerified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCaptcha}
                          className="text-xs"
                          aria-label="Complete CAPTCHA verification"
                        >
                          <Shield className="w-4 h-4 mr-1" aria-hidden="true" />
                          Verify
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="pt-4">
                  <Button
                    onClick={handleSearchBooking}
                    disabled={isLoading}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    aria-label="Retrieve booking details"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                        Retrieve Booking
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Booking Details */
          <div className="space-y-6">
            <Card className="bg-accent/50 border-accent shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-medium text-primary">Booking Details</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">Booking #{bookingData?.bookingNumber}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSearch}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  aria-label="Search for a different booking"
                >
                  New Search
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {bookingData && <BookingDetails booking={bookingData} onCancel={handleCancelBooking} />}
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Need assistance with your booking?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  asChild
                >
                  <Link href="/contact" aria-label="Contact support via phone">
                    <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                    Call Support
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  asChild
                >
                  <Link href="/contact" aria-label="Contact support via email">
                    <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                    Email Support
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Dialog */}
      <Dialog open={showCancellationDialog} onOpenChange={setShowCancellationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-primary">Cancel Booking</DialogTitle>
            <DialogDescription>
              Please enter your cancellation code to confirm. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {cancellationSuccess ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Cancelled</h3>
              <p className="text-gray-600">
                Your booking has been successfully cancelled. A confirmation email will be sent shortly.
              </p>
            </div>
          ) : (
            <>
              {cancellationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{cancellationError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="confirm-cancellation-code" className="text-sm font-medium text-gray-700">
                    Cancellation Code *
                  </Label>
                  <Input
                    id="confirm-cancellation-code"
                    type="text"
                    value={cancellationCode}
                    onChange={(e) => setCancellationCode(e.target.value)}
                    className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                    placeholder="Enter your cancellation code"
                    aria-label="Confirm cancellation code"
                    required
                  />
                  <p className="text-xs text-gray-500">Hint: Use "CX12345" for demo purposes</p>
                </div>
              </div>

              <DialogFooter className="sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowCancellationDialog(false)}
                  className="border-gray-300 text-gray-700"
                  aria-label="Keep my booking"
                >
                  Keep My Booking
                </Button>
                <Button
                  onClick={handleCancellationSubmit}
                  disabled={isLoading}
                  className="bg-error hover:bg-error/90 text-white"
                  aria-label="Confirm cancellation"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
