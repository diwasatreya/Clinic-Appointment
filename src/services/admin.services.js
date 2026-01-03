import Clinics from '../models/clinic.model.js';
import Doctors from '../models/doctor.model.js';

const ADMIN_PHONE = 0; // 0000000000 as number
const ADMIN_PASSWORD_HASH = '$argon2id$v=19$m=65536,t=3,p=4$adminhash'; // We'll verify with hardcoded password for now

// Get all pending clinics (not approved)
const getPendingClinics = async () => {
    try {
        const clinics = await Clinics.find({ approved: false });
        return clinics;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Get all clinics (for search/ban tab)
const getAllClinicsForAdmin = async () => {
    try {
        const clinics = await Clinics.find().sort({ createdAt: -1 });
        return clinics;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Search clinics
const searchClinics = async (searchTerm) => {
    try {
        const clinics = await Clinics.find({
            $or: [
                { clinicName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { address: { $regex: searchTerm, $options: 'i' } },
                { phone: isNaN(parseInt(searchTerm)) ? null : parseInt(searchTerm) }
            ].filter(condition => condition.phone !== null || !isNaN(parseInt(searchTerm)))
        });
        return clinics;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Approve clinic
const approveClinic = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        clinic.approved = true;
        await clinic.save();
        
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Decline clinic (delete or mark as declined - we'll mark as declined by setting status to false)
const declineClinic = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        // Optionally delete the clinic, or just mark as not approved
        // For now, we'll just delete it
        await Clinics.findByIdAndDelete(clinicId);
        
        return { success: true };
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Ban clinic (set status to false)
const banClinic = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        clinic.status = false;
        await clinic.save();
        
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Unban clinic (set status to true)
const unbanClinic = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        clinic.status = true;
        await clinic.save();
        
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Deapprove clinic (set approved to false)
const deapproveClinic = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        clinic.approved = false;
        await clinic.save();
        
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Get clinic with doctors and time slots
const getClinicDetails = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        const doctors = await Doctors.find({ clinicId: clinicId.toString() });
        
        return {
            clinic,
            doctors
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};

export {
    ADMIN_PHONE,
    getPendingClinics,
    getAllClinicsForAdmin,
    searchClinics,
    approveClinic,
    declineClinic,
    banClinic,
    unbanClinic,
    deapproveClinic,
    getClinicDetails
};

