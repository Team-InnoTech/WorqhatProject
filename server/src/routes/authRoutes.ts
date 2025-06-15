import express from "express";
import { register, login, getProfile } from "../controller/authController";
import { verifyToken } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile); // protected route

export default router;
