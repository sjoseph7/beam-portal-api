import { Types, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  instructor: Types.ObjectId; //? Can a course have multiple instructors?
  students: [Types.ObjectId];
}
