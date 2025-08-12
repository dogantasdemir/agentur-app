import { z } from "zod";

export const requestCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  deadline: z.string().datetime().optional(), // ISO
});

export const commentCreateSchema = z.object({
  requestId: z.string().min(1),
  body: z.string().min(1).max(5000),
});
