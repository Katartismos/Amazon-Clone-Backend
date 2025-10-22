import mongoose, { Connection } from "mongoose";
import { getProductModel, type ProductModelType } from "../models/Product.js";

/**
 * Single primary mongoose connection for Cart DB (default mongoose connection)
 * and a separate connection for Products (using createConnection).
 */
let productsDB: Connection | null = null;
let ProductModel: ProductModelType | null = null;
let productsConnectPromise: Promise<void> | null = null;

async function connectCart(): Promise<void> {
  const uri = process.env.MONGO_CART_URI;
  if (!uri) {
    console.error('MONGO_CART_URI not set');
    process.exit(1);
  }

  try {
    // Use mongoose.connect for the default connection
    await mongoose.connect(uri);
    console.log('Cart database connected successfully');
  } catch (error) {
    console.error('Error connecting to cart:', error);
    process.exit(1);
  }
}

async function connectProducts(): Promise<void> {
  const uri = process.env.MONGO_PRODUCTS_URI;
  if (!uri) {
    console.warn('MONGO_PRODUCTS_URI not set — products DB will not be available');
    return;
  }

  try {
    // createConnection returns a Connection immediately; wait for 'open' event to ensure ready
    // create the connection and wait for it to open
    productsDB = mongoose.createConnection();

    await new Promise<void>((resolve, reject) => {
      if (!productsDB) return reject(new Error('Failed to create products connection'));

      productsDB.once('open', () => {
        try {
          ProductModel = getProductModel(productsDB!);
          console.log('Products database connected and Product model initialized');
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      productsDB.on('error', (err) => {
        console.error('Products DB connection error:', err);
        reject(err);
      });

      // start opening the connection
      productsDB.openUri(uri).catch((err) => {
        // openUri errors will be forwarded to the 'error' listener above, but ensure rejection
        console.error('productsDB.openUri error', err);
      });
    });
  } catch (error) {
    console.error('Error connecting to products:', error);
    // don't exit process — products are optional depending on env
  }
}

/**
 * Ensure the products DB is connected; memoizes the promise so multiple callers wait for the same attempt.
 */
export async function ensureProductsConnected(): Promise<void> {
  if (ProductModel) return;
  if (productsConnectPromise) return productsConnectPromise;

  productsConnectPromise = (async () => {
    try {
      await connectProducts();
    } catch (err) {
      // keep the promise but do not throw here — caller can decide how to handle
      console.error('ensureProductsConnected error:', err);
    }
  })();

  return productsConnectPromise;
}

export const getSecondaryConnection = (): Connection => {
  if (!productsDB) throw new Error('Secondary database connection not established');
  return productsDB;
};

export const getProductMongooseModel = (): ProductModelType => {
  if (!ProductModel) throw new Error('Product Model not initialized');
  return ProductModel;
};

export const connectDB = async (): Promise<void> => {
  await connectCart();
  await connectProducts();
};