"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Search, Settings, LogOut, Menu, Star, MapPin, CheckCircle, AlertCircle, X } from "lucide-react"

export default function GuestDashboard() {
  const [activeSection, setActiveSection] = useState("bookings")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [alert, setAlert] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error" | "">("")
  const [isLoading, setIsLoading] = useState(false)

  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    loyaltyPoints: 1250,
  })

  const [bookings, setBookings] = useState([
    {
      id: "1",
      bookingNumber: "HM123456",
      checkIn: "2025-06-11",
      checkOut: "2025-06-14",
      roomNumber: "205",
      roomType: "Ocean View Suite",
      status: "confirmed",
      totalAmount: 897,
    },
    {
      id: "2",
      bookingNumber: "HM789012",
      checkIn: "2025-06-25",
      checkOut: "2025-06-28",
      roomNumber: "301",
      roomType: "Presidential Suite",
      status: "confirmed",
      totalAmount: 1797,
    },
  ])

  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  })

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    emailNotifications: true,
    smsNotifications: false,
  })

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert(message)
    setAlertType(type)
    setTimeout(() => {
      setAlert("")
      setAlertType("")
    }, 5000)
  }

  const handleCancelBooking = async (bookingId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )
      showAlert("Booking cancelled successfully. A confirmation email has been sent.", "success")
      setIsLoading(false)
    }, 1000)
  }

  const handleSearchRooms = () => {
    if (!searchData.checkIn || !searchData.checkOut) {
      showAlert("Please select check-in and check-out dates", "error")
      return
    }
    showAlert("Searching for available rooms...", "success")
  }

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      showAlert("Profile updated successfully!", "success")
      setIsLoading(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

    switch (status) {
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800`
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`
      case "completed":
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "confirmed")

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-white shadow-md border" size="sm">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          bg-primary text-white w-64 min-h-screen fixed md:relative z-10 transform transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          {/* Profile Section */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium">{user.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="font-medium text-lg">{user.name}</h2>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">
                <span className="font-medium">{user.loyaltyPoints}</span> Loyalty Points
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveSection("bookings")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "bookings"
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>My Bookings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("profile")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "profile"
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => showAlert("Logged out successfully", "success")}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-primary mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-gray-600">Manage your bookings and preferences</p>
            </div>

            {/* Alert */}
            {alert && (
              <div
                className={`
                mb-6 p-4 rounded-lg border flex items-center justify-between
                ${
                  alertType === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }
              `}
              >
                <div className="flex items-center space-x-2">
                  {alertType === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>{alert}</span>
                </div>
                <Button onClick={() => setAlert("")} variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Bookings Section */}
            {activeSection === "bookings" && (
              <div className="space-y-8">
                {/* Quick Search Widget */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-medium text-primary">Quick Room Search</CardTitle>
                    <CardDescription>Find and book your next stay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="checkin">Check-in Date</Label>
                        <Input
                          id="checkin"
                          type="date"
                          value={searchData.checkIn}
                          onChange={(e) => setSearchData((prev) => ({ ...prev, checkIn: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout">Check-out Date</Label>
                        <Input
                          id="checkout"
                          type="date"
                          value={searchData.checkOut}
                          onChange={(e) => setSearchData((prev) => ({ ...prev, checkOut: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guests">Guests</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max="8"
                          value={searchData.guests}
                          onChange={(e) => setSearchData((prev) => ({ ...prev, guests: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleSearchRooms}
                      className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 h-12"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search Rooms
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Bookings */}
                <div>
                  <h2 className="text-2xl font-medium text-primary mb-6">Upcoming Bookings</h2>

                  {upcomingBookings.length === 0 ? (
                    <Card className="bg-accent/30 border-accent">
                      <CardContent className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Upcoming Bookings</h3>
                        <p className="text-gray-600 mb-4">You don't have any upcoming reservations.</p>
                        <Button className="bg-secondary hover:bg-secondary/90 text-white">Book a Room</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="bg-accent/50 border-accent shadow-lg">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-medium text-primary">{booking.roomType}</CardTitle>
                                <CardDescription className="text-gray-600">
                                  Room {booking.roomNumber} • #{booking.bookingNumber}
                                </CardDescription>
                              </div>
                              <span className={getStatusBadge(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>HotMa Hotel • Ocean View</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-lg font-medium text-primary">${booking.totalAmount}</span>
                              {booking.status === "confirmed" && (
                                <Button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={isLoading}
                                  className="bg-secondary hover:bg-secondary/90 text-white"
                                >
                                  {isLoading ? "Cancelling..." : "Cancel"}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-medium text-primary">Profile Settings</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Notification Preferences</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-xs text-gray-500">Receive booking confirmations and updates via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profileData.emailNotifications}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, emailNotifications: e.target.checked }))
                          }
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Notifications</Label>
                          <p className="text-xs text-gray-500">Receive booking reminders via SMS</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profileData.smsNotifications}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, smsNotifications: e.target.checked }))}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 h-12"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-5 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  )
}
