import { User } from './common.types';

export interface ManagerApplication {
  id: string;
  userId: string;
  hotelName: string;
  hotelAddress: string;
  phone: string;
  businessLicense: string;
  experience?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: User;
}

export interface AdminStats {
  totalUsers: number;
  totalHotels: number;
  pendingApps: number;
  systemHealth: string;
}

export interface ManagerStats {
  totalHotels: number;
  averageRating: number;
  pendingReviews: number;
  revenue: number;
}
