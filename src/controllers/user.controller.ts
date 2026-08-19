import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { AuthRequest } from "../middleware/auth";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body);
    return res.status(201).json({ message: "تم إنشاء المستخدم بنجاح", ...result });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const result = await userService.list(page, limit);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getById(id);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.update(req.user!.id, id, req.body);
    return res.status(200).json({ message: "تم تحديث المستخدم بنجاح", user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await userService.remove(req.user!.id, id);
    return res.status(200).json({ message: "تم حذف المستخدم بنجاح" });
  } catch (err) {
    next(err);
  }
};
