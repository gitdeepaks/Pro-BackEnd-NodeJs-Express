import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
const app = express();

app.use(express.json());
app.use(express, urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/api/v1" / routes);

app.get("/", (_req, res) => {
  res.send("Hello there Deepak - API");
});

app.all("*", (res, _req) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  }); //Fallback function for wildcard routes
});

export default app;

// http://localhost:4000//api/v1/auth/login
// http://localhost:4000//api/v1/auth/logout
