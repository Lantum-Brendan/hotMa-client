"use client"

import { useState, useMemo, useEffect } from "react"
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
import { fetchRooms } from '../../services/rooms'
import Link from 'next/link';
import { getUserRole } from '../../services/auth';

interface Room {
  _id: string;
  roomNumber: string
  type: string
  status: "available" | "occupied" | "maintenance" | "cleaning" | "out-of-order"
  floor: number
  view: string
  price: number
  amenities: string[]
  lastUpdated: string
  imageLink?: string;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rooms, setRooms] = useState<Room[]>([])
  const [error, setError] = useState<string | null>(null)

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
    imageLink: "",
  })

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editedRoomData, setEditedRoomData] = useState<Partial<Room>>({});

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  useEffect(() => {
    const role = getUserRole();
    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    const loadRooms = async () => {
      try {
        const data = await fetchRooms()
        setRooms(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false)
      }
    }

    loadRooms()
  }, [])

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
          r._id === room._id ? { ...r, status: newStatus as Room["status"], lastUpdated: new Date().toISOString() } : r,
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
        _id: Date.now().toString(),
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
        imageLink: "",
      })
      setShowAddForm(false)
      showAlert(`Room ${room.roomNumber} added successfully`, "success")
    } catch (error) {
      showAlert("Failed to add room. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setEditedRoomData({ ...room }); // Pre-fill with current room data
    setShowEditForm(true);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const handleEditChange = (key: keyof Room, value: any) => {
    setEditedRoomData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    setIsLoading(true);
    try {
      const response = await default_api.updateRoom(editingRoom._id, editedRoomData);
      showAlert(`Room ${editingRoom.roomNumber} updated successfully!`, "success");
      setShowEditForm(false);
      setEditingRoom(null);
      setEditedRoomData({});
      // Refresh rooms after update
      const updatedRooms = await default_api.fetchRooms();
      setRooms(updatedRooms);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update room');
      showAlert('Failed to update room. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    setIsLoading(true);
    try {
      await default_api.deleteRoom(roomToDelete._id);
      showAlert(`Room ${roomToDelete.roomNumber} deleted successfully!`, "success");
      setShowDeleteConfirm(false);
      setRoomToDelete(null);
      // Refresh rooms after delete
      const updatedRooms = await default_api.fetchRooms();
      setRooms(updatedRooms);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
      showAlert('Failed to delete room. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary">Available</Badge>
      case "occupied":
        return <Badge variant="destructive">Occupied</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Maintenance</Badge>
      case "cleaning":
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Cleaning</Badge>
      case "out-of-order":
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Out of Order</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
              type="search"
              placeholder="Search rooms..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" /> Filters
                </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Room
            </Button>
          )}
        </header>

            {showFilters && (
          <Card className="p-4 mb-4">
            <h4 className="font-semibold mb-2">Filter Rooms</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filterType">Room Type</Label>
                    <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
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
              <div>
                <Label htmlFor="filterStatus">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {ROOM_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                        {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              <div>
                <Label htmlFor="filterFloor">Floor</Label>
                <Input type="text" value={filters.floor} onChange={(e) => handleFilterChange("floor", e.target.value)} placeholder="Filter by floor" />
                  </div>
              <div>
                <Label htmlFor="minPrice">Min Price</Label>
                <Input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} placeholder="Min price" />
                  </div>
              <div>
                <Label htmlFor="maxPrice">Max Price</Label>
                <Input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} placeholder="Max price" />
                  </div>
                </div>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
          </Card>
        )}

        {alert && (
          <Alert variant={alert.type === "success" ? "default" : "destructive"}>
            {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-10">Loading rooms...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
            {paginatedRooms.map((room) => (
              <Card key={room._id} className="flex flex-col">
                {room.imageLink && (
                  <img src={room.imageLink} alt={`Room ${room.roomNumber}`} className="w-full h-48 object-cover rounded-t-lg" />
                )}
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">Room {room.roomNumber}</h3>
                      <p className="text-lg font-semibold text-primary">{room.price} CFA <span className="text-sm font-normal text-muted-foreground">per night</span></p>
                </div>
                    <p className="text-sm text-muted-foreground mb-4">{room.type}</p>
                    <p className="text-sm mb-2"><strong>Amenities:</strong> {room.amenities.slice(0, 3).join(', ')}{room.amenities.length > 3 ? '...' : ''}</p>
              </div>
                  <Link href={`/rooms/${room.roomNumber}`} passHref>
                    <Button className="w-full mt-4">View Details</Button>
                  </Link>
                  {isAdmin && (
                    <div className="flex justify-end gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(room)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(room)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
              <Button
                variant="outline"
                size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
              >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
              <Button
                variant="outline"
                size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
              >
            Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>Fill in the details for the new room.</DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
                <Input id="roomNumber" value={newRoom.roomNumber} onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} className="col-span-3" />
            </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select value={newRoom.type} onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Type" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="floor" className="text-right">Floor</Label>
                <Input id="floor" type="number" value={newRoom.floor} onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} className="col-span-3" />
            </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="view" className="text-right">View</Label>
                <Select value={newRoom.view} onValueChange={(value) => setNewRoom({ ...newRoom, view: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select View" />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input id="price" type="number" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">Amenities</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={newRoom.amenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          setNewRoom((prev) => ({
                            ...prev,
                            amenities: checked
                              ? [...prev.amenities, amenity]
                              : prev.amenities.filter((a) => a !== amenity),
                          }))
                        }}
                      />
                      <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
              <Button onClick={handleAddRoom} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        <Dialog open={selectedRoom !== null} onOpenChange={() => setSelectedRoom(null)}>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Update Room Status</DialogTitle>
              <DialogDescription>Update the status of Room {selectedRoom?.roomNumber}.</DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select value={selectedRoom?.status} onValueChange={(value) => selectedRoom && handleStatusUpdate(selectedRoom, value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
              {ROOM_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          <DialogFooter>
              <Button onClick={() => selectedRoom && handleStatusUpdate(selectedRoom, selectedRoom.status)} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the details of the room.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
              <Input id="roomNumber" value={editingRoom?.roomNumber} onChange={(e) => handleEditChange("roomNumber", e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={editingRoom?.type} onValueChange={(value) => handleEditChange("type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Type" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">Floor</Label>
              <Input id="floor" type="number" value={editingRoom?.floor} onChange={(e) => handleEditChange("floor", Number.parseInt(e.target.value))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="view" className="text-right">View</Label>
              <Select value={editingRoom?.view} onValueChange={(value) => handleEditChange("view", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select View" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" type="number" value={editingRoom?.price} onChange={(e) => handleEditChange("price", Number.parseFloat(e.target.value))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Amenities</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={editingRoom?.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        handleEditChange("amenities", checked ? [...editingRoom?.amenities || [], amenity] : editingRoom?.amenities.filter((a) => a !== amenity) || [])
                      }}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateRoom} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this room?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleConfirmDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
