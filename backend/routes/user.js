import express from "express";
import { loginUser, register, verifyUser } from "../controllers/user.js";

const router = express.Router();

router.post('/user/register', register)
router.post('/user/verify', verifyUser)
router.post('/user/login', loginUser)

export default router;