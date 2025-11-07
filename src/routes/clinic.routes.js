import { Router } from "express";
import { updateClinic } from "../controllers/clinic.controller.js";

const router = Router();

router.route('/update').post(updateClinic);

export default router;