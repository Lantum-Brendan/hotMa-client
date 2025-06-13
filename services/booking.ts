import { Room } from "@/types/room"

export interface BookingCalculation {
  nights: number;
  subtotal: number;
  tax: number;
  total: number;
}

export const calculateBookingTotal = (
  room: Room,
  checkIn: string,
  checkOut: string
): BookingCalculation => {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const subtotal = room.price * nights
  const tax = Math.round(subtotal * 0.15) // 15% tax
  const total = subtotal + tax

  return {
    nights,
    subtotal,
    tax,
    total
  }
}

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()} FCFA`
} 