import { Room } from "@/types/room"
import { BookingCalculation } from "@/services/booking"

export interface BookingRequest {
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    guestCount: number;
    specialRequests?: string;
  };
  paymentDetails: {
    method: "mtn_momo";
    momoNumber: string;
    amount: number;
    currency: string;
  };
}

export interface BookingResponse {
  success: boolean;
  booking: {
    bookingNumber: string;
    room: {
      roomNumber: string;
      type: string;
    };
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    status: "pending" | "checked-in" | "checked-out" | "cancelled";
    paymentStatus: "pending" | "completed" | "failed";
    cancellationCode?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  try {
    // Calculate number of nights
    const checkIn = new Date(data.checkIn)
    const checkOut = new Date(data.checkOut)
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    // Ensure guest details are present with required fields
    const guestDetails = {
      firstName: data.guestDetails?.firstName || 'Anonymous',
      lastName: data.guestDetails?.lastName || 'Guest',
      email: data.guestDetails?.email || 'anonymous@guest.com',
      phone: data.guestDetails?.phone || 'N/A',
      guestCount: data.guestDetails?.guestCount || 1
    }

    const response = await fetch(`${API_URL}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        roomNumber: data.roomNumber,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: guestDetails.guestCount,
        paymentMethod: data.paymentDetails.method,
        guestDetails: guestDetails,
        paymentDetails: {
          method: data.paymentDetails.method,
          momoNumber: data.paymentDetails.momoNumber,
          amount: data.paymentDetails.amount,
          currency: data.paymentDetails.currency
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create booking')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export const getBooking = async (bookingId: string): Promise<BookingResponse> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch booking")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching booking:", error)
    throw error
  }
}

export const cancelBooking = async (bookingId: string, cancellationCode: string): Promise<BookingResponse> => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellationCode }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to cancel booking")
    }

    return await response.json()
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw error
  }
}

export const checkRoomAvailability = async (
  roomNumber: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; message?: string }> => {
  try {
    console.log('Checking availability for room:', roomNumber, 'from', checkIn, 'to', checkOut);
    const response = await fetch(
      `${API_URL}/rooms/${roomNumber}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to check room availability")
    }

    const availabilityData = await response.json()
    console.log('Room availability response:', availabilityData)
    return availabilityData
  } catch (error) {
    console.error("Error checking room availability:", error)
    throw error
  }
}

export const fetchBookings = async (): Promise<{ data: BookingResponse[] }> => {
  try {
    console.log('Fetching all bookings');
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token provided");
    }

    const response = await fetch(`${API_URL}/bookings`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch bookings");
    }

    const bookings = await response.json();
    console.log('Fetched bookings:', bookings);
    return { data: bookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

export const checkInBooking = async (bookingId: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token provided");
    }
    const response = await fetch(`${API_URL}/bookings/${bookingId}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to check-in booking");
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking in booking:", error);
    throw error;
  }
};

export const checkOutBooking = async (bookingId: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token provided");
    }
    const response = await fetch(`${API_URL}/bookings/${bookingId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to check-out booking");
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking out booking:", error);
    throw error;
  }
}; 