import app from "../app.js";
import { createAppointment, getAllAppointments, getFormattedDateInfo, getUpCommingAppoints } from "../services/appointment.services.js";
import { getClinicById } from "../services/clinics.services.js";

const showAppointment = async (req, res) => {
    if (!req.user) return res.redirect('/auth/login');
    if (req.user.role == "clinic") return res.redirect('/');
    const clinicId = req.query.id;
    if (!clinicId) return res.redirect('/');
    const clinic = await getClinicById(clinicId);
    if (!clinic) return res.redirect('/');
    const clinicInfo = {
        _id: clinic._id.toString(),
        clinicName: clinic.clinicName,
        phone: clinic.phone,
        address: clinic.address,
        email: clinic.email
    }
    return res.render('bookAppointment.ejs', { user: req.user, clinic: clinicInfo });
}

const postAppointment = async (req, res) => {
    const form = req.body;

    const appointment = await createAppointment(form, req.user);

    return res.redirect('/appointments');
}

const showMyAppointments = async (req, res) => {
    if (!req.user) return res.redirect('/auth/login');
    if (req.user.role == "clinic") return res.redirect('/');

    const appoints = await getAllAppointments(req.user.id);

    const myAppoints = [];

    for (const appoint of appoints) {
        const clinic = await getClinicById(appoint.clinicID);

        myAppoints.push({
            _id: appoint._id.toString(),
            checkupType: appoint.checkupType,
            doctor: appoint.doctorId,
            appointmentDate: appoint.appointmentDate,
            appointmentTime: appoint.appointmentTime,
            time: appoint.appointmentDate + " " + appoint.appointmentTime,
            reason: appoint.reason || "No Reason",
            ui: getFormattedDateInfo(appoint.appointmentDate + " " + appoint.appointmentTime),
            completed: appoint.completed,
            status: appoint.status,
            clinic: clinic
        });
    }

    const completedAppoints = myAppoints.filter((apoint) => apoint.completed == true);

    const notCompleted = myAppoints.filter((apoint) => apoint.completed == false)

    const upComingAppoints = getUpCommingAppoints(notCompleted, "time");

    return res.render('myAppointments.ejs', { user: req.user, completedAppoints, upComingAppoints });
}


export {
    showAppointment,
    postAppointment,
    showMyAppointments
}