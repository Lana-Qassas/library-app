import { z } from "zod";

export const createLibrarySchema = z.object({
  name: z.string().min(1, "اسم المكتبة مطلوب"),
  address: z.string().optional(),
});

export const updateLibrarySchema = z.object({
  name: z.string().min(1, "اسم المكتبة لا يمكن أن يكون فارغًا").optional(),
  address: z.string().optional(),
});