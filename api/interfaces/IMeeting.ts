import { Types, Document } from "mongoose";

export interface IMeeting extends Document {
  startTime: Date;
  endTime: Date;
  host: Types.ObjectId;
  participants?: [Types.ObjectId];
  link: string;
}
