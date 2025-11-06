import { Router } from "express";
import { showAppointment, postAppointment, showMyAppointments, postDelete } from "../controllers/appointment.controller.js";

const router = Router();

router.route("/appoint").get(showAppointment).post(postAppointment);
router.route("/appointments").get(showMyAppointments);
router.route('/appoint/delete').post(postDelete)

export default router;