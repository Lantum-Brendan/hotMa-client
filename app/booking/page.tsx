"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"
import RoomSearchStep from "@/components/booking/room-search-step"
import RoomSelectionStep from "@/components/booking/room-selection-step"
import GuestDetailsStep from "@/components/booking/guest-details-step"
import PaymentStep from "@/components/booking/payment-step"
import ConfirmationStep from "@/components/booking/confirmation-step"

export interface BookingData {
  // Room Search
  checkIn: string
  checkOut: string
  guests: number
  roomType: string

  // Room Selection
  selectedRoom?: {
    id: string
    number: string
    type: string
    price: number
    amenities: string[]
    image: string
  }

  // Guest Details
  guestDetails?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    guestCount: number
    specialRequests: string
  }

  // Payment
  paymentMethod?: string
  paymentDetails?: any

  // Confirmation
  bookingNumber?: string
  cancellationCode?: string
}

const steps = [
  { id: 1, title: "Search Rooms", description: "Find your perfect stay" },
  { id: 2, title: "Select Room", description: "Choose your accommodation" },
  { id: 3, title: "Guest Details", description: "Tell us about yourself" },
  { id: 4, title: "Payment", description: "Secure your booking" },
  { id: 5, title: "Confirmation", description: "You're all set!" },
]

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "any",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
    setError("")
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const progress = (currentStep / 5) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoomSearchStep
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={nextStep}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 2:
        return (
          <RoomSelectionStep
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 3:
        return (
          <GuestDetailsStep
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 4:
        return (
          <PaymentStep
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )
      case 5:
        return <ConfirmationStep data={bookingData} onUpdate={updateBookingData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-primary mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure your perfect stay at HotMa Hotel</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-primary">
                Step {currentStep} of 5: {steps[currentStep - 1].title}
              </h2>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>

            <Progress
              value={progress}
              className="h-2 mb-4"
              aria-label={`Booking progress: ${Math.round(progress)}% complete`}
            />

            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      step.id < currentStep
                        ? "bg-primary text-white"
                        : step.id === currentStep
                          ? "bg-secondary text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                    aria-label={`Step ${step.id}: ${step.title}`}
                  >
                    {step.id < currentStep ? <Check className="w-4 h-4" aria-hidden="true" /> : step.id}
                  </div>
                  <div className="text-center mt-2 hidden sm:block">
                    <p className="text-xs font-medium text-gray-700">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-error bg-error/5">
            <CardContent className="p-4">
              <p className="text-error text-sm font-normal" role="alert" aria-live="polite">
                {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        <div className="transition-all duration-300 ease-in-out">{renderStep()}</div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-gray-700">Processing...</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
