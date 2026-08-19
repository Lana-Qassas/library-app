import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, updateUserSchema } from "../validators/user.validator";

const router = Router();

router.post("/", validate(registerSchema), createUser);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, validate(updateUserSchema), updateUser);
router.delete("/:id", auth, deleteUser);

export default router;