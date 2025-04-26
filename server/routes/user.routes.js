import { Router } from "express";
import authVerify from "../middleware/auth.middleware.js";
import {registerUser, loginUser, getCurrUser, authnticateWithGoogle, resetPassword, changeUsername, profileImageUpdate} from '../controller/user.controller.js'
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/getuser").get(authVerify, getCurrUser);
router.route("/google").post(authnticateWithGoogle);

router.route("/profile/image").patch(
    authVerify,
    upload.fields([
        {
            name: 'profile',
            maxCount: 1,
        }
    ]),
    profileImageUpdate
);

router.route("/username").patch(authVerify, changeUsername);
router.route("/reset-password").patch(authVerify, resetPassword)

export default router;