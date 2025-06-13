"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, Clock, Hotel, User, RefreshCw, AlertCircle } from "lucide-react"
import { fetchRooms, updateRoom } from "@/services/rooms"
import { fetchBookings, checkInBooking, checkOutBooking } from "@/services/api/booking"
import { formatCurrency } from "@/services/booking"
import { BookingResponse } from "@/services/api/booking"
import { fetchPendingPayments, processPayment } from "@/services/api/payment"

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

interface Payment {
  _id: string;
  guestName: string;
  amountDue: number;
  dueDate: string;
  bookingNumber: string;
  status: 'pending' | 'overdue' | 'paid';
}

export default function ReceptionistDashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [isLoadingPayments, setIsLoadingPayments] = useState(true)
  const [errorRooms, setErrorRooms] = useState<string | null>(null)
  const [errorBookings, setErrorBookings] = useState<string | null>(null)
  const [errorPayments, setErrorPayments] = useState<string | null>(null)

  useEffect(() => {
    loadRooms()
    loadBookings()
    loadPendingPayments()
  }, [])

  const loadRooms = async () => {
    setIsLoadingRooms(true)
    setErrorRooms(null)
    try {
      const data = await fetchRooms()
      setRooms(data)
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setErrorRooms(err instanceof Error ? err.message : 'Failed to fetch rooms')
    } finally {
      setIsLoadingRooms(false)
    }
  }

  const loadBookings = async () => {
    setIsLoadingBookings(true)
    setErrorBookings(null)
    try {
      const response = await fetchBookings()
      setBookings(response.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setErrorBookings(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const loadPendingPayments = async () => {
    setIsLoadingPayments(true)
    setErrorPayments(null)
    try {
      const response = await fetchPendingPayments();
      setPendingPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err)
      setErrorPayments(err instanceof Error ? err.message : 'Failed to fetch payments')
    } finally {
      setIsLoadingPayments(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Available</Badge>
      case "occupied":
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Occupied</Badge>
      case "maintenance":
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Maintenance</Badge>
      case "cleaning":
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Cleaning</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleCheckIn = async (bookingId: string) => {
    console.log(`Attempting check-in for booking: ${bookingId}`)
    setIsLoadingBookings(true)
    setErrorBookings(null)
    try {
      const response = await checkInBooking(bookingId)
      console.log('Check-in successful:', response)
      loadBookings() // Refresh bookings after successful check-in
    } catch (error) {
      console.error('Error during check-in:', error)
      setErrorBookings(error instanceof Error ? error.message : 'Failed to check-in booking')
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const handleCheckOut = async (bookingId: string) => {
    console.log(`Attempting check-out for booking: ${bookingId}`)
    setIsLoadingBookings(true)
    setErrorBookings(null)
    try {
      const response = await checkOutBooking(bookingId)
      console.log('Check-out successful:', response)
      loadBookings() // Refresh bookings after successful check-out
    } catch (error) {
      console.error('Error during check-out:', error)
      setErrorBookings(error instanceof Error ? error.message : 'Failed to check-out booking')
    } finally {
      setIsLoadingBookings(false)
    }
  }

  const handleUpdateRoomStatus = async (roomId: string, newStatus: Room["status"]) => {
    setIsLoadingRooms(true)
    try {
      await updateRoom(roomId, { status: newStatus })
      loadRooms() // Refresh rooms after update
    } catch (error) {
      console.error('Error updating room status:', error)
      setErrorRooms(error instanceof Error ? error.message : 'Failed to update room status')
    } finally {
      setIsLoadingRooms(false)
    }
  }

  const handleProcessPayment = async (paymentId: string) => {
    console.log(`Processing payment: ${paymentId}`)
    // TODO: Implement actual API call to process payment using a new function
    setIsLoadingPayments(true);
    try {
      // This assumes your processPayment API takes the payment ID and perhaps some data, 
      // and then returns the updated payment record. Adjust as per your backend API.
      await processPayment(paymentId, {}); // Sending empty object as placeholder for payment details
      loadPendingPayments(); // Refresh pending payments after processing
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorPayments(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoadingPayments(false);
    }
  }

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const todaysCheckIns = bookings.filter(booking => {
    const checkInDate = new Date(booking.booking.checkIn);
    return checkInDate.toISOString().slice(0, 10) === todayISO;
  });

  const todaysCheckOuts = bookings.filter(booking => {
    const checkOutDate = new Date(booking.booking.checkOut);
    return checkOutDate.toISOString().slice(0, 10) === todayISO;
  });

  const handleBookNewRoom = () => {
    // Redirect to the booking page, perhaps with a flag for receptionist booking
    // The booking page (app/booking/page.tsx) will need to be updated to handle this scenario
    window.location.href = "/booking?receptionist=true";
  };

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="container mx-auto px-4 py-8 pt-20"> {/* Added pt-20 for Navbar clearance */}
              <h1 className="text-3xl font-medium text-primary mb-2">Receptionist Dashboard</h1>
        <p className="text-gray-600 mb-8">{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="flex justify-end mb-4">
          <Button onClick={handleBookNewRoom} className="bg-primary hover:bg-primary/90 text-white">
            Book New Room
          </Button>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Check-ins & Check-outs */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-primary flex items-center">
                <Calendar className="w-6 h-6 mr-3" />
                    Today's Check-ins & Check-outs
                  </CardTitle>
                  <CardDescription>Manage guest arrivals and departures</CardDescription>
                </CardHeader>
                <CardContent>
              {isLoadingBookings ? (
                <div className="text-center py-10">Loading check-ins and check-outs...</div>
              ) : errorBookings ? (
                <div className="text-center py-10 text-red-500 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 mr-2" /> Error: {errorBookings}
                </div>
              ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking #</TableHead>
                          <TableHead>Guest</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                    {todaysCheckIns.length === 0 && todaysCheckOuts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">No check-ins or check-outs for today.</TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {todaysCheckIns.map(booking => (
                          <TableRow key={booking.booking.bookingNumber}>
                            <TableCell>{booking.booking.bookingNumber}</TableCell>
                            <TableCell>{booking.booking.guestDetails.firstName} {booking.booking.guestDetails.lastName}</TableCell>
                            <TableCell>{booking.booking.room.roomNumber}</TableCell>
                            <TableCell className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(booking.booking.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell><Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge></TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" onClick={() => handleCheckIn(booking.booking.bookingNumber)} className="bg-blue-500 hover:bg-blue-600 text-white">Check-in</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {todaysCheckOuts.map(booking => (
                          <TableRow key={booking.booking.bookingNumber}>
                            <TableCell>{booking.booking.bookingNumber}</TableCell>
                            <TableCell>{booking.booking.guestDetails.firstName} {booking.booking.guestDetails.lastName}</TableCell>
                            <TableCell>{booking.booking.room.roomNumber}</TableCell>
                            <TableCell className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(booking.booking.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Overdue</Badge></TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" onClick={() => handleCheckOut(booking.booking.bookingNumber)} className="bg-blue-500 hover:bg-blue-600 text-white">Check-out</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                      </TableBody>
                    </Table>
              )}
                </CardContent>
              </Card>

              {/* Room Status */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-primary flex items-center">
                <Hotel className="w-6 h-6 mr-3" />
                    Room Status
                  </CardTitle>
                  <CardDescription>Monitor and update room availability</CardDescription>
                </CardHeader>
                <CardContent>
              {isLoadingRooms ? (
                <div className="text-center py-10">Loading room statuses...</div>
              ) : errorRooms ? (
                <div className="text-center py-10 text-red-500 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 mr-2" /> Error: {errorRooms}
                            </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {rooms.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-gray-500">No rooms found.</div>
                  ) : (
                    rooms.map(room => {
                      // Find the booking that corresponds to the current room and is currently occupied
                      const occupiedBooking = bookings.find(
                        b => b.booking.room.roomNumber === room.roomNumber &&
                          (b.status === "confirmed" || b.status === "pending") && // Considering confirmed/pending bookings as occupied
                          new Date(b.booking.checkIn) <= today && new Date(b.booking.checkOut) >= today // Occupied today
                      );
                      return (
                        <Card key={room._id} className="border p-4">
                          <h3 className="font-medium text-lg text-primary">Room {room.roomNumber}</h3>
                          <p className="text-sm text-gray-600 mb-2">{room.type}</p>
                          <div className="mb-3">{getStatusBadge(room.status)}</div>
                          {room.status === 'occupied' && occupiedBooking && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <User className="w-3 h-3 mr-1" /> {occupiedBooking.guestDetails.firstName} {occupiedBooking.guestDetails.lastName}
                            </p>
                          )}
                          {room.status === 'occupied' && occupiedBooking && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" /> Check-out: {new Date(occupiedBooking.booking.checkOut).toLocaleDateString()}
                            </p>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={() => handleUpdateRoomStatus(room.roomNumber, room.status === 'available' ? 'occupied' : 'available')}
                          >
                            Update Status
                          </Button>
                      </Card>
                      )
                    })
                  )}
                  </div>
              )}
                </CardContent>
              </Card>
            </div>

            {/* Pending Payments */}
        <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-primary flex items-center">
              <DollarSign className="w-6 h-6 mr-3" />
                  Pending Payments
                </CardTitle>
                <CardDescription>Process outstanding guest payments</CardDescription>
              </CardHeader>
              <CardContent>
            {isLoadingPayments ? (
              <div className="text-center py-10">Loading pending payments...</div>
            ) : errorPayments ? (
              <div className="text-center py-10 text-red-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" /> Error: {errorPayments}
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No pending payments.</div>
            ) : (
                <div className="space-y-4">
                {pendingPayments.map(payment => (
                  <div key={payment._id} className={`p-4 rounded-lg flex justify-between items-center ${payment.status === 'overdue' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                          <div>
                      <p className="font-medium text-gray-800">{payment.guestName}</p>
                            <p className="text-sm text-gray-600">Booking #{payment.bookingNumber}</p>
                          </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{formatCurrency(payment.amountDue)}</p>
                      <div className={`text-sm ${payment.status === 'overdue' ? 'text-red-600' : 'text-gray-500'}`}>
                        <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                        {payment.status === 'overdue' && <Badge className="ml-2 bg-red-500 text-white">Overdue</Badge>}
                        </div>
                      </div>
                      <Button
                      size="sm"
                      onClick={() => handleProcessPayment(payment._id)}
                      className="bg-secondary hover:bg-secondary/90 text-white"
                      >
                        Process Payment
                      </Button>
                    </div>
                  ))}
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
    </div>
  )
}