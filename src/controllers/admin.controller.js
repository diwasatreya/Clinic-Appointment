import { getPendingClinics, getAllClinicsForAdmin, searchClinics, approveClinic, declineClinic, banClinic, unbanClinic, deapproveClinic, getClinicDetails } from "../services/admin.services.js";

const showDashboard = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.redirect('/');
        }

        const tab = req.query.tab || 'pending';
        const searchTerm = req.query.search || '';

        let clinics = [];
        let clinicDetails = null;

        if (tab === 'pending') {
            clinics = await getPendingClinics();
            // Get details for each clinic
            const clinicsWithDetails = await Promise.all(clinics.map(async (clinic) => {
                const details = await getClinicDetails(clinic._id);
                return details;
            }));
            clinicDetails = clinicsWithDetails.filter(d => d !== null);
        } else if (tab === 'manage') {
            if (searchTerm) {
                clinics = await searchClinics(searchTerm);
            } else {
                clinics = await getAllClinicsForAdmin();
            }
            // Get details for each clinic in manage tab
            const clinicsWithDetails = await Promise.all(clinics.map(async (clinic) => {
                const details = await getClinicDetails(clinic._id);
                return details;
            }));
            clinicDetails = clinicsWithDetails.filter(d => d !== null);
        }

        return res.render('adminDashboard/dashboard.ejs', {
            user: req.user,
            clinics,
            clinicDetails,
            tab,
            searchTerm
        });
    } catch (error) {
        console.error(error);
        return res.redirect('/');
    }
};

const approveClinicAction = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.redirect('/');
        }

        const { clinicId } = req.body;
        await approveClinic(clinicId);

        return res.redirect('/admin/dashboard?tab=pending');
    } catch (error) {
        console.error(error);
        return res.redirect('/admin/dashboard?tab=pending');
    }
};

const declineClinicAction = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.redirect('/');
        }

        const { clinicId } = req.body;
        await declineClinic(clinicId);

        return res.redirect('/admin/dashboard?tab=pending');
    } catch (error) {
        console.error(error);
        return res.redirect('/admin/dashboard?tab=pending');
    }
};

const banClinicAction = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.redirect('/');
        }

        const { clinicId } = req.body;
        await banClinic(clinicId);

        return res.redirect('/admin/dashboard?tab=manage');
    } catch (error) {
        console.error(error);
        return res.redirect('/admin/dashboard?tab=manage');
    }
};

const unbanClinicAction = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.redirect('/');
        }

        const { clinicId } = req.body;
        await unbanClinic(clinicId);

        return res.redirect('/admin/dashboard?tab=manage');
    } catch (error) {
        console.error(error);
        return res.redirect('/admin/dashboard?tab=manage');
    }
};

const deapproveClinicAction = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.redirect('/');
        }

        const { clinicId } = req.body;
        await deapproveClinic(clinicId);

        return res.redirect('/admin/dashboard?tab=manage');
    } catch (error) {
        console.error(error);
        return res.redirect('/admin/dashboard?tab=manage');
    }
};

export {
    showDashboard,
    approveClinicAction,
    declineClinicAction,
    banClinicAction,
    unbanClinicAction,
    deapproveClinicAction
};
