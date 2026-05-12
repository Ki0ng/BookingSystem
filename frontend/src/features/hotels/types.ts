export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface HotelQueryParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  flexibility?: number;
  limit?: number;
}

export interface CreateHotelData {
  name: string;
  address: string;
  description: string;
  images: string[];
  amenities: string[];
  location_lat?: number;
  location_lng?: number;
}

export interface CreateRoomData {
  hotelId: string;
  room_type: string;
  base_price: number;
  quantity: number;
  capacity: number;
  images: string[];
}
