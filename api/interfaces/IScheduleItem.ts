import { Types, Document } from "mongoose";

export interface IScheduleItem extends Document {
  name: string;
  _friendlyId: string;
  description?: string;
  note?: string; // used for info about 'optional' or 'required for a week'; maybe simplify with optional/required
  days: string;
  region: Types.ObjectId;
  startTime: {
    hour: number;
    minute: number;
  };
  endTime: {
    hour: number;
    minute: number;
  };
  startDate: string;
  endDate: string;
  altHost: string;
  hosts: [Types.ObjectId];
  participants?: [Types.ObjectId];
  links?: [
    {
      text?: string;
      type: string;
      url: string;
    }
  ];
}
