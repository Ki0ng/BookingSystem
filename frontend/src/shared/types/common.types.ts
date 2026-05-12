export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  message: string;
}
