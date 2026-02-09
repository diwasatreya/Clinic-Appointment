import { createAppointment, getAllAppointments, getFormattedDateInfo, getUpCommingAppoints, deleteAppoint, getTimeSlotCount } from "../services/appointment.services.js";
import { getClinicById, getClinicDoctors } from "../services/clinics.services.js";

const checkTimeSlotAvailability = async (req, res) => {
    try {
        const { clinicId, doctorId, date } = req.query;

        if (!clinicId || !doctorId || !date) {
            return res.json({ error: 'Missing required parameters' });
        }

        const doctors = await getClinicDoctors(clinicId);
        const doctor = doctors.find(d => d._id.toString() === doctorId);

        if (!doctor || !doctor.time) {
            return res.json({ availability: {} });
        }

        const availability = {};

        for (const timeSlot of doctor.time) {
            const time = typeof timeSlot === 'string' ? timeSlot : timeSlot.time;
            const limit = typeof timeSlot === 'string' ? 10 : (timeSlot.limit || 10);

            const count = await getTimeSlotCount(clinicId, doctorId, date, time);
            availability[time] = {
                available: count < limit,
                count: count,
                limit: limit
            };
        }

        return res.json({ availability });
    } catch (error) {
        console.error(error);
        return res.json({ error: 'Failed to check availability' });
    }
};

const showAppointment = async (req, res) => {
    if (!req.user) return res.redirect('/auth/login');
    if (req.user.role == "clinic") return res.redirect('/');
    const clinicId = req.query.id;
    if (!clinicId) return res.redirect('/');
    const clinic = await getClinicById(clinicId);
    if (!clinic) return res.redirect('/');
    const doctors = await getClinicDoctors(clinic._id);
    let tags = ''
    clinic.speciality.forEach(tag => {
        tags += tag + ', ';
    });
    const clinicInfo = {
        _id: clinic._id.toString(),
        clinicName: clinic.clinicName,
        phone: clinic.phone,
        address: clinic.address,
        email: clinic.email,
        description: clinic.description,
        opening: clinic.opening,
        googleMapLink: clinic.googleMapLink,
    }
    return res.render('bookAppointment.ejs', { user: req.user, clinic: clinicInfo, doctors, speciality: tags });
}

const postAppointment = async (req, res) => {
    try {
        const form = req.body;

        // Validate required fields
        if (!form.clinicID || !form.checkup_type || !form.selected_doctor ||
            !form.appointment_date || !form.time_slot) {
            return res.redirect('/appoint?id=' + form.clinicID + '&error=' +
                encodeURIComponent('All fields are required. Please fill in all information.'));
        }

        // Validate user is authenticated
        if (!req.user || !req.user.id) {
            return res.redirect('/auth/login?error=' +
                encodeURIComponent('You must be logged in to book an appointment.'));
        }

        const appointment = await createAppointment(form, req.user);

        if (!appointment) {
            return res.redirect('/appoint?id=' + form.clinicID + '&error=' +
                encodeURIComponent('Failed to book appointment. Please try again.'));
        }

        return res.redirect('/appointments?success=' +
            encodeURIComponent('Appointment booked successfully.'));
    } catch (error) {
        console.error('Error creating appointment:', error);
        return res.redirect('/?error=' +
            encodeURIComponent('An error occurred. Please try again.'));
    }
}

const showMyAppointments = async (req, res) => {
    // Require authentication
    if (!req.user) return res.redirect('/auth/login');

    const appoints = await getAllAppointments(req.user.id);
    if (!appoints) {
        return res.render('myAppointments.ejs', { user: req.user, completedAppoints: [], upComingAppoints: [] });
    }

    const myAppoints = [];

    for (const appoint of appoints) {
        const clinic = await getClinicById(appoint.clinicID);
        if (!clinic) continue;

        // Get doctor name
        const doctors = await getClinicDoctors(appoint.clinicID);
        const doctor = doctors.find(d => d._id.toString() === appoint.doctorId.toString());
        const doctorName = doctor ? doctor.name : 'N/A';

        myAppoints.push({
            _id: appoint._id.toString(),
            checkupType: appoint.checkupType,
            doctor: doctorName,
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


const postDelete = async (req, res) => {
    try {
        const { appointId } = req.body;
        if (!appointId) return;
        await deleteAppoint(appointId);

        return res.redirect('/appointments?success=' + encodeURIComponent('Appointment cancelled.'));

    } catch (error) {
        console.error(error);
        return res.redirect('/appointments?error=' + encodeURIComponent('Failed to cancel appointment. Please try again.'));
    }
}


export {
    showAppointment,
    postAppointment,
    showMyAppointments,
    postDelete,
    checkTimeSlotAvailability
}