import { Router } from "express";
import { getLoginPage, getSignupPage, postLoginPage, postLogout, postSignupPage } from "../controllers/auth.controller.js";

const router = Router();

router.route("/login").get(getLoginPage).post(postLoginPage);
router.route("/signup").get(getSignupPage).post(postSignupPage);
router.route("/logout").get(postLogout);

export default router;