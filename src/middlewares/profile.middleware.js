import { getUserByNumber } from "../services/auth.services.js";
import { getClinicById } from "../services/clinics.services.js";


const userProfile = async (req, res, next) => {

    try {
        if (typeof req.user == "undefined" || !req.user) {
            return next();
        }
        const user = await getUserByNumber(req.user.phone);
        const clinic = await getClinicById(req.user.id);

        if (user && req.url == `/${user._id.toString()}`) {
            res.render('userProfile.ejs', { user: req.user, dataUser: user });
            return next();
        }

        if (clinic && req.url == `/${clinic._id.toString()}`) {
            res.render('clinicDashboard/profile.ejs', { user: req.user, dataClinic: clinic });
            return next();
        }


        return next();

    } catch (error) {
        console.error(error);
    }

}

export default userProfile