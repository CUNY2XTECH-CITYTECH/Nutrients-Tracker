import express from "express";
import { createUser } from "../Controllers/registerController.js";
import { userLogin } from "../Controllers/authController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { test } from "../Controllers/test.js";
import { refreshToken } from "../Controllers/refreshTokenController.js";
import { logout } from "../Controllers/logoutController.js";

const router = express.Router();

router.post("/register", createUser);     
router.post("/login", userLogin);         
router.get("/check", refreshToken);       

router.get("/test", verifyJWT, test);     

router.post("/logout", logout);           

export default router;
