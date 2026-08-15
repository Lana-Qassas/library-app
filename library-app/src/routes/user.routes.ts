import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", createUser);
router.get("/", auth, getUsers);
export default router;
