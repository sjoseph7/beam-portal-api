import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { Meeting } from "../models/Meeting";

// @desc    Get all meetings
// @route   GET /api/v1/meetings
// @access  Public
export const getMeetings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.advancedResults) {
      return next(new ErrorResponse(`Server error`, 500));
    }
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get one meeting
// @route   GET /api/v1/meetings/:id
// @access  Public
export const getMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const meeting = await Meeting.findById(req.params.id);

    //No meeting found...
    if (!meeting) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    res.status(200).json({ success: true, data: meeting });
  }
);

// @desc    Create new meeting
// @route   POST /api/v1/meetings
// @access  Private
export const createMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create new meeting
    let newMeeting = await Meeting.create(req.body);
    res.status(201).json({ success: true, data: newMeeting });
  }
);

// @desc    Update one meeting
// @route   UPDATE /api/v1/meetings/:id
// @access  Private
export const updateMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let meeting = await Meeting.findById(req.params.id);

    // No meeting found...
    if (!meeting) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is meeting author
    // if (
    //   meeting.author.toString() !== req.user.id &&
    //   req.user.role !== "admin"
    // ) {
    //   return next(
    //     new ErrorResponse(`User is not authorized to update this resource`, 403)
    //   );
    // }

    // Update meeting
    meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: meeting });
  }
);

// @desc    Delete one meeting
// @route   DELETE /api/v1/meetings/:id
// @access  Private
export const deleteMeeting = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const meeting = await Meeting.findById(req.params.id);

    // No meeting found...
    if (!meeting) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is meeting author
    // if (
    //   meeting.author.toString() !== req.user.id &&
    //   req.user.role !== "admin"
    // ) {
    //   return next(
    //     new ErrorResponse(`User is not authorized to delete this resource`, 403)
    //   );
    // }

    await meeting.remove();
    // !204 returns nothing, use 200 if you want to return a JSON response
    res.status(200).json({ success: true, data: {} });
  }
);
