import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 2000;

async function startServer() {
  try {
    await connectDB();

    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: "https://amazon-clone-by-karta.vercel.app"
    }));

    // Server home route
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello, World!");
    });

    // Routes
    app.use("/api/cart", cartRoutes);
    app.use("/api/products", productRoutes);

    app.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();