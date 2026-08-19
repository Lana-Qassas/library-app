import { Router } from "express";
import {
  createLibrary,
  getLibraries,
  getLibraryById,
  updateLibrary,
  deleteLibrary,
} from "../controllers/library.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createLibrary);
router.get("/", auth, getLibraries);
router.get("/:id", auth, getLibraryById);
router.put("/:id", auth, updateLibrary);
router.delete("/:id", auth, deleteLibrary);

export default router;
