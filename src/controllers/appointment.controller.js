import { createAppointment, getAllAppointments } from "../services/appointment.services.js";
import { getClinicById } from "../services/clinics.services.js";

const showAppointment = async (req, res) => {
    if (!req.user) return res.redirect('/auth/login');
    if (req.user.role == "clinic") return res.redirect('/');
    const clinicId = req.query.id;
    if (!clinicId) return res.redirect('/');
    const clinic = await getClinicById(clinicId);
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

    return res.redirect('/my-appoint');
}

const showMyAppointments = async (req, res) => {
    if (!req.user) return res.redirect('/auth/login');
    if (req.user.role == "clinic") return res.redirect('/');

    const appoints = await getAllAppointments(req.user.id);

    const myAppoints = [];

    for (const appoint of appoints) {
        const clinic = await getClinicById(appoint.clinicID);

        myAppoints.push({
            appointmentDate: appoint.appointmentDate,
            appointmentTime: appoint.appointmentTime,
            doctor: appoint.doctorId,
            checkupType: appoint.checkupType,
            clinic: clinic
        });
    }

    return res.render('myAppointments.ejs', { user: req.user, myAppoints });
}


export {
    showAppointment,
    postAppointment,
    showMyAppointments
}