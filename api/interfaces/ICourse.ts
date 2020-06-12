import { Types, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  instructors: [Types.ObjectId]; //? Can a course have multiple instructors? Yes.
  students?: [Types.ObjectId];
}
