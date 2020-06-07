/**
 * Seeder
 *
 * This file can Create and Delete documents in a database
 */

// Configure environment variables
require("dotenv").config();

import fs from "fs";
import mongoose from "mongoose";
import colors from "colors";
import { connectDB } from "./api/utils/db";
import { Person } from "./api/models/Person";
import { Course } from "./api/models/Course";
import { Meeting } from "./api/models/Meeting";
import { User } from "./api/models/User";

// import colors from "colors"

// Connect to Mongo Database
connectDB(process.env.MONGO_URI || "");

// Read data from JSON files
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/courses.json`, `utf-8`)
);
const people = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/people.json`, `utf-8`)
);
const meetings = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/meetings.json`, `utf-8`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/users.json`, `utf-8`)
);

// Import data into database
const importData = async (options?: { exit: boolean }) => {
  try {
    await Person.create(people);
    await Course.create(courses);
    await Meeting.create(meetings);
    await User.create(users);
    console.log("Data imported"); //.green)//.inverse);
    if (options && options.exit === false) {
      return;
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

// Delete data from database
const deleteData = async (options?: { exit: boolean }) => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("Data deleted"); //.red.inverse);
    if (options && options.exit === false) {
      return;
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

const resetData = async () => {
  try {
    await deleteData({ exit: false });
    await importData({ exit: false });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importData({ exit: true });
} else if (process.argv[2] === "-d") {
  deleteData({ exit: true });
} else if (process.argv[2] === "-r") {
  resetData();
} else {
  resetData();
  console.log("No flag set - resetting data");
}
