"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar, Clock, User, LogOut, Menu, CheckCircle, AlertCircle, CreditCard, Bed, Users, X } from "lucide-react"

interface CheckInOut {
  id: string
  bookingNumber: string
  guestName: string
  roomNumber: string
  type: "check-in" | "check-out"
  scheduledTime: string
  status: "pending" | "completed" | "overdue"
}

interface RoomStatus {
  id: string
  roomNumber: string
  type: string
  status: "available" | "occupied" | "maintenance" | "cleaning"
  guestName?: string
  checkOut?: string
}

interface PendingPayment {
  id: string
  bookingNumber: string
  guestName: string
  amount: number
  type: "balance" | "incidentals" | "deposit"
  dueDate: string
  isOverdue: boolean
}

export default function ReceptionistDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedAction, setSelectedAction] = useState<{
    type: string
    data: any
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const [checkInsOuts, setCheckInsOuts] = useState<CheckInOut[]>([
    {
      id: "1",
      bookingNumber: "HM123456",
      guestName: "John Smith",
      roomNumber: "205",
      type: "check-in",
      scheduledTime: "15:00",
      status: "pending",
    },
    {
      id: "2",
      bookingNumber: "HM789012",
      guestName: "Sarah Johnson",
      roomNumber: "301",
      type: "check-out",
      scheduledTime: "11:00",
      status: "overdue",
    },
    {
      id: "3",
      bookingNumber: "HM345678",
      guestName: "Mike Davis",
      roomNumber: "102",
      type: "check-in",
      scheduledTime: "16:30",
      status: "pending",
    },
  ])

  const [roomStatuses, setRoomStatuses] = useState<RoomStatus[]>([
    {
      id: "1",
      roomNumber: "101",
      type: "Standard",
      status: "available",
    },
    {
      id: "2",
      roomNumber: "102",
      type: "Standard",
      status: "cleaning",
    },
    {
      id: "3",
      roomNumber: "205",
      type: "Ocean View Suite",
      status: "occupied",
      guestName: "John Smith",
      checkOut: "2025-06-14",
    },
    {
      id: "4",
      roomNumber: "301",
      type: "Presidential Suite",
      status: "maintenance",
    },
  ])

  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([
    {
      id: "1",
      bookingNumber: "HM123456",
      guestName: "John Smith",
      amount: 150,
      type: "balance",
      dueDate: "2025-06-10",
      isOverdue: false,
    },
    {
      id: "2",
      bookingNumber: "HM789012",
      guestName: "Sarah Johnson",
      amount: 75,
      type: "incidentals",
      dueDate: "2025-06-09",
      isOverdue: true,
    },
  ])

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleCheckInOut = async (item: CheckInOut) => {
    setSelectedAction({ type: item.type, data: item })
  }

  const confirmCheckInOut = async () => {
    if (!selectedAction) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setCheckInsOuts((prev) =>
        prev.map((item) => (item.id === selectedAction.data.id ? { ...item, status: "completed" as const } : item)),
      )

      showAlert(
        `${selectedAction.type === "check-in" ? "Check-in" : "Check-out"} completed successfully for ${selectedAction.data.guestName}`,
        "success",
      )

      setSelectedAction(null)
    } catch (error) {
      showAlert("Operation failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoomUpdate = (room: RoomStatus) => {
    setSelectedAction({ type: "room-update", data: room })
  }

  const handlePaymentProcess = async (payment: PendingPayment) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPendingPayments((prev) => prev.filter((p) => p.id !== payment.id))
      showAlert(`Payment of $${payment.amount} processed successfully for ${payment.guestName}`, "success")
    } catch (error) {
      showAlert("Payment processing failed. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string, isOverdue = false) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

    if (isOverdue) {
      return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
    }

    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case "available":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case "occupied":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      case "cleaning":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
      case "maintenance":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
    }
  }

  const getUrgentCount = () => {
    const overdueCheckOuts = checkInsOuts.filter((item) => item.status === "overdue").length
    const overduePayments = pendingPayments.filter((payment) => payment.isOverdue).length
    return overdueCheckOuts + overduePayments
  }

  const urgentCount = getUrgentCount()

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md border"
          size="sm"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          bg-primary text-white w-64 min-h-screen fixed lg:relative z-10 transform transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          {/* User Profile */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-medium text-lg">Jane Wilson</h2>
                <p className="text-white/80 text-sm">Front Desk Receptionist</p>
              </div>
            </div>

            {urgentCount > 0 && (
              <div className="mt-4 flex items-center space-x-2 bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-300" aria-hidden="true" />
                <span className="text-sm text-red-100">
                  <Badge className="bg-red-500 text-white mr-2">{urgentCount}</Badge>
                  Urgent task{urgentCount > 1 ? "s" : ""} require attention
                </span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="p-6 border-b border-white/20">
            <h3 className="text-sm font-medium text-white/80 mb-3">Today's Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Check-ins</span>
                <span className="text-sm font-medium">
                  {checkInsOuts.filter((item) => item.type === "check-in").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Check-outs</span>
                <span className="text-sm font-medium">
                  {checkInsOuts.filter((item) => item.type === "check-out").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Available Rooms</span>
                <span className="text-sm font-medium">
                  {roomStatuses.filter((room) => room.status === "available").length}
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-6">
            <Button
              onClick={() => showAlert("Logged out successfully", "success")}
              variant="ghost"
              className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 mr-3" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-primary mb-2">Receptionist Dashboard</h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Alert */}
            {alert && (
              <Alert
                variant={alert.type === "error" ? "destructive" : "default"}
                className={`mb-6 ${alert.type === "success" ? "border-green-200 bg-green-50 text-green-800" : ""}`}
              >
                {alert.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{alert.message}</AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => setAlert(null)}
                  aria-label="Dismiss alert"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Alert>
            )}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              {/* Today's Check-ins/Check-outs */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-primary flex items-center">
                    <Calendar className="w-6 h-6 mr-2" aria-hidden="true" />
                    Today's Check-ins & Check-outs
                  </CardTitle>
                  <CardDescription>Manage guest arrivals and departures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking #</TableHead>
                          <TableHead>Guest</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checkInsOuts.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.bookingNumber}</TableCell>
                            <TableCell>{item.guestName}</TableCell>
                            <TableCell>{item.roomNumber}</TableCell>
                            <TableCell className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" aria-hidden="true" />
                              {item.scheduledTime}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(item.status, item.status === "overdue")}>
                                {item.status === "overdue" ? "Overdue" : item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.status !== "completed" && (
                                <Button
                                  onClick={() => handleCheckInOut(item)}
                                  size="sm"
                                  className="bg-secondary hover:bg-secondary/90 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
                                  aria-label={`${item.type === "check-in" ? "Check in" : "Check out"} ${item.guestName}`}
                                >
                                  {item.type === "check-in" ? "Check-in" : "Check-out"}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Room Status */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-primary flex items-center">
                    <Bed className="w-6 h-6 mr-2" aria-hidden="true" />
                    Room Status
                  </CardTitle>
                  <CardDescription>Monitor and update room availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roomStatuses.map((room) => (
                      <Card key={room.id} className="border-2 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-primary">Room {room.roomNumber}</h4>
                              <p className="text-sm text-gray-600">{room.type}</p>
                            </div>
                            <Badge className={getStatusBadge(room.status)}>
                              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                            </Badge>
                          </div>

                          {room.guestName && (
                            <div className="mb-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1" aria-hidden="true" />
                                {room.guestName}
                              </div>
                              {room.checkOut && (
                                <div className="flex items-center mt-1">
                                  <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
                                  Check-out: {new Date(room.checkOut).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}

                          <Button
                            onClick={() => handleRoomUpdate(room)}
                            size="sm"
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                            aria-label={`Update status for room ${room.roomNumber}`}
                          >
                            Update Status
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Payments */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-primary flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" aria-hidden="true" />
                  Pending Payments
                  {pendingPayments.filter((p) => p.isOverdue).length > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {pendingPayments.filter((p) => p.isOverdue).length} Overdue
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Process outstanding guest payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        payment.isOverdue ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{payment.guestName}</h4>
                            <p className="text-sm text-gray-600">Booking #{payment.bookingNumber}</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-primary">${payment.amount}</p>
                            <p className="text-sm text-gray-600 capitalize">{payment.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                            </p>
                            {payment.isOverdue && (
                              <Badge className="bg-red-100 text-red-800 border border-red-200">Overdue</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handlePaymentProcess(payment)}
                        disabled={isLoading}
                        className="bg-secondary hover:bg-secondary/90 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
                        aria-label={`Process payment of $${payment.amount} for ${payment.guestName}`}
                      >
                        Process Payment
                      </Button>
                    </div>
                  ))}

                  {pendingPayments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" aria-hidden="true" />
                      <p>No pending payments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-5 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-primary">
              {selectedAction?.type === "check-in"
                ? "Confirm Check-in"
                : selectedAction?.type === "check-out"
                  ? "Confirm Check-out"
                  : "Update Room Status"}
            </DialogTitle>
            <DialogDescription>
              {selectedAction?.type === "check-in" || selectedAction?.type === "check-out"
                ? `Are you sure you want to ${selectedAction.type.replace("-", " ")} ${selectedAction.data?.guestName}?`
                : `Update the status for Room ${selectedAction?.data?.roomNumber}`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setSelectedAction(null)} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button
              onClick={confirmCheckInOut}
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
