"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Phone, Users, MessageSquare, LogIn } from 'lucide-react'
import { BookingData } from "@/app/booking/page"

interface GuestDetailsStepProps {
  data: BookingData
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
  setError: (error: string) => void
  setIsLoading: (loading: boolean) => void
}

export default function GuestDetailsStep({ data, onUpdate, onNext, onPrev, setError, setIsLoading }: GuestDetailsStepProps) {
  const [formData, setFormData] = useState({
    firstName: data.guestDetails?.firstName || "",
    lastName: data.guestDetails?.lastName || "",
    email: data.guestDetails?.email || "",
    phone: data.guestDetails?.phone || "",
    guestCount: data.guestDetails?.guestCount || data.guests,
    specialRequests: data.guestDetails?.specialRequests || "",
  })
  const [captchaVerified, setCaptchaVerified] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email address is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return false
    }
    if (!/^6[578]\d{7}$/.test(formData.phone)) {
      setError("Please enter a valid 9-digit number starting with 65, 67, or 68.");
      return false;
    }
    if (!captchaVerified) {
      setError("Please complete the CAPTCHA verification")
      return false
    }
    return true
  }

  const handleContinueAsGuest = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Log the data being sent to the backend
      const guestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        guestCount: formData.guestCount,
        specialRequests: formData.specialRequests,
        roomId: data.selectedRoom?._id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        roomType: data.selectedRoom?.type,
        roomNumber: data.selectedRoom?.roomNumber,
        price: data.selectedRoom?.price
      }

      console.log('Sending guest details to backend:', {
        endpoint: 'http://localhost:5000/api/bookings/create',
        data: guestData
      })

      // Simulate API call to /api/bookings/create
      await new Promise(resolve => setTimeout(resolve, 1500))

      onUpdate({
        guestDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          guestCount: formData.guestCount,
          specialRequests: formData.specialRequests,
        }
      })

      onNext()
    } catch (error) {
      console.error('Error saving guest details:', error)
      setError("Failed to save guest details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    // Log the redirect to login
    console.log('Redirecting to login page')
    // Redirect to sign in page
    setError("Sign in functionality would redirect to login page")
  }

  const handleCaptcha = () => {
    // Simulate CAPTCHA verification
    setCaptchaVerified(true)
  }

  return (
    <div className=" space-y-6">
      {/* Booking Summary */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-4">
              <span><strong>Room:</strong> {data.selectedRoom?.type} - {data.selectedRoom?.number}</span>
              <span><strong>Price:</strong> ${data.selectedRoom?.price}/night</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="border-primary text-primary hover:bg-primary hover:text-white"
              aria-label="Go back to room selection"
            >
              <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              Change Room
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guest Details Form */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-primary">Guest Information</CardTitle>
          <p className="text-gray-600">Tell us about yourself to complete your booking</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="first-name"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                  placeholder="Enter your first name"
                  aria-label="First name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="last-name"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                  placeholder="Enter your last name"
                  aria-label="Last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                  placeholder="Enter your phone number"
                  aria-label="Phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="guest-count" className="text-sm font-medium text-gray-700">
                Number of Guests
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="guest-count"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange("guestCount", parseInt(e.target.value))}
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary text-base max-w-xs"
                  aria-label="Number of guests"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="special-requests" className="text-sm font-medium text-gray-700">
                Special Requests (Optional)
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Textarea
                  id="special-requests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  className="pl-10 pt-10 border-gray-300 focus:border-primary focus:ring-primary text-base resize-none"
                  placeholder="Any special requests or requirements..."
                  rows={4}
                  aria-label="Special requests"
                />
              </div>
            </div>
          </div>

          {/* CAPTCHA */}
          <Card className="mb-6 bg-gray-50">
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
                    Verify
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContinueAsGuest}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-[200px]"
              aria-label="Continue as guest"
            >
              Continue as Guest
            </Button>
            
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[200px]"
              aria-label="Sign in to existing account"
            >
              <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
