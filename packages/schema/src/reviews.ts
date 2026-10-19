import { z } from "zod";

export const reviewSchema = z.strictObject({
  id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1),
  author: z.string().min(1),
  source: z.enum(["sample", "owner"]),
});

export const reviewsSchema = z.array(reviewSchema).default([]);
