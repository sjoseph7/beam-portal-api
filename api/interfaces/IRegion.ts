import { Types, Document } from "mongoose";

export interface IRegion extends Document {
  name: string;
  address?: string;
  siteContent: {
    title: string;
    subTitle: string;
    links: [
      {
        text?: string;
        type: string;
        url: string;
      }
    ];
  };
}
