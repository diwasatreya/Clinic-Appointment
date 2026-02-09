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
        console.error('createAppointment: Error creating appointment:', error);
        console.error('createAppointment: Form data:', JSON.stringify(form));
        console.error('createAppointment: User:', user.id);
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

const getClinicAppointments = async (clinicId, status = null) => {
    try {
        let query = { clinicID: clinicId };
        if (status) {
            query.status = status;
        }
        const appointments = await Appointment.find(query).sort({ appointmentDate: 1, appointmentTime: 1 });
        return appointments;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getTodayAppointments = async (clinicId) => {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        const appointments = await Appointment.find({
            clinicID: clinicId,
            appointmentDate: todayStr,
            status: 'Approved'
        }).sort({ appointmentTime: 1 });

        return appointments;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getClinicAppointmentStats = async (clinicId) => {
    try {
        const appointments = await Appointment.find({ clinicID: clinicId });

        const stats = {
            total: appointments.length,
            pending: appointments.filter(a => a.status === "Pending").length,
            cancelled: appointments.filter(a => a.status === "Canceled").length,
            approved: appointments.filter(a => a.status === "Approved").length,
            completed: appointments.filter(a => a.completed === true).length
        };

        return stats;
    } catch (error) {
        console.error(error);
        return { total: 0, pending: 0, cancelled: 0, approved: 0, completed: 0 };
    }
};

const updateAppointmentStatus = async (appointmentId, status, reason = null) => {
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return null;

        appointment.status = status;
        if (reason) {
            appointment.cancellationReason = reason;
        }
        if (status === "Canceled" || status === "Completed") {
            appointment.completed = true;
        }

        await appointment.save();
        return appointment;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getTimeSlotCount = async (clinicId, doctorId, appointmentDate, appointmentTime) => {
    try {
        const count = await Appointment.countDocuments({
            clinicID: clinicId,
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime,
            status: { $in: ['Pending', 'Approved'] }
        });
        return count;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

export {
    createAppointment,
    getAllAppointments,
    getUpCommingAppoints,
    getFormattedDateInfo,
    deleteAppoint,
    getClinicAppointments,
    getClinicAppointmentStats,
    updateAppointmentStatus,
    getTodayAppointments,
    getTimeSlotCount
}