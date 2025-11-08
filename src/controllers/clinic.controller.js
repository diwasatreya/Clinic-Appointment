import { updateDataClinic, addNewDoctor, deleteDoctor, createDoctorTime, removeDoctorTime } from "../services/clinics.services.js";

const updateClinic = async (req, res) => {
    try {
        const form = req.body;

        if (!req.user) return res.redirect('/');

        const updateData = await updateDataClinic(req.user, form);

        return res.redirect(`/${req.user.id}`);
    } catch (error) {
        console.error(error);
    }
}

const addClinicDoctor = async (req, res) => {
    try {
        const form = req.body;

        if (!req.user) return res.redirect('/');

        const newDoctor = await addNewDoctor(form, req.user.id);

        return res.redirect(`/${req.user.id}`);
    } catch (error) {
        console.error(error);
    }
}

const deleteClinicDoctor = async (req, res) => {
    try {
        const form = req.body;

        await deleteDoctor(form.doctorId);
        return res.redirect(`/${req.user.id}`);

    } catch (error) {
        console.error(error);
        return;
    }
};

const addDoctorTime = async (req, res) => {
    try {
        const form = req.body;
        await createDoctorTime(form)

        return res.redirect(`/${req.user.id}`);

    } catch (error) {
        console.error(error);
        return;
    }
};

const deleteDoctorTime = async (req, res) => {
    try {
        const form = req.body;

        await removeDoctorTime(form);

        return res.redirect(`/${req.user.id}`);
    } catch (error) {
        console.error(error);
        return;
    }
}

export {
    updateClinic,
    addClinicDoctor,
    deleteClinicDoctor,
    addDoctorTime,
    deleteDoctorTime
}