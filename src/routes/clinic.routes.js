import { Router } from "express";
import { updateClinic, addClinicDoctor, deleteClinicDoctor, addDoctorTime, deleteDoctorTime } from "../controllers/clinic.controller.js";

const router = Router();

router.route('/update').post(updateClinic);
router.route('/doctor/add').post(addClinicDoctor);
router.route('/doctor/delete').post(deleteClinicDoctor);
router.route('/doctor/time').post(addDoctorTime);
router.route('/doctor/time/delete').post(deleteDoctorTime);

export default router;