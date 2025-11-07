import { updateDataClinic } from "../services/clinics.services.js";

const updateClinic = async (req, res) => {
    try {
        const form = req.body;

        const updateData = await updateDataClinic(req.user, form);

        return res.redirect(`/${req.user.id}`);
    } catch (error) {
        console.error(error);
    }
}

export {
    updateClinic
}