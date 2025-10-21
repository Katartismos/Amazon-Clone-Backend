import { Schema, Connection, Model } from "mongoose";

interface Product {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number
  };
  priceCents: number;
  keywords: string[];
  type?: string;
  sizeChartLink?: string;
}

const productSchema = new Schema<Product>({
  id: { type: String, required: true, unique: true, index: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  rating: {
    stars: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  priceCents: { type: Number, required: true },
  keywords: { type: [String], required: true },
  type: { type: String },
  sizeChartLink: { type: String }
});

export function getProductModel(connection: Connection): Model<Product> {
  return connection.model<Product>('Product', productSchema);
}

export type ProductModelType = Model<Product>;