import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv"; // Changed to import * as
import cors from "cors";

// Assuming connectDB, cartRoutes, and productRoutes are correctly defined and imported
import { connectDB } from "./config/db.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Initialize environment variables (dotenv is now outside the function)
dotenv.config();

// Initialize the Express Application
const app: Application = express();

// --- Vercel Adaptation: Removed PORT definition, startServer() function, and app.listen() ---

// --- Middleware ---
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://amazon-clone-by-karta.vercel.app" // Use process.env for origin
}));

// --- Database Connection ---
// For Vercel, we call the async function directly to ensure the connection
// happens when the serverless function cold-starts.
// Note: This needs to be wrapped or handled within the runtime. 
// A simple call here is usually sufficient for initial connection, 
// but for robustness in serverless, you might handle it on the first request.
// For now, keeping the simple call at the top level:
connectDB(); 

// --- Server home route ---
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

// --- Routes ---
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);

// --- Vercel requires the Express app instance to be exported ---
// THIS IS THE CRITICAL LINE:
export default app;
// You can remove the unused code blocks (try/catch and startServer function) 
// that were related to app.listen().
