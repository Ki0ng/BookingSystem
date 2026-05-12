import { User } from './common.types';

export interface HotelImage {
  url: string;
}

export interface HotelAmenity {
  name: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  description?: string;
  ownerId?: string;
  owner?: User;
  images: HotelImage[];
  amenities: HotelAmenity[];
  average_rating: number;
  review_count?: number;
  location_lat?: number;
  location_lng?: number;
  rooms?: Room[];
  _count?: {
    reviews: number;
    rooms: number;
  };
}

export interface Room {
  id: string;
  room_type: string;
  base_price: number;
  capacity: number;
  quantity: number;
  status: string;
  images?: HotelImage[];
  hotelId: string;
  hotel?: Hotel;
}
