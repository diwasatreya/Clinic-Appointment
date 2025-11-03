import Appointment from '../models/appointment.model.js';

const createAppointment = async (form, user) => {
    const { clinicID, checkup_type, selected_doctor, appointment_date, time_slot, reason } = form;


    try {
        const appoint = new Appointment({
            userId: user.id,
            clinicID,
            checkupType: checkup_type,
            doctorId: selected_doctor,
            appointmentDate: appointment_date,
            appointmentTime: time_slot,
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