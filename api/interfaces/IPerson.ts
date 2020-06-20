import { Types, Document } from "mongoose";

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  username?: string;
  type?: string;
  regions: [Types.ObjectId];
  coursesAsInstructor?: [Types.ObjectId];
  coursesAsStudent?: [Types.ObjectId];
  scheduleItemsAsHost?: [Types.ObjectId];
  scheduleItemsAsParticipant?: [Types.ObjectId];
}
