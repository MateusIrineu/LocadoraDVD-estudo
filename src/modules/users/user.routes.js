import UserController from "./user.controller.js";
import { authMiddleware as authenticate } from "../../middlewares/auth.middleware.js";

import express from "express"; 

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", authenticate, UserController.getProfile);
router.put("/update/:id", authenticate, UserController.updateUser);
router.delete("/delete/:id", authenticate, UserController.deleteUser);
router.get("/list", authenticate, UserController.listUsers);

export default router;