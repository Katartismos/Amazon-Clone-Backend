import { Schema, model, Types } from "mongoose";

interface CartItem {
  id: string,
  quantity: number,
  deliveryOptionId: string
}

const cartItemSchema = new Schema<CartItem>({
  id: { type: String, required: true, unique: true, index: true },
  quantity: { type: Number, required: true },
  deliveryOptionId: { type: String, required: true }
}, {
  timestamps: true
});

const CartItemModel = model<CartItem>('CartItem', cartItemSchema);

export default CartItemModel;