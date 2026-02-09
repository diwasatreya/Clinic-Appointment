import { getAllClinics, filterClinics, getClinicDoctors } from "../services/clinics.services.js";
import { getUserByNumber } from "../services/auth.services.js";

const showHomePage = async (req, res) => {
    // Redirect clinics to dashboard
    if (req.user && req.user.role === 'clinic') {
        return res.redirect('/clinic/dashboard');
    }

    // Redirect admins to admin dashboard
    if (req.user && req.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }

    const { search } = req.query;

    let clinics;

    if (search && search.length != 0) {
        clinics = await filterClinics(search);
        for (let i = 0; i < clinics.length; i++) {
            clinics[i]['doctors'] = await getClinicDoctors(clinics[i]._id);
        }
    } else {
        clinics = await getAllClinics();
        for (let i = 0; i < clinics.length; i++) {
            clinics[i]['doctors'] = await getClinicDoctors(clinics[i]._id);
        }
    }
    return res.render('index.ejs', { user: req.user, clinics });
}




export {
    showHomePage,
}