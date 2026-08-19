import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/errors";

export const userService = {
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    if (!name || !email || !password) {
      throw new AppError("MISSING_FIELDS", 400, "جميع الحقول مطلوبة");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
      user = await userRepository.create({ name, email, password: hashedPassword });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new AppError("EMAIL_ALREADY_USED", 409, "البريد الإلكتروني مستخدم بالفعل");
      }
      throw error;
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1d" });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  },

  async list(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { users, total } = await userRepository.findMany(skip, limit);
    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", 404, "المستخدم غير موجود");
    }
    return user;
  },

  async update(requesterId: number, targetId: number, body: { name?: string; email?: string; password?: string }) {
    if (targetId !== requesterId) {
      throw new AppError("FORBIDDEN", 403, "لا تملك صلاحية تعديل هذا المستخدم");
    }

    const data: { name?: string; email?: string; password?: string } = {};
    if (body.name) data.name = body.name;
    if (body.email) data.email = body.email;
    if (body.password) data.password = await bcrypt.hash(body.password, 10);

    if (Object.keys(data).length === 0) {
      throw new AppError("NO_DATA", 400, "لا توجد بيانات لتحديثها");
    }

    try {
      return await userRepository.update(targetId, data);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new AppError("USER_NOT_FOUND", 404, "المستخدم غير موجود");
      }
      if (error.code === "P2002") {
        throw new AppError("EMAIL_ALREADY_USED", 409, "البريد الإلكتروني مستخدم بالفعل");
      }
      throw error;
    }
  },

  async remove(requesterId: number, targetId: number) {
    if (targetId !== requesterId) {
      throw new AppError("FORBIDDEN", 403, "لا تملك صلاحية حذف هذا المستخدم");
    }

    try {
      await userRepository.delete(targetId);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new AppError("USER_NOT_FOUND", 404, "المستخدم غير موجود");
      }
      throw error;
    }
  },
};
