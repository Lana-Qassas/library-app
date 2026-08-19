import { Router } from "express";
import userRoutes from "./user.routes";
import libraryRoutes from "./library.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/libraries", libraryRoutes);

export default router;
