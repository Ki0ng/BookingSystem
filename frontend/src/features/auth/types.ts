import { User } from '@/shared/types';

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ApplyManagerDTO {
  hotelName: string;
  hotelAddress: string;
  hotelDescription: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}
