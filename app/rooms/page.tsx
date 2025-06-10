"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Bed,
  Building,
  DollarSign,
  Eye,
  X,
  Settings,
} from "lucide-react"

interface Room {
  id: string
  roomNumber: string
  type: string
  status: "available" | "occupied" | "maintenance" | "cleaning" | "out-of-order"
  floor: number
  view: string
  price: number
  amenities: string[]
  lastUpdated: string
}

interface RoomFilters {
  type: string
  status: string
  minPrice: string
  maxPrice: string
  floor: string
}

const ROOM_TYPES = ["Standard", "Deluxe", "Ocean View Suite", "Presidential Suite", "Family Room"]
const ROOM_STATUSES = ["available", "occupied", "maintenance", "cleaning", "out-of-order"]
const VIEWS = ["Ocean View", "Garden View", "City View", "Pool View"]
const AMENITIES = [
  "Wi-Fi",
  "Mini Bar",
  "Balcony",
  "Jacuzzi",
  "King Bed",
  "Queen Bed",
  "Work Desk",
  "Coffee Maker",
  "Butler Service",
  "Living Room",
]

export default function RoomManagementPage() {
  const [isAdmin] = useState(true) // Mock admin status
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<RoomFilters>({
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    floor: "all",
  })

  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "",
    floor: "",
    view: "",
    price: "",
    amenities: [] as string[],
  })

  // Mock room data
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      roomNumber: "101",
      type: "Standard",
      status: "available",
      floor: 1,
      view: "Garden View",
      price: 150,
      amenities: ["Wi-Fi", "Coffee Maker"],
      lastUpdated: "2025-06-09T10:30:00Z",
    },
    {
      id: "2",
      roomNumber: "102",
      type: "Standard",
      status: "cleaning",
      floor: 1,
      view: "Garden View",
      price: 150,
      amenities: ["Wi-Fi", "Coffee Maker"],
      lastUpdated: "2025-06-09T11:15:00Z",
    },
    {
      id: "3",
      roomNumber: "205",
      type: "Ocean View Suite",
      status: "occupied",
      floor: 2,
      view: "Ocean View",
      price: 299,
      amenities: ["Wi-Fi", "Mini Bar", "Balcony", "King Bed"],
      lastUpdated: "2025-06-09T09:45:00Z",
    },
    {
      id: "4",
      roomNumber: "301",
      type: "Presidential Suite",
      status: "available",
      floor: 3,
      view: "Ocean View",
      price: 599,
      amenities: ["Wi-Fi", "Mini Bar", "Balcony", "Jacuzzi", "Butler Service", "Living Room"],
      lastUpdated: "2025-06-09T08:20:00Z",
    },
    {
      id: "5",
      roomNumber: "203",
      type: "Deluxe",
      status: "maintenance",
      floor: 2,
      view: "City View",
      price: 199,
      amenities: ["Wi-Fi", "Work Desk", "Queen Bed"],
      lastUpdated: "2025-06-09T12:00:00Z",
    },
  ])

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  // Filter and search logic
  const filteredRooms = useMemo(() => {
    try {
      return rooms.filter((room) => {
        const matchesSearch =
          room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.view.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filters.type === "all" || room.type === filters.type
        const matchesStatus = filters.status === "all" || room.status === filters.status
        const matchesFloor = filters.floor === "all" || room.floor.toString() === filters.floor

        const minPrice = filters.minPrice ? Number.parseFloat(filters.minPrice) : 0
        const maxPrice = filters.maxPrice ? Number.parseFloat(filters.maxPrice) : Number.POSITIVE_INFINITY
        const matchesPrice = room.price >= minPrice && room.price <= maxPrice

        return matchesSearch && matchesType && matchesStatus && matchesFloor && matchesPrice
      })
    } catch (error) {
      console.error("Error filtering rooms:", error)
      return rooms
    }
  }, [rooms, searchTerm, filters])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / itemsPerPage))
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage)
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (key: keyof RoomFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      minPrice: "",
      maxPrice: "",
      floor: "all",
    })
    setCurrentPage(1)
  }

  const handleStatusUpdate = async (room: Room, newStatus: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id ? { ...r, status: newStatus as Room["status"], lastUpdated: new Date().toISOString() } : r,
        ),
      )

      showAlert(`Room ${room.roomNumber} status updated to ${newStatus}`, "success")
      setSelectedRoom(null)
    } catch (error) {
      showAlert("Failed to update room status. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRoom = async () => {
    // Validation
    if (!newRoom.roomNumber || !newRoom.type || !newRoom.floor || !newRoom.view || !newRoom.price) {
      showAlert("Please fill in all required fields", "error")
      return
    }

    // Check if room number already exists
    if (rooms.some((room) => room.roomNumber === newRoom.roomNumber)) {
      showAlert("Room number already exists", "error")
      return
    }

    const price = Number.parseFloat(newRoom.price)
    if (isNaN(price) || price <= 0) {
      showAlert("Please enter a valid price", "error")
      return
    }

    const floor = Number.parseInt(newRoom.floor)
    if (isNaN(floor) || floor <= 0) {
      showAlert("Please enter a valid floor number", "error")
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const room: Room = {
        id: Date.now().toString(),
        roomNumber: newRoom.roomNumber,
        type: newRoom.type,
        status: "available",
        floor: floor,
        view: newRoom.view,
        price: price,
        amenities: newRoom.amenities,
        lastUpdated: new Date().toISOString(),
      }

      setRooms((prev) => [...prev, room])
      setNewRoom({
        roomNumber: "",
        type: "",
        floor: "",
        view: "",
        price: "",
        amenities: [],
      })
      setShowAddForm(false)
      showAlert(`Room ${room.roomNumber} added successfully`, "success")
    } catch (error) {
      showAlert("Failed to add room. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmenityToggle = (amenity: string) => {
    setNewRoom((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

    switch (status) {
      case "available":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case "occupied":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      case "cleaning":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
      case "maintenance":
        return `${baseClasses} bg-orange-100 text-orange-800 border border-orange-200`
      case "out-of-order":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
    }
  }

  return (
    <div className="min-h-screen bg-neutral font-roboto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-primary mb-2">Room Management</h1>
          <p className="text-gray-600">Manage hotel rooms, availability, and pricing</p>
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

        {/* Controls */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  placeholder="Search rooms by number, type, or view..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                  aria-label="Search rooms"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white h-12"
                  aria-label="Toggle filters"
                >
                  <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                  Filters
                  {Object.values(filters).some((f) => f !== "all") && (
                    <Badge className="ml-2 bg-secondary text-white">Active</Badge>
                  )}
                </Button>

                {isAdmin && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary hover:bg-primary/90 text-white h-12 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    aria-label="Add new room"
                  >
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add Room
                  </Button>
                )}
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-type">Room Type</Label>
                    <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                      <SelectTrigger id="filter-type" className="h-10">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {ROOM_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-status">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger id="filter-status" className="h-10">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {ROOM_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-floor">Floor</Label>
                    <Select value={filters.floor} onValueChange={(value) => handleFilterChange("floor", value)}>
                      <SelectTrigger id="filter-floor" className="h-10">
                        <SelectValue placeholder="All Floors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Floors</SelectItem>
                        <SelectItem value="1">Floor 1</SelectItem>
                        <SelectItem value="2">Floor 2</SelectItem>
                        <SelectItem value="3">Floor 3</SelectItem>
                        <SelectItem value="4">Floor 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-min-price">Min Price</Label>
                    <Input
                      id="filter-min-price"
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-max-price">Max Price</Label>
                    <Input
                      id="filter-max-price"
                      type="number"
                      placeholder="$999"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRooms.length)} of{" "}
            {filteredRooms.length} rooms
          </p>
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span className="text-sm text-gray-600">Total: {rooms.length} rooms</span>
          </div>
        </div>

        {/* Rooms Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Room #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Floor</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead className="w-24">Price</TableHead>
                    <TableHead>Amenities</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRooms.map((room) => (
                    <TableRow key={room.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{room.roomNumber}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(room.status)}>
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell className="flex items-center">
                        <Eye className="w-3 h-3 mr-1 text-gray-400" aria-hidden="true" />
                        {room.view}
                      </TableCell>
                      <TableCell className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1 text-gray-400" aria-hidden="true" />
                        {room.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 2).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setSelectedRoom(room)}
                          size="sm"
                          className="bg-secondary hover:bg-secondary/90 text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
                          aria-label={`Update status for room ${room.roomNumber}`}
                        >
                          <Settings className="w-3 h-3 mr-1" aria-hidden="true" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <Bed className="w-12 h-12 mx-auto mb-4 text-gray-300" aria-hidden="true" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No rooms found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-gray-300"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                      aria-label={`Go to page ${page}`}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-gray-300"
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>

      {/* Add Room Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-primary">Add New Room</DialogTitle>
            <DialogDescription>Create a new room in the hotel inventory</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="room-number">Room Number *</Label>
              <Input
                id="room-number"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom((prev) => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="e.g., 101"
                className="h-12"
                aria-label="Room number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type">Room Type *</Label>
              <Select value={newRoom.type} onValueChange={(value) => setNewRoom((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger id="room-type" className="h-12">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                max="10"
                value={newRoom.floor}
                onChange={(e) => setNewRoom((prev) => ({ ...prev, floor: e.target.value }))}
                placeholder="e.g., 1"
                className="h-12"
                aria-label="Floor number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="view">View *</Label>
              <Select value={newRoom.view} onValueChange={(value) => setNewRoom((prev) => ({ ...prev, view: value }))}>
                <SelectTrigger id="view" className="h-12">
                  <SelectValue placeholder="Select view type" />
                </SelectTrigger>
                <SelectContent>
                  {VIEWS.map((view) => (
                    <SelectItem key={view} value={view}>
                      {view}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="price">Price per Night *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="pl-10 h-12"
                  aria-label="Price per night"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={newRoom.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                      aria-label={`Include ${amenity} amenity`}
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button
              onClick={handleAddRoom}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white"
              aria-label="Save new room"
            >
              {isLoading ? "Saving..." : "Save Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-primary">
              Update Room {selectedRoom?.roomNumber} Status
            </DialogTitle>
            <DialogDescription>Change the current status of this room</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              {ROOM_STATUSES.map((status) => (
                <Button
                  key={status}
                  onClick={() => selectedRoom && handleStatusUpdate(selectedRoom, status)}
                  disabled={isLoading || selectedRoom?.status === status}
                  variant={selectedRoom?.status === status ? "default" : "outline"}
                  className={`w-full justify-start h-12 ${
                    selectedRoom?.status === status
                      ? "bg-primary text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label={`Set status to ${status}`}
                >
                  <Badge className={`${getStatusBadge(status)} mr-3`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRoom(null)} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
