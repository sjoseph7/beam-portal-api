require("dotenv").config(); // Setup Environment Variables in ".env" file
import express, { Express, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./middleware/error";
import fileUploader from "express-fileupload";
import { connectDB } from "./api/utils/db";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import meetings from "./routes/meetings";
import people from "./routes/people";
import courses from "./routes/courses";
import users from "./routes/users";
import auth from "./routes/auth";
import { Server } from "http";
import morgan from "morgan";
import helmet from "helmet";
// import xss from "xss-clean";
import cors from "cors";
import path from "path";
import hpp from "hpp";

// ^1
// Augment Express Request and Response Type definitions
declare global {
  namespace Express {
    export interface Request {
      // user?: Document;
      user?: any;
    }
    export interface Response {
      advancedResults?: any; // Configure as necessary
    }
  }
}

// MongoDB
connectDB(process.env.MONGO_URI || "");

// Setup Express
const app: Express = express();
const port: String | Number = process.env.PORT || 4000;
const server: Server = app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});

// Static folder
app.use(express.static(path.join(__dirname, "../public")));

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// File Uploader
app.use(fileUploader());

// Query Sanitizer
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Mitigate cross-site scripting attacks
// app.use(xss());

// Mitigate HTTP Parameter pollution
app.use(hpp());

// Enable CORS ( Cross-Origin Resource Sharing )
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000 * 100, // 100 minutes
  max: 100
});
// app.set(`trust proxy`, 1); // Enable if behind a reverse proxy (e.g. Heroku, Bluemix)
app.use(limiter);

// Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/meetings", meetings);
app.use("/api/v1/people", people);
app.use("/api/v1/courses", courses);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

// "Home" request
app.get("/", (req: Request, res: Response) => {
  res.send("BEAM Demo API");
});

// "docs" request
app.get("/docs", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/docs/index.html`);
});

// All other requests
app.all("*", (req: Request, res: Response) => {
  console.log(req.url);
  res.status(404).send({ success: false });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any, promise) => {
  console.error(`Error: ${err && err.message}`);
  server.close(() => process.exit(1));
});

export { server, app };
