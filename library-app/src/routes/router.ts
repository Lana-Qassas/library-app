import { Router } from "express";
import userRoutes from "./user.routes";
import libraryRoutes from "./library.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/libraries", libraryRoutes);
router.use("/auth", authRoutes);

export default router;