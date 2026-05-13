import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { asyncHandler } from '../utils/asyncHandler';
import { createReviewSchema, updateReviewSchema, replyReviewSchema, reviewQuerySchema } from '../validators/review.validator';

export const reviewController = {
  createReview: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createReviewSchema.parse(req.body);
    const userId = (req.user as any).userId;

    const newReview = await reviewService.createReview(userId, {
      rating: validatedData.rating,
      comment: validatedData.comment,
      hotelId: validatedData.hotelId || null
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending moderation',
      data: newReview
    });
  }),

  getPlatformReviews: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;
    const platformReviews = await reviewService.getPlatformReviews(limit);
    res.json({ success: true, data: platformReviews });
  }),

  getHotelReviews: asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const validatedQuery = reviewQuerySchema.parse(req.query);
    const currentUser = req.user ? { id: (req.user as any).userId, role: (req.user as any).role } : undefined;

    const paginatedReviewsData = await reviewService.getHotelReviews(hotelId, validatedQuery, currentUser);

    res.json({
      success: true,
      data: paginatedReviewsData.reviews,
      pagination: paginatedReviewsData.pagination
    });
  }),

  updateReview: asyncHandler(async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const validatedData = updateReviewSchema.parse(req.body);
    const userId = (req.user as any).userId;

    const updatedReview = await reviewService.updateReview(reviewId, userId, validatedData);

    res.json({
      success: true,
      message: 'Review updated and returned to pending status',
      data: updatedReview
    });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const { status } = req.body;
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const moderatedReview = await reviewService.updateReviewStatus(reviewId, managerId, status, role);

    res.json({
      success: true,
      message: `Review status updated to ${status}`,
      data: moderatedReview
    });
  }),

  toggleVisibility: asyncHandler(async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const { isHidden } = req.body;
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const visibilityUpdatedReview = await reviewService.toggleReviewVisibility(reviewId, managerId, isHidden, role);

    res.json({
      success: true,
      message: `Review visibility updated`,
      data: visibilityUpdatedReview
    });
  }),

  replyToReview: asyncHandler(async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const { message } = replyReviewSchema.parse(req.body);
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const reviewReply = await reviewService.replyToReview(reviewId, managerId, message, role);

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: reviewReply
    });
  }),

  deleteReview: asyncHandler(async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const userId = (req.user as any).userId;
    const role = (req.user as any).role;

    await reviewService.deleteReview(reviewId, userId, role);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  }),

  getStats: asyncHandler(async (req: Request, res: Response) => {
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const reviewStatistics = await reviewService.getManagerReviewStats(managerId, role);

    res.json({
      success: true,
      data: reviewStatistics
    });
  })
};
