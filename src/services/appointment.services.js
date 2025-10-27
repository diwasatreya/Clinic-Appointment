import Appointment from '../models/appointment.model.js';

const createAppointment = async (form, user) => {
    const { clinicID, checkupType, doctor_id, appointment_date, appointment_time, reason } = form;


    try {
        const appoint = new Appointment({
            userId: user.id,
            clinicID,
            checkupType,
            doctorId: doctor_id,
            appointmentDate: appointment_date,
            appointmentTime: appointment_time,
            reason,
        });

        await appoint.save();

        return appoint;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getAllAppointments = async (id) => {
    try {
        const appoints = await Appointment.find({ userId: id });

        return appoints;
    } catch (error) {
        console.error(error);
        return null
    }
}

export {
    createAppointment,
    getAllAppointments
}