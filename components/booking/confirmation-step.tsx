"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Calendar, MapPin, Users, Phone, Mail } from 'lucide-react'
import { BookingData } from "@/app/booking/page"

interface ConfirmationStepProps {
  data: BookingData
  onUpdate: (data: Partial<BookingData>) => void
}

export default function ConfirmationStep({ data }: ConfirmationStepProps) {
  const calculateNights = () => {
    if (data.checkIn && data.checkOut) {
      const checkIn = new Date(data.checkIn)
      const checkOut = new Date(data.checkOut)
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  const calculateTotal = () => {
    if (!data.selectedRoom) return 0
    const nights = calculateNights()
    const subtotal = data.selectedRoom.price * nights
    const tax = Math.round(subtotal * 0.15)
    return subtotal + tax
  }

  const handleDownloadPDF = () => {
    // Simulate PDF download
    console.log("Downloading booking confirmation PDF...")
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="bg-accent border-accent shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-3xl font-medium text-primary mb-2">Booking Confirmed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for choosing HotMa Hotel. Your reservation has been successfully processed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-primary mb-2">Booking Number</h3>
              <p className="text-2xl font-bold text-gray-800">{data.bookingNumber}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-primary mb-2">Cancellation Code</h3>
              <p className="text-2xl font-bold text-gray-800">{data.cancellationCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary">Reservation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-secondary" aria-hidden="true" />
              <div>
                <p className="font-medium">Room {data.selectedRoom?.number}</p>
                <p className="text-gray-600">{data.selectedRoom?.type}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-secondary" aria-hidden="true" />
              <div>
                <p className="font-medium">
                  {new Date(data.checkIn).toLocaleDateString()} - {new Date(data.checkOut).toLocaleDateString()}
                </p>
                <p className="text-gray-600">{calculateNights()} night{calculateNights() > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-secondary" aria-hidden="true" />
              <div>
                <p className="font-medium">{data.guestDetails?.guestCount} Guest{data.guestDetails?.guestCount !== 1 ? 's' : ''}</p>
                <p className="text-gray-600">
                  {data.guestDetails?.firstName} {data.guestDetails?.lastName}
                </p>
              </div>
            </div>

            {data.guestDetails?.specialRequests && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-700 mb-2">Special Requests</h4>
                <p className="text-gray-600 text-sm">{data.guestDetails.specialRequests}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">Room Amenities</h4>
              <div className="grid grid-cols-2 gap-1">
                {data.selectedRoom?.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" aria-hidden="true" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-primary">Contact & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-secondary" aria-hidden="true" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{data.guestDetails?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-secondary" aria-hidden="true" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{data.guestDetails?.phone}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Rate ({calculateNights()} night{calculateNights() > 1 ? 's' : ''})</span>
                  <span>${data.selectedRoom?.price && data.selectedRoom.price * calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>${data.selectedRoom?.price && Math.round(data.selectedRoom.price * calculateNights() * 0.15)}</span>
                </div>
                <div className="flex justify-between font-medium text-primary pt-2 border-t">
                  <span>Total Paid</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Payment Method: {data.paymentMethod === 'momo' ? 'MTN Mobile Money' : 'Credit/Debit Card'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleDownloadPDF}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 h-12 text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-[200px]"
              aria-label="Download booking confirmation PDF"
            >
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Download PDF
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                A confirmation email has been sent to {data.guestDetails?.email}
              </p>
              <p className="text-xs text-gray-500">
                Please save your booking number and cancellation code for future reference
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-medium text-gray-700 mb-4">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Check-in</h4>
              <ul className="space-y-1">
                <li>• Check-in time: 3:00 PM</li>
                <li>• Early check-in subject to availability</li>
                <li>• Valid ID required at check-in</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Check-out</h4>
              <ul className="space-y-1">
                <li>• Check-out time: 11:00 AM</li>
                <li>• Late check-out available for additional fee</li>
                <li>• Express check-out available</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Cancellation</h4>
              <ul className="space-y-1">
                <li>• Free cancellation up to 24 hours before check-in</li>
                <li>• Use cancellation code: {data.cancellationCode}</li>
                <li>• Contact us for assistance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Contact</h4>
              <ul className="space-y-1">
                <li>• Phone: +1 (234) 567-8900</li>
                <li>• Email: reservations@hotmahotel.com</li>
                <li>• 24/7 guest services available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
