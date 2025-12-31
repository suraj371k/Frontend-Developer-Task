import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";

//routes imports
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://frontend-developer-task-ten.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());


//routes
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

//database connection
connectDb();

const port = 5000;

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
