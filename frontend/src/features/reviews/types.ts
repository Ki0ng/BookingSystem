export interface ReviewInput {
  hotelId?: string | null; // null for platform reviews
  rating: number;
  comment?: string;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  averageRating: number;
  distribution: { rating: number; _count: { id: number } }[];
}

export interface ReviewQueryParams {
  sortBy?: string;
  rating?: number;
  limit?: number;
  page?: number;
  status?: string;
  search?: string;
}
