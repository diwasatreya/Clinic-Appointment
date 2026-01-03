import { Router } from "express";
import { showDashboard, approveClinicAction, declineClinicAction, banClinicAction, unbanClinicAction, deapproveClinicAction } from "../controllers/admin.controller.js";

const router = Router();

router.route('/dashboard').get(showDashboard);
router.route('/clinic/approve').post(approveClinicAction);
router.route('/clinic/decline').post(declineClinicAction);
router.route('/clinic/ban').post(banClinicAction);
router.route('/clinic/unban').post(unbanClinicAction);
router.route('/clinic/deapprove').post(deapproveClinicAction);

export default router;

