import { Router } from "express";
import {
  createLibrary,
  getLibraries,
  getLibraryById,
  updateLibrary,
  deleteLibrary,
} from "../controllers/library.controller";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createLibrarySchema, updateLibrarySchema } from "../validators/library.validator";

const router = Router();

router.post("/", auth, validate(createLibrarySchema), createLibrary);
router.get("/", auth, getLibraries);
router.get("/:id", auth, getLibraryById);
router.put("/:id", auth, validate(updateLibrarySchema), updateLibrary);
router.delete("/:id", auth, deleteLibrary);

export default router;