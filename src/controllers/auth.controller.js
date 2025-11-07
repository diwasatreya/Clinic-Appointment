import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/constant.js";
import { createNewClinic, createSession, generateNewToken, getClinicByNumber, getUserByNumber, signupUser, updateUserData } from "../services/auth.services.js";
import { convertTime, generateJWT, verifyHash } from "../utils/util.js";

const getLoginPage = (req, res) => {
    if (req.user) return res.redirect("/");
    return res.render('Auth/login.ejs');
}

const getSignupPage = (req, res) => {

    if (req.user) return res.redirect("/");
    return res.render('auth/signup.ejs');
}


const postLoginPage = async (req, res) => {
    const form = req.body;
    const phoneNumber = parseInt(form.phone);

    if (!phoneNumber) {
        console.log("Invalid Number!");
        return res.redirect('/auth/login');
    }
    const user = await getUserByNumber(phoneNumber);
    const clinic = await getClinicByNumber(phoneNumber);

    if (user) {
        const verifyPassword = await verifyHash(user.password, form.password);

        if (!verifyPassword) {
            console.log("Invalid Password!");
            return res.redirect('/auth/login');
        }

        const sessionInfo = {
            userId: user._id.toString(),
            userAgent: req.headers['user-agent']
        }

        const session = await createSession(sessionInfo);

        const accessToken = generateJWT({ id: user._id.toString(), username: user.firstName + ' ' + user.lastName, sid: session._id.toString(), phone: user.phone, role: "user" }, ACCESS_TOKEN_EXPIRE);
        const refreshToken = generateJWT({ sid: session._id.toString(), role: "user" }, REFRESH_TOKEN_EXPIRE);

        const baseCookieConfig = { httpOnly: false, sameSite: 'strict', secure: false };

        res.cookie("accessToken", accessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE), ...baseCookieConfig });
        res.cookie("refreshToken", refreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE), ...baseCookieConfig });
    } else if (clinic) {
        const verifyPassword = await verifyHash(clinic.password, form.password);

        if (!verifyPassword) {
            console.log("Invalid Password!");
            return res.redirect('/auth/login');
        }

        const sessionInfo = {
            userId: clinic._id.toString(),
            userAgent: req.headers['user-agent']
        }

        const session = await createSession(sessionInfo);

        const accessToken = generateJWT({ id: clinic._id.toString(), username: clinic.clinicName, sid: session._id.toString(), phone: clinic.phone, role: "clinic" }, ACCESS_TOKEN_EXPIRE);
        const refreshToken = generateJWT({ sid: session._id.toString(), role: "clinic" }, REFRESH_TOKEN_EXPIRE);

        const baseCookieConfig = { httpOnly: false, sameSite: 'strict', secure: false };

        res.cookie("accessToken", accessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE), ...baseCookieConfig });
        res.cookie("refreshToken", refreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE), ...baseCookieConfig });
    } else {
        console.log("User/Clinic Doesn\'t exists");
        return res.redirect('/auth/login');
    }

    return res.redirect('/');
}

const postSignupPage = async (req, res) => {
    const form = req.body;

    if (form.accType == "userAcc") {

        const phoneNumber = parseInt(form.phone);

        if (!phoneNumber) {
            console.log("Invalid Phone Number Given!")
            return res.redirect('/auth/signup');
        }

        const user = await getUserByNumber(form.phone);

        if (user) {
            console.log('User already exists!');
            return res.redirect('/auth/signup');
        }

        if (form.password != form.confirmPassword) {
            console.log('Password Doesn\'t Match!');
            return res.redirect('/auth/signup');
        }

        const newUser = await signupUser(form);

        if (!newUser) {
            console.log('Failed to signup user!');
            return res.redirect('/auth/signup');
        }

        return res.redirect('/auth/login');

    } else {
        console.log(form);

        const phoneNumber = parseInt(form.phone);

        if (!phoneNumber) {
            console.log("Invalid Phone Number Given!")
            return res.redirect('/auth/signup');
        }

        const clinic = await getClinicByNumber(form.phone);

        if (clinic) {
            console.log('Clinic already exists!');
            return res.redirect('/auth/signup');
        }

        if (form.password != form.confirmPassword) {
            console.log('Password Doesn\'t Match!');
            return res.redirect('/auth/signup');
        }

        const newClinic = await createNewClinic(form);

        if (!newClinic) {
            console.log('Failed to signup user!');
            return res.redirect('/auth/signup');
        }

        return res.redirect('/auth/login');

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

        const user = await getUserByNumber(form.oldphone);
        
        if (!user) {
            res.redirect('/');
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