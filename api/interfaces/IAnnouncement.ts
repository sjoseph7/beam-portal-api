import { Types, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  message?: string;
  regions?: [Types.ObjectId];
  recipients?: [Types.ObjectId];
}
