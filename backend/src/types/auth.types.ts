export interface UserResponse {
  userId: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: { value: string; verified?: boolean }[];
  photos?: { value: string }[];
  _json?: any;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  emailOrPhone: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ApplyManagerDTO {
  hotelName: string;
  hotelAddress: string;
  hotelDescription?: string;
  phone: string;
  businessLicense?: string;
}

export interface UpdateApplicationDTO {
  status: 'APPROVED' | 'REJECTED';
  adminComment?: string;
}
