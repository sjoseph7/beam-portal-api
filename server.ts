require("dotenv").config(); // Setup Environment Variables in ".env" file
import express, { Express, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./middleware/error";
import fileUploader from "express-fileupload";
import { connectDB } from "./api/utils/db";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import announcements from "./routes/announcements";
import scheduleItem from "./routes/scheduleItem";
import courses from "./routes/courses";
import regions from "./routes/regions";
import people from "./routes/people";
import users from "./routes/users";
import auth from "./routes/auth";
import { Server } from "http";
import morgan from "morgan";
import helmet from "helmet";
// import xss from "xss-clean";
import cors from "cors";
import path from "path";
import hpp from "hpp";
import { getUserSsoUrl } from "./api/controllers/sso";
import { checkJwt } from "./middleware/jwtAuth";

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
  max: 1000
});
// app.set(`trust proxy`, 1); // Enable if behind a reverse proxy (e.g. Heroku, Bluemix)
app.use(limiter);

// Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes

// ==== API_v1 ==== //
// "docs" request
app.get("/api/v1/docs", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/docs/docs-v1.html`);
});

app.get("/api/v1/v2/migration", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/migration/v1$v2.html`);
});

// Catch-all deprecation error
app.all("/api/v1*", (req, res, next) => {
  res.status(301).json({
    success: false,
    error: {
      message: "api/v1 has been deprecated, please use api/v2 instead.",
      docs: "/api/v2/docs",
      migrationGuide: "/api/v1/v2/migration"
    }
  });
});

// ==== API_v2 ==== //
// "docs" request
app.get("/api/v2/docs", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/docs/docs-v2.html`);
});

app.get("/api/v2/v3/migration", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/migration/v2$v3.html`);
});

// Catch-all deprecation error
app.all("/api/v2*", (req, res, next) => {
  res.status(301).json({
    success: false,
    error: {
      message: "api/v2 has been deprecated, please use api/v3 instead.",
      docs: "/api/v3/docs",
      migrationGuide: "/api/v2/v3/migration"
    }
  });
});

// ==== API_v3 ==== //
app.use("/api/v3/schedule-items", scheduleItem);
app.use("/api/v3/announcements", announcements);
app.use("/api/v3/regions", regions);
app.use("/api/v3/people", people);

// Open-Learning SSO request
app.get("/api/v3/sso/open-learning", checkJwt, getUserSsoUrl);

// Error Handler
app.use(errorHandler);

// API_v3 docs
app.get("/api/v3/docs", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/docs/docs-v3.html`);
});

// "Home" request
app.get("/", (req: Request, res: Response) => {
  res.sendFile(`${process.cwd()}/public/index.html`);
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
