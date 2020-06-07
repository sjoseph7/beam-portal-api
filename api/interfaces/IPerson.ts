import { Types, Document } from "mongoose";

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  coursesAsInstructor?: [Types.ObjectId];
  coursesAsStudent?: [Types.ObjectId];
  meetingsAsHost?: [Types.ObjectId];
  meetingsAsParticipant?: [Types.ObjectId];
}
