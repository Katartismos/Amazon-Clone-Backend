import { getProductMongooseModel } from "../config/db.js";
import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const ProductModel = getProductMongooseModel();
    const products = await ProductModel.find().sort({ createdAt: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProducts controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};