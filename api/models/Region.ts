/**
 * Mongoose "Region" Schema
 *
 * @desc This is the schema for a region.
 */

import { Schema, model, Types } from "mongoose";
import { IRegion } from "../interfaces/IRegion";

const _LinkSchema = new Schema({
  text: {
    type: String,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ["helpful", "need-help"],
    required: [true, "no link type specified"]
  },
  url: {
    type: String,
    trim: true,
    maxlength: [1000, "url cannot exceed 1000 characters"],
    required: [true, "no link url specified"]
  }
});

const _SiteContent = new Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [100, "title cannot exceed 100 characters"],
    required: [true, "no title provided"]
  },
  subTitle: {
    type: String,
    trim: true,
    maxlength: [500, "subtitle cannot exceed 500 characters"]
  },
  links: {
    _id: false,
    type: [_LinkSchema]
  }
});

const RegionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "name cannot exceed 100 characters"],
      required: [true, "no name provided"]
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "address cannot exceed 500 characters"]
    },
    siteContent: {
      _id: false,
      type: _SiteContent
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

export let Region = model<IRegion>("region", RegionSchema);
