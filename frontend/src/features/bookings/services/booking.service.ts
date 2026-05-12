import { BaseService } from '@/core/api/base-service';
import { ApiResponse, Booking } from '@/shared/types';
import { CreateBookingData } from '../types';

export class BookingService extends BaseService {
  public async createBooking(data: CreateBookingData): Promise<ApiResponse<Booking>> {
    return this.post('/bookings', data);
  }

  public async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    return this.get('/bookings/my');
  }

  public async getBookingDetail(id: string): Promise<ApiResponse<Booking>> {
    return this.get(`/bookings/${id}`);
  }

  public async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.patch(`/bookings/${id}/cancel`);
  }

  public async getManagerBookings(page: number = 1, limit: number = 10): Promise<ApiResponse<Booking[]> & { pagination?: any }> {
    return this.get(`/bookings/manager?page=${page}&limit=${limit}`);
  }
}

export const bookingService = new BookingService();
