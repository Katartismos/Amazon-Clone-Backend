import mongoose from "mongoose";

async function connectCart() {
  try {
    await mongoose.connect(process.env.MONGO_CART_URI!);

    console.log('Cart database connected successfully');
  } catch (error) {
    console.error('Error connecting to cart:', error);
    process.exit(1);
  }
}

export const connectDB = async () => {
  await connectCart();
};