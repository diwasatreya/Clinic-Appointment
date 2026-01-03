import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/constant.js";
import { createNewClinic, createSession, generateNewToken, getClinicByNumber, getClinicByEmail, getUserByNumber, signupUser, updateUserData } from "../services/auth.services.js";
import { convertTime, generateJWT, verifyHash } from "../utils/util.js";
import { validateLogin, validateUserSignup, validateClinicSignup } from "../utils/validation.js";

const getLoginPage = (req, res) => {
    if (req.user) return res.redirect("/");
    const error = req.query.error || null;
    const success = req.query.success || null;
    return res.render('auth/login.ejs', { error, success });
}

const getSignupPage = (req, res) => {
    if (req.user) return res.redirect("/");
    const error = req.query.error || null;
    const formType = req.query.type || 'user'; // 'user' or 'clinic'
    return res.render('auth/signup.ejs', { error, formType });
}


const postLoginPage = async (req, res) => {
    const form = req.body;
    
    // Validate input
    const validation = validateLogin(form);
    if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors)[0]; // Get first error
        return res.redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
    }

    const phoneNumber = parseInt(form.phone);
    
    // Check for admin login (phone: 0000000000, password: admin@123)
    if (phoneNumber === 0 && form.password === 'admin@123') {
        const sessionInfo = {
            userId: 'admin',
            userAgent: req.headers['user-agent']
        }

        const session = await createSession(sessionInfo);
        if (!session) {
            return res.redirect('/auth/login?error=' + encodeURIComponent('Failed to create session. Please try again.'));
        }

        const accessToken = generateJWT({ id: 'admin', username: 'Admin', sid: session._id.toString(), phone: 0, role: "admin" }, ACCESS_TOKEN_EXPIRE);
        const refreshToken = generateJWT({ sid: session._id.toString(), role: "admin" }, REFRESH_TOKEN_EXPIRE);

        const baseCookieConfig = { httpOnly: false, sameSite: 'strict', secure: false };

        res.cookie("accessToken", accessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE), ...baseCookieConfig });
        res.cookie("refreshToken", refreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE), ...baseCookieConfig });
        
        return res.redirect('/admin/dashboard');
    }
    
    const user = await getUserByNumber(phoneNumber);
    const clinic = await getClinicByNumber(phoneNumber);

    if (user) {
        const verifyPassword = await verifyHash(user.password, form.password);

        if (!verifyPassword) {
            return res.redirect('/auth/login?error=' + encodeURIComponent('Invalid phone number or password'));
        }

        const sessionInfo = {
            userId: user._id.toString(),
            userAgent: req.headers['user-agent']
        }

        const session = await createSession(sessionInfo);
        if (!session) {
            return res.redirect('/auth/login?error=' + encodeURIComponent('Failed to create session. Please try again.'));
        }

        const accessToken = generateJWT({ id: user._id.toString(), username: user.firstName + ' ' + user.lastName, sid: session._id.toString(), phone: user.phone, role: "user" }, ACCESS_TOKEN_EXPIRE);
        const refreshToken = generateJWT({ sid: session._id.toString(), role: "user" }, REFRESH_TOKEN_EXPIRE);

        const baseCookieConfig = { httpOnly: false, sameSite: 'strict', secure: false };

        res.cookie("accessToken", accessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE), ...baseCookieConfig });
        res.cookie("refreshToken", refreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE), ...baseCookieConfig });
    } else if (clinic) {
        const verifyPassword = await verifyHash(clinic.password, form.password);

        if (!verifyPassword) {
            return res.redirect('/auth/login?error=' + encodeURIComponent('Invalid phone number or password'));
        }

        const sessionInfo = {
            userId: clinic._id.toString(),
            userAgent: req.headers['user-agent']
        }

        const session = await createSession(sessionInfo);
        if (!session) {
            return res.redirect('/auth/login?error=' + encodeURIComponent('Failed to create session. Please try again.'));
        }

        const accessToken = generateJWT({ id: clinic._id.toString(), username: clinic.clinicName, sid: session._id.toString(), phone: clinic.phone, role: "clinic" }, ACCESS_TOKEN_EXPIRE);
        const refreshToken = generateJWT({ sid: session._id.toString(), role: "clinic" }, REFRESH_TOKEN_EXPIRE);

        const baseCookieConfig = { httpOnly: false, sameSite: 'strict', secure: false };

        res.cookie("accessToken", accessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE), ...baseCookieConfig });
        res.cookie("refreshToken", refreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE), ...baseCookieConfig });
        
        return res.redirect('/clinic/dashboard');
    } else {
        return res.redirect('/auth/login?error=' + encodeURIComponent('Invalid phone number or password'));
    }

    return res.redirect('/');
}

const postSignupPage = async (req, res) => {
    const form = req.body;

    if (form.accType == "userAcc") {
        // Validate user signup
        const validation = validateUserSignup(form);
        if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors)[0]; // Get first error
            return res.redirect(`/auth/signup?error=${encodeURIComponent(errorMessage)}&type=user`);
        }

        const phoneNumber = parseInt(form.phone);
        const user = await getUserByNumber(phoneNumber);

        if (user) {
            return res.redirect('/auth/signup?error=' + encodeURIComponent('An account with this phone number already exists') + '&type=user');
        }

        const newUser = await signupUser({ ...form, phone: phoneNumber });

        if (!newUser) {
            return res.redirect('/auth/signup?error=' + encodeURIComponent('Failed to create account. Please try again.') + '&type=user');
        }

        return res.redirect('/auth/login?success=' + encodeURIComponent('Account created successfully! Please login.'));

    } else {
        // Validate clinic signup
        const validation = validateClinicSignup(form);
        if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors)[0]; // Get first error
            return res.redirect(`/auth/signup?error=${encodeURIComponent(errorMessage)}&type=clinic`);
        }

        const phoneNumber = parseInt(form.phone);
        const clinicByPhone = await getClinicByNumber(phoneNumber);
        const clinicByEmail = await getClinicByEmail(form.email);

        if (clinicByPhone) {
            return res.redirect('/auth/signup?error=' + encodeURIComponent('A clinic with this phone number already exists') + '&type=clinic');
        }

        if (clinicByEmail) {
            return res.redirect('/auth/signup?error=' + encodeURIComponent('A clinic with this email already exists') + '&type=clinic');
        }

        const newClinic = await createNewClinic({ ...form, phone: phoneNumber });

        if (!newClinic) {
            return res.redirect('/auth/signup?error=' + encodeURIComponent('Failed to register clinic. Please try again.') + '&type=clinic');
        }

        return res.redirect('/auth/login?success=' + encodeURIComponent('Clinic registered successfully! Please login.'));
    }
}

const postLogout = (req, res) => {
    req.user = null;
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect("/");
}

const updateUser = async (req, res) => {
    try {
        const form = req.body;

        const oldPhoneNumber = parseInt(form.oldphone);
        if (!oldPhoneNumber) {
            return res.redirect('/');
        }
        
        const user = await getUserByNumber(oldPhoneNumber);
        
        if (!user) {
            return res.redirect('/');
        }

        const updatedUser = await updateUserData(user, form);
        if (!updatedUser) return res.redirect(`/${user._id.toString()}`);
        const refreshToken = req.cookies.refreshToken;

        const { newAccessToken, newRefreshToken, newUser } = await generateNewToken(refreshToken);

        const baseCookieConfig = { httpOnly: false, sameSite: 'strict', secure: false };

        res.cookie("accessToken", newAccessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE), ...baseCookieConfig });
        res.cookie("refreshToken", newRefreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE), ...baseCookieConfig });

        req.user = newUser;

        return res.redirect(`/${user._id.toString()}`);

    } catch (error) {
        console.error(error);
        return res.redirect('/');
    }
}

export {
    getLoginPage,
    getSignupPage,
    postLoginPage,
    postSignupPage,
    postLogout,
    updateUser
}