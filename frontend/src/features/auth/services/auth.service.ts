import { BaseService } from '@/core/api/base-service';
import { ApiResponse, User, ManagerApplication } from '@/shared/types';
import { ApplyManagerDTO, ResetPasswordDTO } from '../types';

export class AuthService extends BaseService {
  public async sendOTP(email: string): Promise<ApiResponse<void>> {
    return this.post('/auth/send-otp', { email });
  }

  public async verifyOTP(email: string, code: string): Promise<ApiResponse<User>> {
    return this.post('/auth/verify-otp', { email, code });
  }

  public async getProfile(): Promise<ApiResponse<User>> {
    return this.get('/auth/profile');
  }

  public async updateProfile(data: { name?: string; phone?: string; avatar?: string }): Promise<ApiResponse<void>> {
    return this.patch('/auth/profile', data);
  }

  public async logout(): Promise<ApiResponse<void>> {
    return this.post('/auth/logout');
  }

  public async applyManager(data: ApplyManagerDTO): Promise<ApiResponse<void>> {
    return this.post('/auth/apply-manager', data);
  }

  public async listApplications(status?: string): Promise<ApiResponse<ManagerApplication[]>> {
    return this.get('/auth/applications', { params: { status } });
  }

  public async updateApplicationStatus(id: string, data: { status: string; reason?: string }): Promise<ApiResponse<void>> {
    return this.patch(`/auth/applications/${id}`, data);
  }

  public getGoogleAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`;
  }

  public async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.post('/auth/forgot-password', { email });
  }

  public async resetPassword(data: ResetPasswordDTO): Promise<ApiResponse<void>> {
    return this.post('/auth/reset-password', data);
  }
}

export const authService = new AuthService();
