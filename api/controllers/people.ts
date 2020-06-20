import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { Person } from "../models/Person";
import { Region } from "../models/Region";

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
    // Check if (person requested === user making request)
    const userMakingRequest = req.user?.sub.split("|")[1];
    if (req.user && req.params.id === userMakingRequest) {
      await refreshProfileFromToken(req.user || {});
    }

    // Find person
    const person = await Person.findById(req.params.id);

    // If no person found...
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

async function refreshProfileFromToken(user: any) {
  const {
    "https://beammath.net/given_name": firstName,
    "https://beammath.net/family_name": lastName,
    "https://beammath.net/username": username,
    "https://beammath.net/role": type,
    "https://beammath.net/sites": regionNames
  } = user || {};

  // Get user ID
  const userMakingRequest = user?.sub.split("|")[1];
  if (!userMakingRequest) {
    return;
  }

  // Translate region names into _ids
  const regions = (await Region.find({ name: { $in: regionNames } })).map(
    region => region._id
  );

  // Create person
  const newPerson: any = {
    _id: userMakingRequest,
    firstName,
    lastName,
    username,
    type,
    regions
  };

  // Save to db (or update, they they already exist)
  await Person.updateOne({ _id: userMakingRequest }, newPerson, {
    upsert: true
  });
}
