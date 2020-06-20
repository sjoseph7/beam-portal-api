import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { Course } from "../models/Course";
import geocoder from "../utils/geocoder";
import colors from "colors";
import path from "path";

// @desc    Get all courses
// @route   GET /api/v2/courses
// @access  Private
export const getCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.advancedResults) {
      return next(new ErrorResponse(`Server error`, 500));
    }
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get one course
// @route   GET /api/v2/course/:id
// @access  Private
export const getCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id);

    //No course found...
    if (!course) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    res.status(200).json({ success: true, data: course });
  }
);

// @desc    Create new course
// @route   POST /api/v2/course
// @access  Private
export const createCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create new course
    let newCourse = await Course.create(req.body);
    res.status(201).json({ success: true, data: newCourse });
  }
);

// @desc    Update one course
// @route   UPDATE /api/v2/courses/:id
// @access  Private
export const updateCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let course = await Course.findById(req.params.id);

    // No course found...
    if (!course) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is course author
    // if (course.author.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(`User is not authorized to update this resource`, 403)
    //   );
    // }

    // Update course
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: course });
  }
);

// @desc    Delete one course
// @route   DELETE /api/v2/courses/:id
// @access  Private
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id);

    // No course found...
    if (!course) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check if user is course author
    // if (course.author.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(`User is not authorized to delete this resource`, 403)
    //   );
    // }

    await course.remove();
    // !204 returns nothing, use 200 if you want a JSON response to parse
    res.status(200).json({ success: true, data: {} });
  }
);

// @desc    Get courses uploaded within a specified radius
// @route   GET /api/v2/courses/radius/:zipcode/:distance/:unit
// @access  Private
export const getCoursesInRadius = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { zipcode, distance, units } = req.params;

    // Get lat & lng
    const loc = await geocoder.geocode(zipcode);
    const { latitude: lat, longitude: lng } = loc[0];

    // Calc radius using radians
    // Divide dist by radius of Earth (3,963 mi || 6378.1 km)
    const radius = parseFloat(distance) / (units === "km" ? 6378.1 : 3963);
    const courses = await Course.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  }
);

// @desc    Upload course photo
// @route   PUT /api/v2/courses/:id/photo
// @access  Private
export const uploadPhoto = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.params.id);

    // No course found...
    if (!course) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // !Check if user is course author
    // if (course.author.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(`User is not authorized to update this resource`, 403)
    //   );
    // }

    if (!req.files) {
      return next(new ErrorResponse(`No file uploaded`, 400));
    }

    // Get file
    const file = Array.isArray(req.files.file)
      ? req.files.file[0] // Select only one file if more than one is provided
      : req.files.file; // Otherwise, use the file provided

    // Make sure image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`file must be an image`, 400));
    }

    // Check file size
    if (file.size > ((process.env.MAX_FILE_UPLOAD || 1000000) as number)) {
      return next(
        new ErrorResponse(
          `image must be smaller than ${process.env.MAX_FILE_UPLOAD} bytes`,
          400
        )
      );
    }

    // Change photo filename
    file.name = `${course._id}_course_photo${path.parse(file.name).ext}`;

    // Upload file
    try {
      await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);
      await Course.findByIdAndUpdate(req.params.id, {
        photo: file.name
      });
      res.status(200).json({ success: true, data: file.name });
    } catch (err) {
      console.error();
      return next(new ErrorResponse(`Unable to upload file`, 500));
    }
  }
);
