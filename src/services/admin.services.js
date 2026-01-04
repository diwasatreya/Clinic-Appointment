import Clinics from '../models/clinic.model.js';
import Doctors from '../models/doctor.model.js';

// Get all pending clinics (those that have requested approval)
const getPendingClinics = async () => {
    try {
        const clinics = await Clinics.find({ pendingApproval: true });
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
        clinic.pendingApproval = false; // Clear the pending approval flag
        await clinic.save();
        
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Decline clinic (clear the pending approval flag, but keep the clinic)
const declineClinic = async (clinicId) => {
    try {
        const clinic = await Clinics.findById(clinicId);
        if (!clinic) return null;
        
        // Clear the pending approval flag when declined
        clinic.pendingApproval = false;
        await clinic.save();
        
        return clinic;
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
        
        clinic.approved = false;
        clinic.pendingApproval = true; 
        clinic.status = false;
        clinic.banned = true;
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
        
        clinic.banned = false;
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

