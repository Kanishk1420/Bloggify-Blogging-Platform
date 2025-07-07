import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import { connectDB } from "./data/data.js";
import auth from "./routes/auth.js";
import commetRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import followRoutes from "./routes/followRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
// CORS
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
config({
  path: ".env",
});

connectDB();

app.use("/api/auth", auth);
app.use("/api/user", userRoutes);
app.use("/api/alluser", followRoutes);
app.use("/api/comment", commetRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});
