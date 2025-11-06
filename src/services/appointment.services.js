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
};


const parseDateTime = (str) => {
    // Example input: "2025-11-22 1:00 PM"
    const match = str.match(
        /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!match) {
        console.warn("Invalid date format:", str);
        return null;
    }

    const [_, datePart, hourStr, minuteStr, meridian] = match;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    // Convert 12-hour → 24-hour format
    if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Create local Date (not UTC)
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0);

    return date;
};


const getUpCommingAppoints = (appoints, key) => {

    try {
        const now = new Date();

        return [...appoints].sort((a, b) => {
            const dateA = parseDateTime(a[key]);
            const dateB = parseDateTime(b[key]);
            return Math.abs(dateA - now) - Math.abs(dateB - now);

        });


    } catch (error) {
        console.error(error);
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
    parseDateTime,
    getUpCommingAppoints,
    getFormattedDateInfo,
    deleteAppoint
}