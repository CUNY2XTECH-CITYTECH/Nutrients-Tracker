import express from "express";
import { createUser} from "../Controllers/registerController.js";
import {userLogin} from "../Controllers/authController.js"
import {verifyJWT} from "../Middleware/verifyJWT.js"
import { test } from "../Controllers/test.js";
import { refreshToken } from "../Controllers/refreshTokenController.js";
import { logout } from "../Controllers/logoutController.js";

const router = express.Router();



router.post("/register", createUser);
router.post("/login", userLogin);



router.get("/check", refreshToken) //after login, checks refreshtoken in cookies and gives a access token 

router.get("/test", verifyJWT, test) //in order to go to /test, middleware checks accesstoken. This means user need to login in first and send acess token to access api endpoint

router.get("/logout", logout) //deletes the refreshToken in user cookies and db


export default router;