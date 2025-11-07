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
};

const updateDataClinic = async (info, form) => {
    try {
        const clinic = await Clinics.findById(info.id);
        if (!clinic) return;

        clinic.description = form.description;
        clinic.address = form.address;
        clinic.opening = form.opening;
        const tags = form.speciality.split(', ').slice(0, 5);
        clinic.speciality = [];
        tags.forEach(tag => {
            clinic.speciality.push(tag);
        });

        await clinic.save();

        return clinic;

    } catch (error) {
        console.error(error);
    }
}

export {
    getAllClinics,
    getClinicById,
    filterClinics,
    updateDataClinic
}