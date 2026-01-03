import { Router } from "express";
import { showDashboard, updateClinic, addClinicDoctor, deleteClinicDoctor, addDoctorTime, deleteDoctorTime, toggleClinicStatus, sendForApproval, approveAppointment, cancelAppointment, completeAppointment } from "../controllers/clinic.controller.js";

const router = Router();

router.route('/dashboard').get(showDashboard);
router.route('/update').post(updateClinic);
router.route('/doctor/add').post(addClinicDoctor);
router.route('/doctor/delete').post(deleteClinicDoctor);
router.route('/doctor/time').post(addDoctorTime);
router.route('/doctor/time/delete').post(deleteDoctorTime);
router.route('/status').post(toggleClinicStatus);
router.route('/approval').post(sendForApproval);
router.route('/appointment/approve').post(approveAppointment);
router.route('/appointment/cancel').post(cancelAppointment);
router.route('/appointment/complete').post(completeAppointment);

export default router;