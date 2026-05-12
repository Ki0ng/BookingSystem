import { BaseService } from '@/core/api/base-service';
import { ApiResponse, AdminStats } from '@/shared/types';

export interface ManagerStats {
  totalHotels: number;
  averageRating: number;
  pendingReviews: number;
  revenue: number;
}

export class DashboardService extends BaseService {
  public async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    const [usersRes, hotelsRes, appsRes] = await Promise.all([
      this.api.get('/admin/users'),
      this.api.get('/admin/hotels'),
      this.api.get('/admin/applications')
    ]);

    return {
      success: true,
      message: 'Stats fetched successfully',
      data: {
        totalUsers: usersRes.data.data.length,
        totalHotels: hotelsRes.data.data.length,
        pendingApps: appsRes.data.data.length,
        systemHealth: 'Optimal'
      }
    };
  }

  public async getManagerStats(): Promise<ApiResponse<ManagerStats>> {
    const [hotelsRes, reviewsRes] = await Promise.all([
      this.api.get('/hotels/my-hotels'),
      this.api.get('/reviews/pending')
    ]);

    return {
      success: true,
      data: {
        totalHotels: hotelsRes.data.data.length,
        averageRating: 4.8, // Fallback or calculate
        pendingReviews: reviewsRes.data.data.length,
        revenue: 12500
      }
    };
  }
}

export const dashboardService = new DashboardService();
