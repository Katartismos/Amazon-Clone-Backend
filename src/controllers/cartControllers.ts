import CartItemModel from "../models/CartItem.js";
import { Request, Response } from "express";

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await CartItemModel.find().sort({ createdAt: -1 });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await CartItemModel.findOne({ id: req.params.id });
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error in getCartItem controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { id, quantity, deliveryOptionId } = req.body;
    const newCartItem = new CartItemModel({
      id,
      quantity,
      deliveryOptionId
    });

    const savedItem = await newCartItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error in addToCart controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const updatedItem = await CartItemModel.findOneAndUpdate(
        { id: req.params.id }, 
        { $set: req.body }, 
        { new: true }     // This returns the updated document
    );

    if (!updatedItem) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: "Item successfully updated in cart!" });
  } catch (error) {
    console.error("Error in updateCartItem controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteFromCart = async (req: Request, res: Response) => {
  try {
    const deletedItem = await CartItemModel.findOneAndDelete({ id: req.params.id });
    if (!deletedItem) {
      return res.status(404).json({ message: "Item is not present in cart" });
    }
    res.status(200).json({ message: "Item successfully removed from cart!"});
  } catch (error) {
    console.error("Error in deleteFromCart controller:", error);
    res.status(500).json({ message: "Server Error" });
  }
};