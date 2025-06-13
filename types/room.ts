export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  floor: number;
  view: string;
  price: number;
  amenities: string[];
  imageLink?: string;
} 