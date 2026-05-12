import { BaseService } from '@/core/api/base-service';
import { ApiResponse, Hotel, Room } from '@/shared/types';
import { HotelQueryParams, CreateHotelData, CreateRoomData } from '../types';

export class HotelService extends BaseService {
  public async getHotels(params?: HotelQueryParams): Promise<ApiResponse<Hotel[]>> {
    return this.get('/hotels', { params });
  }

  public async getHotelById(id: string): Promise<ApiResponse<Hotel>> {
    return this.get(`/hotels/${id}`);
  }

  public async createHotel(data: CreateHotelData): Promise<ApiResponse<Hotel>> {
    return this.post('/hotels', data);
  }

  public async updateHotel(id: string, data: Partial<CreateHotelData>): Promise<ApiResponse<Hotel>> {
    return this.patch(`/hotels/${id}`, data);
  }

  public async deleteHotel(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/hotels/${id}`);
  }

  public async getMyHotels(): Promise<ApiResponse<Hotel[]>> {
    return this.get('/hotels/my-hotels');
  }

  // Room Management
  public async getRoomsByHotelId(hotelId: string): Promise<ApiResponse<Room[]>> {
    return this.get(`/rooms/hotel/${hotelId}`);
  }

  public async createRoom(data: CreateRoomData): Promise<ApiResponse<Room>> {
    return this.post('/rooms', data);
  }

  public async deleteRoom(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/rooms/${id}`);
  }

  public async updateRoom(id: string, data: Partial<CreateRoomData>): Promise<ApiResponse<Room>> {
    return this.patch(`/rooms/${id}`, data);
  }
}

export const hotelService = new HotelService();
