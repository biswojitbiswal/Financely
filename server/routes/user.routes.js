import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import {registerUser, loginUser, getCurrUser, authnticateWithGoogle} from '../controller/user.controller.js'

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/getuser").get(authVerify, getCurrUser);
router.route("/google").post(authnticateWithGoogle);

export default router;