import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/errors";

export const authService = {
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new AppError("MISSING_FIELDS", 400, "البريد الإلكتروني وكلمة المرور مطلوبان");
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", 404, "المستخدم غير موجود");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("INVALID_CREDENTIALS", 401, "بيانات الدخول غير صحيحة");
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1h" });

    return { token };
  },
};
