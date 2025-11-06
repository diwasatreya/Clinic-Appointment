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

const filterClinics = async (str) => {
    try {
        const clinics = await Clinics.find();
        const searchValue = str.toLowerCase();

        const filteredClinics = clinics.filter((clinic) => { return clinic.clinicName.toLowerCase().includes(searchValue) || clinic.address.toLowerCase().includes(searchValue) });

        return filteredClinics;

    } catch (error) {
        console.error(error);
    }
}

export {
    getAllClinics,
    getClinicById,
    filterClinics
}