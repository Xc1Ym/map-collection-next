import { z } from "zod";

const ratingSchema = z.number().min(0).max(5).multipleOf(0.5).optional().nullable();

const latLngFinite = z.number().finite();
const LAT_MIN = -90;
const LAT_MAX = 90;
const LNG_MIN = -180;
const LNG_MAX = 180;

export const businessCreateSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  latitude: latLngFinite.min(LAT_MIN).max(LAT_MAX),
  longitude: latLngFinite.min(LNG_MIN).max(LNG_MAX),
  visited: z.boolean().optional().default(false),
  rating: ratingSchema,
  description: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  website: z.string().max(255).optional().nullable(),
  tagIds: z.array(z.number().int().positive()).optional().default([]),
});

export const businessUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  latitude: latLngFinite.min(LAT_MIN).max(LAT_MAX).optional(),
  longitude: latLngFinite.min(LNG_MIN).max(LNG_MAX).optional(),
  visited: z.boolean().optional(),
  rating: ratingSchema,
  description: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  website: z.string().max(255).optional().nullable(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const tagCreateSchema = z.object({
  name: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "颜色格式必须为 #RRGGBB")
    .optional()
    .default("#3498db"),
});

export const tagUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "颜色格式必须为 #RRGGBB")
    .optional(),
});

export const searchSchema = z.object({
  q: z.string().min(1).max(100),
  city: z.string().max(50).optional().default(""),
});
