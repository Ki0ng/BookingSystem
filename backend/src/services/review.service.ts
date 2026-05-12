import { PrismaClient, ReviewStatus, Role } from '@prisma/client';
import { getIO } from '../config/socket.config';

const prisma = new PrismaClient();

export const reviewService = {
  getPlatformReviews: async (limit: number = 6) => {
    return prisma.review.findMany({
      where: {
        hotelId: null,
        status: 'APPROVED',
        isHidden: false,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
  },

  /**
   * Cập nhật trung bình cộng đánh giá và số lượng đánh giá cho khách sạn
   * Chỉ tính các review đã được APPROVED và không bị ẩn
   */
  updateHotelStats: async (hotelId: string, tx?: any) => {
    if (!hotelId) return; // Skip if it's a platform review
    const client = tx || prisma;
    const stats = await client.review.aggregate({
      where: {
        hotelId,
        status: 'APPROVED',
        isHidden: false,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    await client.hotel.update({
      where: { id: hotelId },
      data: {
        average_rating: stats._avg.rating || 0,
        review_count: stats._count.id || 0,
      },
    });
  },

  createReview: async (userId: string, data: { hotelId: string | null; rating: number; comment?: string }) => {
    // Check if user already reviewed this hotel
    if (data.hotelId) {
      const existing = await prisma.review.findUnique({
        where: {
          userId_hotelId: {
            userId,
            hotelId: data.hotelId,
          }
        }
      });

      if (existing) {
        throw new Error('You have already reviewed this hotel');
      }
    }

    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          userId,
          hotelId: data.hotelId,
          rating: data.rating,
          comment: data.comment,
          status: data.hotelId ? 'PENDING' : 'APPROVED', // Auto-approve platform reviews for convenience
        },
        include: {
          user: { select: { id: true, name: true, avatar: true } }
        }
      });

      // Emit socket event if it's a hotel review
      if (review.hotelId) {
        const hotel = await tx.hotel.findUnique({
          where: { id: review.hotelId },
          select: { ownerId: true }
        });
        if (hotel) {
          try {
            const io = getIO();
            io.to(`manager_${hotel.ownerId}`).emit('new_review', review);
            io.to(`hotel_${review.hotelId}`).emit('review_received', review);
          } catch (e) { /* ignore if io not init */ }
        }
      }

      return review;
    });
  },

  getHotelReviews: async (hotelId: string, query: any, user?: { id: string; role: Role }) => {
    try {
      const { page = 1, limit = 10, rating, status, search, sortBy = 'newest' } = query;
      const skip = (page - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};

      const isInternal = user && (user.role === 'ADMIN' || user.role === 'MANAGER');

      if (hotelId === 'all') {
        if (!isInternal) throw new Error('Unauthorized');
        if (user.role === 'MANAGER') {
          where.hotel = { ownerId: user.id };
        }
      } else if (hotelId) {
        where.hotelId = hotelId;
      }

      if (!isInternal) {
        if (user) {
          where.OR = [
            { status: 'APPROVED' as ReviewStatus, isHidden: false },
            { userId: user.id, status: 'PENDING' as ReviewStatus }
          ];
        } else {
          where.status = 'APPROVED' as ReviewStatus;
          where.isHidden = false;
        }
      } else if (status) {
        where.status = status as ReviewStatus;
      }

      if (search) {
        where.OR = [
          { comment: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (rating) {
        where.rating = Number(rating);
      }

      // Sorting
      let orderBy: any = { createdAt: 'desc' };
      if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };
      if (sortBy === 'rating_desc') orderBy = { rating: 'desc' };
      if (sortBy === 'rating_asc') orderBy = { rating: 'asc' };


    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          },
          replies: {
            include: {
              manager: {
                select: { name: true, avatar: true }
              }
            }
          }
        },
        orderBy,
        skip,
        take,
      }),
      prisma.review.count({ where }),
    ]);

      return {
        reviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      console.error('Error in getHotelReviews service:', error);
      throw error;
    }
  },

  updateReview: async (id: string, userId: string, data: { rating?: number; comment?: string }) => {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review || review.userId !== userId) {
      throw new Error('Review not found or unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id },
        data: {
          ...data,
          status: 'PENDING', // Reset về PENDING khi có thay đổi nội dung
        },
      });

      // Cập nhật lại stats khách sạn nếu review cũ đã từng là APPROVED
      if (review.status === 'APPROVED' && review.hotelId) {
        await reviewService.updateHotelStats(review.hotelId, tx);
      }

      return updated;
    });
  },

  updateReviewStatus: async (id: string, managerId: string, status: ReviewStatus, role: Role) => {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { hotel: true }
    });

    if (!review) throw new Error('Review not found');

    // Auth check: Admin can do anything, Manager only for their hotels
    if (role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== managerId)) {
      throw new Error('Unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id },
        data: { status },
        include: { user: true }
      });

      // Cập nhật stats khách sạn nếu là review cho hotel
      if (review.hotelId) {
        await reviewService.updateHotelStats(review.hotelId, tx);
        
        try {
          const io = getIO();
          // Notify guest that their review status changed
          io.to(`user_${updated.userId}`).emit('review_status_updated', updated);
          // Notify all guests on the hotel page
          io.to(`hotel_${review.hotelId}`).emit('review_updated', updated);
        } catch (e) {}
      }

      return updated;
    });
  },

  toggleReviewVisibility: async (id: string, managerId: string, isHidden: boolean, role: Role) => {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { hotel: true }
    });

    if (!review) throw new Error('Review not found');

    if (role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== managerId)) {
      throw new Error('Unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id },
        data: { isHidden },
      });

      // Cập nhật stats khách sạn nếu là review cho hotel
      if (review.hotelId) {
        await reviewService.updateHotelStats(review.hotelId, tx);
      }

      return updated;
    });
  },

  replyToReview: async (reviewId: string, managerId: string, message: string, role: Role) => {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { hotel: true }
    });

    if (!review) throw new Error('Review not found');

    if (role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== managerId)) {
      throw new Error('Unauthorized');
    }

    const reply = await prisma.reviewReply.create({
      data: {
        reviewId,
        managerId,
        message,
      }
    });

    try {
      const io = getIO();
      // Notify the specific guest that they got a reply
      io.to(`user_${review.userId}`).emit('review_replied', {
        ...reply,
        hotelName: review.hotel?.name
      });
      // Notify all guests viewing this hotel
      io.to(`hotel_${review.hotelId}`).emit('review_replied', reply);
    } catch (e) {}

    return reply;
  },

  deleteReview: async (id: string, userId: string, role: Role) => {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { hotel: true }
    });

    if (!review) throw new Error('Review not found');

    // Auth: User owns review OR Admin OR Hotel Manager
    const isOwner = review.userId === userId;
    const isManager = review.hotel && review.hotel.ownerId === userId;
    const isAdmin = role === 'ADMIN';

    if (!isOwner && !isManager && !isAdmin) {
      throw new Error('Unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } });
      
      if (review.status === 'APPROVED' && review.hotelId) {
        await reviewService.updateHotelStats(review.hotelId, tx);
      }

      if (review.hotelId) {
        try {
          const io = getIO();
          io.to(`hotel_${review.hotelId}`).emit('review_updated');
        } catch (e) {}
      }
    });
  },

  getManagerReviewStats: async (managerId: string, role: Role) => {
    const where: any = {};
    if (role !== 'ADMIN') {
      where.hotel = { ownerId: managerId };
    }

    const [total, pending, approved, ratingDistribution] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.count({ where: { ...where, status: 'PENDING' } }),
      prisma.review.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.review.groupBy({
        by: ['rating'],
        where,
        _count: { id: true },
      }),
    ]);

    // Average rating across all hotels of this manager
    const avgStats = await prisma.review.aggregate({
      where: { ...where, status: 'APPROVED' },
      _avg: { rating: true },
    });

    return {
      total,
      pending,
      approved,
      averageRating: avgStats._avg.rating || 0,
      distribution: ratingDistribution,
    };
  }
};
