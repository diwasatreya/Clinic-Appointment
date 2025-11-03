import { Router } from "express";
import { showHomePage, showTest } from "../controllers/user.controller.js";

const router = Router();

router.get('/', showHomePage);
router.get('/test', showTest);

export default router;