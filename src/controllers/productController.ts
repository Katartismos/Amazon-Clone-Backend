import { getProductMongooseModel, ensureProductsConnected } from "../config/db.js";
import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Ensure product DB is connected in serverless environments
    await ensureProductsConnected();

    let ProductModel;
    try {
      ProductModel = getProductMongooseModel();
    } catch (err) {
      console.warn('Products model not initialized after ensure:', err);
      return res.status(503).json({ message: 'Products database not available' });
    }

    const products = await ProductModel.find().sort({ createdAt: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProducts controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};