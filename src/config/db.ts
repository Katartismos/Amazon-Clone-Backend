import mongoose, { Connection } from "mongoose";
import { getProductModel, type ProductModelType } from "../models/Product.js";

async function connectCart() {
  try {
    await mongoose.connect(process.env.MONGO_CART_URI!);

    console.log('Cart database connected successfully');
  } catch (error) {
    console.error('Error connecting to cart:', error);
    process.exit(1);
  }
}

let productsDB: Connection | null = null;
let ProductModel: ProductModelType | null = null;

async function connectProducts() {
  try {
  // Use mongoose.createConnection() for the secondary DB (Products)
    productsDB = mongoose.createConnection(process.env.MONGO_PRODUCTS_URI!);
    
    productsDB.on('connected', () => {
      console.log('Products database connected successfully!');
      
      // Initialize the secondary model once the connection is established
      ProductModel = getProductModel(productsDB!);
      console.log('Product Model initialized.');
    });
    
    productsDB.on('error', (err) => {
      console.error('Error in Products DB connection:', err);
    });
  } catch (error) {
    console.error('Error connecting to products:', error);
  }
}

export const getSecondaryConnection = (): Connection => {
  if (!productsDB) {
    throw new Error('Secondary database connection not established!');
  }
  return productsDB;
};

export const getProductMongooseModel = (): ProductModelType => {
  if (!ProductModel) {
    throw new Error('Product Model not initialized. Check connection status.');
  }
  return ProductModel;
};

export const connectDB = async () => {
  await connectCart();

  await connectProducts();
};