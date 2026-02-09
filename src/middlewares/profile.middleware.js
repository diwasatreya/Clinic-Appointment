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

        // Continue to next middleware/route
        return next();

    } catch (error) {
        console.error('userProfile middleware error:', error);
        return next(error);
    }
}

export default userProfile;