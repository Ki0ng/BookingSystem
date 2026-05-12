export interface PlatformReview {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    avatar?: string;
  };
  createdAt?: string;
}

export interface ReviewReply {
  id: string;
  message: string;
  createdAt: string;
  manager: {
    name: string;
    avatar?: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isHidden: boolean;
  user: {
    name: string;
    avatar?: string;
  };
  replies: ReviewReply[];
}
