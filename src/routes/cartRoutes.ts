import express from "express";
import { getCart, getCartItem, addToCart, updateCartItem, deleteFromCart } from "../controllers/cartControllers.js";

const cartRouter = express.Router();

cartRouter.get("/", getCart);
cartRouter.get("/:id", getCartItem);
cartRouter.post("/", addToCart);
cartRouter.patch("/:id", updateCartItem);
cartRouter.delete("/:id", deleteFromCart);

export default cartRouter;