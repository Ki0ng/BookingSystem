/**
 * Standard API Response format for all requests
 */
export interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
  pagination?: Pagination;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
