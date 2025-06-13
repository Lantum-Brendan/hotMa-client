"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Home, User, BookOpen, Gift, Menu, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchRooms } from "@/services/rooms"
import { Room } from "@/types/room"
import GuestProfilePage from "./profile/page"
import GuestBookingsPage from "./bookings/page"
import ReceptionistDashboard from "../receptionist/page"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  loyaltyPoints?: number;
}

export default function GuestDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)

  const [roomType, setRoomType] = useState("any")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [searchError, setSearchError] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    console.log("Dashboard useEffect: userData from localStorage", userData);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("Dashboard useEffect: parsedUser.role", parsedUser.role);
        if (parsedUser.role === "receptionist") {
          setActiveSection("receptionist-dashboard");
          console.log("Dashboard useEffect: setActiveSection to receptionist-dashboard");
        } else {
          setActiveSection("dashboard"); // Default for other roles
          console.log("Dashboard useEffect: setActiveSection to dashboard (other role)");
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e)
        // Optionally, clear invalid data
        localStorage.removeItem("user")
      }
    }

    const loadRooms = async () => {
      try {
        const data = await fetchRooms()
        setRooms(data)
      } catch (err) {
        console.error('Error fetching rooms:', err)
      }
    }
    loadRooms()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    })
    router.push("/login")
  }

  const handleSearch = async () => {
    setSearchError("")
    setIsSearching(true)
    if (checkIn && checkOut && roomType !== "any") {
      window.location.href = `/booking?step=1&roomType=${roomType}&checkIn=${checkIn}&checkOut=${checkOut}`
    } else {
      setSearchError("Please select check-in, check-out dates and a room type.")
    }
    setIsSearching(false)
  }

  const roomTypes = Array.from(new Set(rooms.map(room => room.type)))

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Quick Room Search Widget */}
            <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-primary text-center">Quick Room Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <Label htmlFor="room-type" className="text-sm font-normal text-gray-700">
                      Room Type
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
                        <SelectItem value="any">Any</SelectItem>
                        {roomTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {searchError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm font-normal" role="alert" aria-live="polite">
                      {searchError}
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 text-lg font-normal transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    aria-label="Search available rooms"
                  >
                    {isSearching ? "Searching..." : "Search Rooms"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Bookings Placeholder */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-primary">Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No upcoming bookings found. Book your next stay!</p>
                {/* In a real app, this would fetch and display upcoming bookings */}
              </CardContent>
            </Card>

            {/* Recent Activity/Booking History Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-medium text-primary">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No recent activity.</p>
                {/* In a real app, this would fetch and display recent bookings or activities */}
              </CardContent>
            </Card>
          </>
        )
      case "bookings":
        return <GuestBookingsPage />
      case "profile":
        return user ? <GuestProfilePage userData={user} /> : null
      case "receptionist-dashboard":
        return <ReceptionistDashboard />
      default:
        return <div className="text-center py-10">Select a section from the sidebar.</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-roboto">
      <div className="flex flex-1 pt-0">
        {/* Sidebar */}
        <aside className={`
          bg-primary text-white w-64 p-6 space-y-6 flex-shrink-0 h-screen fixed top-0 left-0 overflow-y-auto
          ${isMobileMenuOpen ? 'block' : 'hidden'} md:block md:relative transform
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-20`}>
          <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium">{user?.name.charAt(0).toUpperCase() || "J"}</span>
              </div>
              <div>
              <h2 className="font-medium text-lg">{user?.name || "Guest User"}</h2>
              <p className="text-white/80 text-sm">{user?.email || "guest@example.com"}</p>
              </div>
            </div>

          {user?.role !== "receptionist" && (
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
              <Gift className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">
                <span className="font-medium">{user?.loyaltyPoints || 0}</span> Loyalty Points
              </span>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {console.log("Sidebar rendering: user.role", user?.role)}
              {user?.role === "receptionist" ? (
                <li>
                  <button
                    onClick={() => {
                      setActiveSection("receptionist-dashboard")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 w-full p-2 rounded-lg text-left transition-colors duration-200
                      ${activeSection === "receptionist-dashboard" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}
                    `}
                  >
                    <Home className="w-5 h-5" />
                    <span>Receptionist Dashboard</span>
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("dashboard")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`flex items-center space-x-3 w-full p-2 rounded-lg text-left transition-colors duration-200
                        ${activeSection === "dashboard" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}
                      `}
                    >
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                  </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("bookings")
                    setIsMobileMenuOpen(false)
                  }}
                      className={`flex items-center space-x-3 w-full p-2 rounded-lg text-left transition-colors duration-200
                        ${activeSection === "bookings" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}
                      `}
                    >
                      <BookOpen className="w-5 h-5" />
                  <span>My Bookings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("profile")
                    setIsMobileMenuOpen(false)
                  }}
                      className={`flex items-center space-x-3 w-full p-2 rounded-lg text-left transition-colors duration-200
                        ${activeSection === "profile" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}
                      `}
                    >
                      <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full p-2 rounded-lg text-left text-white/80 hover:bg-white/10 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Menu Button - outside aside for better positioning */}
        <div className="md:hidden fixed top-4 left-4 z-20">
          <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-white shadow-md border" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {console.log("Content rendering: activeSection", activeSection)}
            {renderContent()}
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
