import { BaseService } from '@/core/api/base-service';
import { ApiResponse, PlatformReview, Review } from '@/shared/types';
import { ReviewInput, ReviewStats, ReviewQueryParams } from '../types';

export class ReviewService extends BaseService {
  public async getPlatformReviews(limit: number = 3): Promise<ApiResponse<PlatformReview[]>> {
    return this.get('/reviews/platform', { params: { limit } });
  }

  public async getHotelReviews(hotelId: string, params?: ReviewQueryParams): Promise<ApiResponse<Review[]>> {
    return this.get(`/reviews/hotel/${hotelId}`, { params });
  }

  public async createReview(data: ReviewInput): Promise<ApiResponse<PlatformReview>> {
    return this.post('/reviews', data);
  }

  public async deleteReview(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/reviews/${id}`);
  }

  public async getStats(hotelId?: string): Promise<ApiResponse<ReviewStats>> {
    const endpoint = hotelId && hotelId !== 'all' ? `/reviews/stats/${hotelId}` : '/reviews/stats';
    return this.get(endpoint);
  }

  // Manager Actions
  public async updateStatus(id: string, status: string): Promise<ApiResponse<Review>> {
    return this.patch(`/reviews/${id}/status`, { status });
  }

  public async toggleVisibility(id: string, isHidden: boolean): Promise<ApiResponse<Review>> {
    return this.patch(`/reviews/${id}/visibility`, { isHidden });
  }

  public async replyToReview(id: string, message: string): Promise<ApiResponse<any>> {
    return this.post(`/reviews/${id}/reply`, { message });
  }
}

export const reviewService = new ReviewService();
