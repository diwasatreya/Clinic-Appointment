import { getUserByNumber } from "../services/auth.services.js";
import { getClinicById, getClinicDoctors } from "../services/clinics.services.js";


const userProfile = async (req, res, next) => {

        try {
            // Redirect clinics from all non-dashboard routes to dashboard
            if (req.user && req.user.role === 'clinic') {
                // Allow access to dashboard and clinic routes, redirect everything else
                if (!req.url.startsWith('/clinic/') && req.url !== '/auth/logout' && !req.url.startsWith('/auth/')) {
                    return res.redirect('/clinic/dashboard');
                }
            }

            // Redirect admins from non-admin routes to admin dashboard
            if (req.user && req.user.role === 'admin') {
                // Allow access to admin routes, redirect everything else
                if (!req.url.startsWith('/admin/') && req.url !== '/auth/logout' && !req.url.startsWith('/auth/')) {
                    return res.redirect('/admin/dashboard');
                }
            }

            if (typeof req.user == "undefined" || !req.user) {
                return next();
            }

            let user;
            if (req.user.role == "user") {
                user = await getUserByNumber(req.user.phone);
            }

            if (user && req.url == `/${user._id.toString()}`) {
                res.render('userProfile.ejs', { user: req.user, dataUser: user });
                return next();
            }

            return next();

        } catch (error) {
            console.error(error);
            return next(error);
        }

    }

export default userProfile;