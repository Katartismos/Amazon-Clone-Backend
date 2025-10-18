import express from "express";
import { getCart, getCartItem, addToCart, updateCartItem, deleteFromCart } from "../controllers/cartControllers.js";

const router = express.Router();

router.get("/", getCart);
router.get("/:id", getCartItem);
router.post("/", addToCart);
router.patch("/:id", updateCartItem);
router.delete("/:id", deleteFromCart);

export default router;