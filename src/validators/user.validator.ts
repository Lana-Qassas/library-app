import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "الاسم لا يمكن أن يكون فارغًا").optional(),
  email: z.string().email("البريد الإلكتروني غير صالح").optional(),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل").optional(),
});