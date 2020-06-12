import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { ScheduleItem } from "../models/ScheduleItem";

// @desc    Get all schedule-items
// @route   GET /api/v2/schedule-items
// @access  Public
export const getScheduleItems = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.advancedResults) {
      return next(new ErrorResponse(`Server error`, 500));
    }
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get one schedule-item
// @route   GET /api/v2/schedule-items/:id
// @access  Public
export const getScheduleItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const scheduleItem = await ScheduleItem.findById(req.params.id);

    //No schedule-item found...
    if (!scheduleItem) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    res.status(200).json({ success: true, data: scheduleItem });
  }
);

// @desc    Create new schedule-item
// @route   POST /api/v2/schedule-items
// @access  Private
export const createScheduleItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create new schedule-item
    let newScheduleItem = await ScheduleItem.create(req.body);
    res.status(201).json({ success: true, data: newScheduleItem });
  }
);

// @desc    Update one schedule-item
// @route   UPDATE /api/v2/schedule-items/:id
// @access  Private
export const updateScheduleItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let scheduleItem = await ScheduleItem.findById(req.params.id);

    // No schedule-item found...
    if (!scheduleItem) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is schedule-item author
    // if (
    //   schedule-item.author.toString() !== req.user.id &&
    //   req.user.role !== "admin"
    // ) {
    //   return next(
    //     new ErrorResponse(`User is not authorized to update this resource`, 403)
    //   );
    // }

    // Update schedule-item
    scheduleItem = await ScheduleItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    res.status(200).json({ success: true, data: scheduleItem });
  }
);

// @desc    Delete one schedule-item
// @route   DELETE /api/v2/schedule-items/:id
// @access  Private
export const deleteScheduleItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const scheduleItem = await ScheduleItem.findById(req.params.id);

    // No schedule-item found...
    if (!scheduleItem) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is scheduleItem author
    // if (
    //   scheduleItem.author.toString() !== req.user.id &&
    //   req.user.role !== "admin"
    // ) {
    //   return next(
    //     new ErrorResponse(`User is not authorized to delete this resource`, 403)
    //   );
    // }

    await scheduleItem.remove();
    // !204 returns nothing, use 200 if you want to return a JSON response
    res.status(200).json({ success: true, data: {} });
  }
);
