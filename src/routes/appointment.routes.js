import { Router } from "express";
import { showAppointment, postAppointment, showMyAppointments } from "../controllers/appointment.controller.js";

const router = Router();

router.route("/appoint").get(showAppointment).post(postAppointment);
router.route("/appointments").get(showMyAppointments);

export default router;