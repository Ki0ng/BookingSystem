import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { asyncHandler } from '../utils/asyncHandler';
import { createReviewSchema, updateReviewSchema, replyReviewSchema, reviewQuerySchema } from '../validators/review.validator';

export const reviewController = {
  createReview: asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createReviewSchema.parse(req.body);
    const userId = (req.user as any).userId;

    const review = await reviewService.createReview(userId, {
      rating: validatedData.rating,
      comment: validatedData.comment,
      hotelId: validatedData.hotelId || null
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending moderation',
      data: review
    });
  }),

  getPlatformReviews: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 6;
    const reviews = await reviewService.getPlatformReviews(limit);
    res.json({ success: true, data: reviews });
  }),

  getHotelReviews: asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const validatedQuery = reviewQuerySchema.parse(req.query);
    const user = req.user ? { id: (req.user as any).userId, role: (req.user as any).role } : undefined;

    const result = await reviewService.getHotelReviews(hotelId, validatedQuery, user);

    res.json({
      success: true,
      data: result.reviews,
      pagination: result.pagination
    });
  }),

  updateReview: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = updateReviewSchema.parse(req.body);
    const userId = (req.user as any).userId;

    const review = await reviewService.updateReview(id, userId, validatedData);

    res.json({
      success: true,
      message: 'Review updated and returned to pending status',
      data: review
    });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const review = await reviewService.updateReviewStatus(id, managerId, status, role);

    res.json({
      success: true,
      message: `Review status updated to ${status}`,
      data: review
    });
  }),

  toggleVisibility: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isHidden } = req.body;
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const review = await reviewService.toggleReviewVisibility(id, managerId, isHidden, role);

    res.json({
      success: true,
      message: `Review visibility updated`,
      data: review
    });
  }),

  replyToReview: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { message } = replyReviewSchema.parse(req.body);
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const reply = await reviewService.replyToReview(id, managerId, message, role);

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: reply
    });
  }),

  deleteReview: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req.user as any).userId;
    const role = (req.user as any).role;

    await reviewService.deleteReview(id, userId, role);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  }),

  getStats: asyncHandler(async (req: Request, res: Response) => {
    const managerId = (req.user as any).userId;
    const role = (req.user as any).role;

    const stats = await reviewService.getManagerReviewStats(managerId, role);

    res.json({
      success: true,
      data: stats
    });
  })
};
