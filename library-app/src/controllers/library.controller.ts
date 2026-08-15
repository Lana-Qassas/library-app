import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middleware/auth";

export const createLibrary = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "اسم المكتبة مطلوب" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const library = await prisma.library.create({
      data: {
        name,
        address,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      message: "تم إضافة المكتبة بنجاح",
      library,
    });
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ في الخادم", error });
  }
};

export const getLibraries = async (_req: AuthRequest, res: Response) => {
  try {
    const libraries = await prisma.library.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json(libraries);
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ في الخادم", error });
  }
};
