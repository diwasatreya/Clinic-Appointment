import Appointment from '../models/appointment.model.js';
import { parseDateTime } from '../utils/util.js';

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
};

const getUpCommingAppoints = (appoints, key) => {

    try {
        const now = new Date();

        return [...appoints].filter(appoint => parseDateTime(appoint[key]) !== null).sort((a, b) => {
            const dateA = parseDateTime(a[key]);
            const dateB = parseDateTime(b[key]);
            if (!dateA || !dateB) return 0;
            return Math.abs(dateA - now) - Math.abs(dateB - now);

        });


    } catch (error) {
        console.error(error);
        return [];
    }

}


function getFormattedDateInfo(dateStr) {
    const date = parseDateTime(dateStr);
    if (!date) return null;

    const day = date.getDate();
    const monthName = date.toLocaleString("en-US", { month: "short" });
    const weekday = date.toLocaleString("en-US", { weekday: "long" });

    return {
        formattedDate: `${day} ${monthName}`,
        dayName: weekday,
    };
}

const deleteAppoint = async (id) => {
    try {
        const appoint = await Appointment.findById(id);
        if (!appoint) return;
        appoint.status = "Canceled";
        appoint.completed = true;
        await appoint.save();
        return appoint;
    } catch (error) {
        console.error(error);
    }
}


export {
    createAppointment,
    getAllAppointments,
    getUpCommingAppoints,
    getFormattedDateInfo,
    deleteAppoint
}