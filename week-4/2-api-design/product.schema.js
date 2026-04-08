import { z } from "zod";

export const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string(),
  brand: z.string(),
  stock: z.number(),
  rating: z.number(),
  isAvailable: z.boolean(),
});
