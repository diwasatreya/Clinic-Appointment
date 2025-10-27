import Clinics from '../models/clinic.model.js';

const getAllClinics = async () => {

    const clinics = await Clinics.find();

    return clinics;
}

const getClinicById = async (id) => {
    try {
        const clinic = await Clinics.findById(id);
        return clinic
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    getAllClinics,
    getClinicById
}