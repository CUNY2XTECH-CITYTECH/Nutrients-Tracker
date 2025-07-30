import express from "express";
import { createUser, checkCred} from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", checkCred);

export default router;