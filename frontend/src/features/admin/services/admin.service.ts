import { BaseService } from '@/core/api/base-service';
import { ApiResponse, Hotel, ManagerApplication, AdminStats } from '@/shared/types';

export class AdminService extends BaseService {
  public async getHotels(): Promise<ApiResponse<Hotel[]>> {
    return this.get('/admin/hotels');
  }

  public async getApplications(): Promise<ApiResponse<ManagerApplication[]>> {
    return this.get('/admin/applications');
  }

  public async approveApplication(id: string, adminComment?: string): Promise<ApiResponse<any>> {
    return this.patch(`/admin/applications/${id}`, { status: 'APPROVED', adminComment });
  }

  public async rejectApplication(id: string, adminComment?: string): Promise<ApiResponse<any>> {
    return this.patch(`/admin/applications/${id}`, { status: 'REJECTED', adminComment });
  }

  public async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.get('/admin/stats');
  }
}

export const adminService = new AdminService();
