import prisma from '../config/db.config';
import { ReviewStatus, Role } from '@prisma/client';
import { socketService } from './socket.service';
import { ReviewRepository } from '../repositories/review.repository';
import { HotelRepository } from '../repositories/hotel.repository';

export class ReviewService {
  private readonly reviewRepository = new ReviewRepository();
  private readonly hotelRepository = new HotelRepository();

  getPlatformReviews = async (limit: number = 6) => this.reviewRepository.findPlatformReviews(limit);

  updateHotelStats = async (hotelId: string, transactionClient?: any) => {
    if (!hotelId) return;
    const aggregatedReviewStats = await this.reviewRepository.aggregateHotelStats(hotelId, transactionClient);
    await this.reviewRepository.updateHotelStats(hotelId, aggregatedReviewStats._avg.rating || 0, aggregatedReviewStats._count.id || 0, transactionClient);
  };

  createReview = async (userId: string, reviewData: { hotelId: string | null; rating: number; comment?: string }) => {
    if (reviewData.hotelId) {
      if (await this.reviewRepository.findUniqueByUserAndHotel(userId, reviewData.hotelId)) throw new Error('Already reviewed');
    }

    return await prisma.$transaction(async (transactionClient) => {
      const review = await this.reviewRepository.create({ userId, hotelId: reviewData.hotelId, rating: reviewData.rating, comment: reviewData.comment, status: reviewData.hotelId ? 'PENDING' : 'APPROVED' }, transactionClient);
      if (review.hotelId) {
        const hotel = await this.hotelRepository.findById(review.hotelId);
        if (hotel) {
          socketService.emitToManager(hotel.ownerId, 'new_review', review);
          socketService.emitToHotelRoom(review.hotelId, 'review_received', review);
        }
      }
      return review;
    });
  };

  getHotelReviews = async (hotelId: string, filterOptions: any, user?: { id: string; role: Role }) => {
    const { page = 1, limit = 10, sortBy = 'newest' } = filterOptions;
    const skip = (page - 1) * Number(limit);
    const [reviews, totalReviewsCount] = await this.reviewRepository.findMany(this.buildFilters(hotelId, filterOptions, user?.id, user?.role), skip, Number(limit), this.buildSort(sortBy));
    return { reviews, pagination: { total: totalReviewsCount, page, limit, pages: Math.ceil(totalReviewsCount / Number(limit)) } };
  };

  private buildFilters = (hotelId: string, filterOptions: any, userId?: string, role?: Role) => {
    const { rating, status, search } = filterOptions;
    const filterCriteria: any = {};
    const isInternal = role === 'ADMIN' || role === 'MANAGER';
    if (hotelId === 'all') {
      if (!isInternal) throw new Error('Unauthorized');
      if (role === 'MANAGER' && userId) filterCriteria.hotel = { ownerId: userId };
    } else if (hotelId) filterCriteria.hotelId = hotelId;

    if (!isInternal) {
      if (userId) filterCriteria.OR = [{ status: 'APPROVED', isHidden: false }, { userId: userId, status: 'PENDING' }];
      else { filterCriteria.status = 'APPROVED'; filterCriteria.isHidden = false; }
    } else if (status) filterCriteria.status = status;
    if (search) filterCriteria.OR = [{ comment: { contains: search, mode: 'insensitive' } }];
    if (rating) filterCriteria.rating = Number(rating);
    return filterCriteria;
  };

  private buildSort = (sortBy: string) => {
    if (sortBy === 'oldest') return { createdAt: 'asc' };
    if (sortBy === 'rating_desc') return { rating: 'desc' };
    if (sortBy === 'rating_asc') return { rating: 'asc' };
    return { createdAt: 'desc' };
  };

  updateReview = async (reviewId: string, userId: string, reviewUpdates: any) => {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review || review.userId !== userId) throw new Error('Unauthorized');
    return await prisma.$transaction(async (transactionClient) => {
      const updatedReview = await this.reviewRepository.update(reviewId, { ...reviewUpdates, status: 'PENDING' }, transactionClient);
      if (review.status === 'APPROVED' && review.hotelId) await this.updateHotelStats(review.hotelId, transactionClient);
      return updatedReview;
    });
  };

  updateReviewStatus = async (reviewId: string, managerId: string, status: ReviewStatus, role: Role) => {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Not found');
    if (role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== managerId)) throw new Error('Unauthorized');

    return await prisma.$transaction(async (transactionClient) => {
      const updatedReview = await this.reviewRepository.update(reviewId, { status }, transactionClient);
      if (review.hotelId) {
        await this.updateHotelStats(review.hotelId, transactionClient);
        socketService.emitToUser(updatedReview.userId, 'review_status_updated', updatedReview);
        socketService.emitToHotelRoom(review.hotelId, 'review_updated', updatedReview);
      }
      return updatedReview;
    });
  };

  toggleReviewVisibility = async (reviewId: string, managerId: string, isHidden: boolean, role: Role) => {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Not found');
    if (role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== managerId)) throw new Error('Unauthorized');
    return await prisma.$transaction(async (transactionClient) => {
      const updatedReview = await this.reviewRepository.update(reviewId, { isHidden }, transactionClient);
      if (review.hotelId) await this.updateHotelStats(review.hotelId, transactionClient);
      return updatedReview;
    });
  };

  replyToReview = async (reviewId: string, managerId: string, message: string, role: Role) => {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Not found');
    if (role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== managerId)) throw new Error('Unauthorized');

    const reply = await this.reviewRepository.createReply({ reviewId, managerId, message });
    socketService.emitToUser(review.userId, 'review_replied', { ...reply, hotelName: review.hotel?.name });
    socketService.emitToHotelRoom(review.hotelId, 'review_replied', reply);
    return reply;
  };

  deleteReview = async (reviewId: string, userId: string, role: Role) => {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Not found');
    if (review.userId !== userId && role !== 'ADMIN' && (!review.hotel || review.hotel.ownerId !== userId)) throw new Error('Unauthorized');

    return await prisma.$transaction(async (transactionClient) => {
      await this.reviewRepository.delete(reviewId, transactionClient);
      if (review.status === 'APPROVED' && review.hotelId) await this.updateHotelStats(review.hotelId, transactionClient);
      if (review.hotelId) socketService.emitToHotelRoom(review.hotelId, 'review_updated', null);
    });
  };

  getManagerReviewStats = async (managerId: string, role: Role) => {
    const filterCriteria: any = {};
    if (role !== 'ADMIN') filterCriteria.hotel = { ownerId: managerId };
    return this.reviewRepository.getManagerStats(filterCriteria);
  };
}

export const reviewService = new ReviewService();
