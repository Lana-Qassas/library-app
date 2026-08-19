import { Response, NextFunction } from "express";
import { libraryService } from "../services/library.service";
import { AuthRequest } from "../middleware/auth";

export const createLibrary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const library = await libraryService.create(req.user!.id, req.body);
    return res.status(201).json({ message: "تم إضافة المكتبة بنجاح", library });
  } catch (err) {
    next(err);
  }
};

export const getLibraries = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const result = await libraryService.list(req.user!.id, page, limit);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getLibraryById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const library = await libraryService.getById(req.user!.id, id);
    return res.status(200).json(library);
  } catch (err) {
    next(err);
  }
};

export const updateLibrary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const library = await libraryService.update(req.user!.id, id, req.body);
    return res.status(200).json({ message: "تم تحديث المكتبة بنجاح", library });
  } catch (err) {
    next(err);
  }
};

export const deleteLibrary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await libraryService.remove(req.user!.id, id);
    return res.status(200).json({ message: "تم حذف المكتبة بنجاح" });
  } catch (err) {
    next(err);
  }
};
