import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json({ message: "تم تسجيل الدخول بنجاح", ...result });
  } catch (err) {
    next(err);
  }
};
