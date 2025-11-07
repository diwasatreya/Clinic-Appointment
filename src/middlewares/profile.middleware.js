import { getUserByNumber } from "../services/auth.services.js";
import { getClinicById } from "../services/clinics.services.js";


const userProfile = async (req, res, next) => {

    try {
        if (typeof req.user == "undefined" || !req.user) {
            return next();
        }

        let user;
        let clinic;
        if (req.user.role == "user") {
            user = await getUserByNumber(req.user.phone);
        } else {
            clinic = await getClinicById(req.user.id);
        }

        if (user && req.url == `/${user._id.toString()}`) {
            res.render('userProfile.ejs', { user: req.user, dataUser: user });
            return next();
        }

        if (clinic && req.url == `/${clinic._id.toString()}`) {
            let tags = ''
            clinic.speciality.forEach(tag => {
                tags += tag + ', ';
            });
            res.render('clinicDashboard/profile.ejs', { user: req.user, dataClinic: clinic, tags });
            return next();
        }


        return next();

    } catch (error) {
        console.error(error);
        return next(err);
    }

}

export default userProfile