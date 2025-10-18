import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 2000;

//Middleware
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/cart", cartRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
  });
});