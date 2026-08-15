import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "تم إنشاء المستخدم بنجاح",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ في الخادم", error });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        libraries: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ في الخادم", error });
  }
};
