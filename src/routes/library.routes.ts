import { Router } from "express";
import { createLibrary, getLibraries } from "../controllers/library.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createLibrary);
router.get("/", auth, getLibraries);

export default router;
