import { Router } from "express";
import { showHomePage } from "../controllers/user.controller.js";

const router = Router();

router.get('/', showHomePage);

export default router;