import prisma from '../config/db.config';
import { Review, Prisma, ReviewStatus } from '@prisma/client';

export class ReviewRepository {
  async findPlatformReviews(limit: number): Promise<any[]> {
    return prisma.review.findMany({
      where: {
        hotelId: null,
        status: 'APPROVED',
        isHidden: false,
      },
      include: {
        user: { select: { name: true, avatar: true } }
      },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      take: limit
    });
  }

  async aggregateHotelStats(hotelId: string, transactionClient?: Prisma.TransactionClient): Promise<any> {
    const client = transactionClient || prisma;
    return client.review.aggregate({
      where: {
        hotelId,
        status: 'APPROVED',
        isHidden: false,
      },
      _avg: { rating: true },
      _count: { id: true },
    });
  }

  async updateHotelStats(hotelId: string, avgRating: number, reviewCount: number, transactionClient?: Prisma.TransactionClient): Promise<void> {
    const client = transactionClient || prisma;
    await client.hotel.update({
      where: { id: hotelId },
      data: {
        average_rating: avgRating,
        review_count: reviewCount,
      },
    });
  }

  async findUniqueByUserAndHotel(userId: string, hotelId: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: {
        userId_hotelId: { userId, hotelId }
      }
    });
  }

  async findById(reviewId: string): Promise<any | null> {
    return prisma.review.findUnique({
      where: { id: reviewId },
      include: { hotel: true }
    });
  }

  async create(reviewData: Prisma.ReviewUncheckedCreateInput, transactionClient?: Prisma.TransactionClient): Promise<any> {
    const client = transactionClient || prisma;
    return client.review.create({
      data: reviewData,
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });
  }

  async findMany(filterCriteria: any, skip: number, take: number, orderBy: any): Promise<[any[], number]> {
    return Promise.all([
      prisma.review.findMany({
        where: filterCriteria,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          replies: {
            include: {
              manager: { select: { name: true, avatar: true } }
            }
          }
        },
        orderBy,
        skip,
        take,
      }),
      prisma.review.count({ where: filterCriteria }),
    ]);
  }

  async update(reviewId: string, reviewUpdateData: Prisma.ReviewUpdateInput, transactionClient?: Prisma.TransactionClient): Promise<any> {
    const client = transactionClient || prisma;
    return client.review.update({
      where: { id: reviewId },
      data: reviewUpdateData,
      include: { user: true }
    });
  }

  async createReply(replyData: Prisma.ReviewReplyUncheckedCreateInput): Promise<any> {
    return prisma.reviewReply.create({ data: replyData });
  }

  async delete(reviewId: string, transactionClient?: Prisma.TransactionClient): Promise<void> {
    const client = transactionClient || prisma;
    await client.review.delete({ where: { id: reviewId } });
  }

  async getManagerStats(filterCriteria: any): Promise<any> {
    const [total, pending, approved, ratingDistribution, avgStats] = await Promise.all([
      prisma.review.count({ where: filterCriteria }),
      prisma.review.count({ where: { ...filterCriteria, status: 'PENDING' } }),
      prisma.review.count({ where: { ...filterCriteria, status: 'APPROVED' } }),
      prisma.review.groupBy({
        by: ['rating'],
        where: filterCriteria,
        _count: { id: true },
      }),
      prisma.review.aggregate({
        where: { ...filterCriteria, status: 'APPROVED' },
        _avg: { rating: true },
      }),
    ]);

    return {
      total,
      pending,
      approved,
      averageRating: avgStats._avg.rating || 0,
      distribution: ratingDistribution,
    };
  }
}
