import { Router } from "express";
import { showAppointment, postAppointment, showMyAppointments } from "../controllers/appointment.controller.js";

const router = Router();

router.route("/appoint").get(showAppointment).post(postAppointment);
router.route("/my-appoint").get(showMyAppointments);

export default router;