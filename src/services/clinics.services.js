import { name } from 'ejs';
import Clinics from '../models/clinic.model.js';
import Doctors from '../models/doctor.model.js';

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

const addNewDoctor = async (form, id) => {
    try {

        const doctor = new Doctors({
            clinicId: id,
            name: form['doctor-name'].trim().replace('Dr. ', '').replace('dr.', ''),
            speciality: form['doctor-speciality'],
            description: form['doctor-description']
        });

        await doctor.save();

        return doctor;

    } catch (error) {
        console.error(error);
        return;
    }
}

const deleteDoctor = async (id) => {
    try {
        const doctor = await Doctors.findByIdAndDelete(id);
        return doctor;
    } catch (error) {
        console.error(error);
        return;
    }
}

const getClinicDoctors = async (id) => {
    try {
        const doctors = await Doctors.find({ clinicId: id });
        if (!doctors) return;

        return doctors;
    } catch (error) {
        console.error(error);
        return;
    }
}

const createDoctorTime = async (form) => {
    try {
        const doctor = await Doctors.findById(form.doctorId);
        if (!doctor) return;

        const formatTime = (time) => {
            const [hour, minute] = time.split(":");
            const h = parseInt(hour);
            const ampm = h >= 12 ? "PM" : "AM";
            const formattedHour = h % 12 || 12;
            return `${formattedHour}:${minute} ${ampm}`;
        }

        doctor.time.push(formatTime(form.time));

        await doctor.save();

    } catch (error) {
        console.error(error);
        return;
    }
}

const removeDoctorTime = async (form) => {
    try {
        const doctor = await Doctors.findById(form.doctorId);
        if (!doctor) return;

        const index = doctor.time.indexOf(form.time);

        if (index !== -1) doctor.time.splice(index, 1);

        await doctor.save();

        return doctor.time;
    } catch (error) {
        console.error(error);
        return;
    }
}

export {
    getAllClinics,
    getClinicById,
    filterClinics,
    updateDataClinic,
    addNewDoctor,
    getClinicDoctors,
    deleteDoctor,
    createDoctorTime,
    removeDoctorTime
}