import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { Person } from "../models/Person";

// @desc    Get all people
// @route   GET /api/v2/people
// @access  Public
export const getPeople = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.advancedResults) {
      return next(new ErrorResponse(`Server error`, 500));
    }
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get one person
// @route   GET /api/v2/person/:id
// @access  Public
export const getPerson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const person = await Person.findById(req.params.id);

    //No person found...
    if (!person) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    res.status(200).json({ success: true, data: person });
  }
);

// @desc    Create new person
// @route   POST /api/v2/person
// @access  Private
export const createPerson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check for other people (can only person a post or comment once! - unless admin)
    const otherPerson = await Person.findOne({
      author: req.user.id,
      parent: req.body.parent
    });
    if (otherPerson && req.user.role !== "admin") {
      console.info(otherPerson);
      return next(
        new ErrorResponse(
          `User has already has person`, // ${otherPerson.parentModel}`,
          400
        )
      );
    }
    // Create new person
    let newPerson = await Person.create(req.body);
    res.status(201).json({ success: true, data: newPerson });
  }
);

// @desc    Update one person
// @route   UPDATE /api/v2/people/:id
// @access  Private
export const updatePerson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let person = await Person.findById(req.params.id);

    // No person found...
    if (!person) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is person author
    // if (person.author.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(`User is not authorized to update this resource`, 403)
    //   );
    // }

    // Update person
    person = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: person });
  }
);

// @desc    Delete one person
// @route   DELETE /api/v2/people/:id
// @access  Private
export const deletePerson = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const person = await Person.findById(req.params.id);

    // No person found...
    if (!person) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is person author
    // if (person.author.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(`User is not authorized to delete this resource`, 403)
    //   );
    // }

    await person.remove();
    // !204 returns nothing, use 200 if you want a JSON response to parse
    res.status(200).json({ success: true, data: {} });
  }
);
