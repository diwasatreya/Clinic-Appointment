import { updateDataClinic, addNewDoctor, deleteDoctor, createDoctorTime, removeDoctorTime, getClinicById, getClinicDoctors, updateClinicStatus, requestClinicApproval } from "../services/clinics.services.js";
import { getClinicAppointments, getClinicAppointmentStats, updateAppointmentStatus } from "../services/appointment.services.js";
import { getUserById } from "../services/auth.services.js";

const showDashboard = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "clinic") {
            return res.redirect('/');
        }

        const clinic = await getClinicById(req.user.id);
        if (!clinic) {
            return res.redirect('/');
        }

        // Get appointment statistics
        const stats = await getClinicAppointmentStats(req.user.id);
        
        // Get all appointments for this clinic
        const appointments = await getClinicAppointments(req.user.id);
        
        // Get doctors once for all appointments
        const doctors = await getClinicDoctors(req.user.id);
        
        // Populate user and doctor info for each appointment
        const appointmentsWithDetails = await Promise.all(appointments.map(async (appointment) => {
            const user = await getUserById(appointment.userId);
            const doctor = doctors.find(d => d._id.toString() === appointment.doctorId);
            
            return {
                ...appointment.toObject(),
                user: user ? {
                    name: `${user.firstName} ${user.lastName}`,
                    phone: user.phone
                } : null,
                doctor: doctor ? {
                    name: doctor.name,
                    speciality: doctor.speciality
                } : null
            };
        }));

        // Prepare tags for clinic info
        let tags = '';
        if (clinic.speciality && clinic.speciality.length > 0) {
            clinic.speciality.forEach(tag => {
                tags += tag + ', ';
            });
        }

        return res.render('clinicDashboard/dashboard.ejs', { 
            user: req.user, 
            dataClinic: clinic, 
            stats,
            appointments: appointmentsWithDetails,
            doctors,
            tags,
            query: req.query
        });
    } catch (error) {
        console.error(error);
        return res.redirect('/');
    }
};

const updateClinic = async (req, res) => {
    try {
        const form = req.body;

        if (!req.user) return res.redirect('/');

        const updateData = await updateDataClinic(req.user, form);

        return res.redirect('/clinic/dashboard');
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard');
    }
}

const addClinicDoctor = async (req, res) => {
    try {
        const form = req.body;

        if (!req.user) return res.redirect('/');

        const newDoctor = await addNewDoctor(form, req.user.id);

        const redirectTab = form.redirectTab || 'doctors';
        return res.redirect(`/clinic/dashboard?tab=${redirectTab}`);
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=doctors');
    }
}

const deleteClinicDoctor = async (req, res) => {
    try {
        const form = req.body;

        await deleteDoctor(form.doctorId);
        const redirectTab = form.redirectTab || 'doctors';
        return res.redirect(`/clinic/dashboard?tab=${redirectTab}`);

    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=doctors');
    }
};

const addDoctorTime = async (req, res) => {
    try {
        const form = req.body;
        await createDoctorTime(form)

        const redirectTab = form.redirectTab || 'doctors';
        return res.redirect(`/clinic/dashboard?tab=${redirectTab}`);

    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=doctors');
    }
};

const deleteDoctorTime = async (req, res) => {
    try {
        const form = req.body;

        await removeDoctorTime(form);

        const redirectTab = form.redirectTab || 'doctors';
        return res.redirect(`/clinic/dashboard?tab=${redirectTab}`);
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=doctors');
    }
}

const toggleClinicStatus = async (req, res) => {
    try {
        if (!req.user) return res.redirect('/');

        const { status } = req.body;
        const newStatus = status === 'true' || status === true;
        
        await updateClinicStatus(req.user.id, newStatus);

        const redirectTab = req.body.redirectTab || 'settings';
        return res.redirect(`/clinic/dashboard?tab=${redirectTab}`);
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=settings');
    }
};

const sendForApproval = async (req, res) => {
    try {
        if (!req.user) return res.redirect('/');

        await requestClinicApproval(req.user.id);

        const redirectTab = req.body.redirectTab || 'settings';
        return res.redirect(`/clinic/dashboard?tab=${redirectTab}`);
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=settings');
    }
};

const approveAppointment = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "clinic") {
            return res.redirect('/');
        }

        const { appointmentId } = req.body;
        
        await updateAppointmentStatus(appointmentId, "Approved");
        
        return res.redirect('/clinic/dashboard?tab=appointments');
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=appointments');
    }
};

const cancelAppointment = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "clinic") {
            return res.redirect('/');
        }

        const { appointmentId, reason } = req.body;
        
        if (!reason || reason.trim() === '') {
            return res.redirect('/clinic/dashboard?tab=appointments&error=' + encodeURIComponent('Cancellation reason is required'));
        }
        
        await updateAppointmentStatus(appointmentId, "Canceled", reason);
        
        return res.redirect('/clinic/dashboard?tab=appointments');
    } catch (error) {
        console.error(error);
        return res.redirect('/clinic/dashboard?tab=appointments');
    }
};

export {
    showDashboard,
    updateClinic,
    addClinicDoctor,
    deleteClinicDoctor,
    addDoctorTime,
    deleteDoctorTime,
    toggleClinicStatus,
    sendForApproval,
    approveAppointment,
    cancelAppointment
}