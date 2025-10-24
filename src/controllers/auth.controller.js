import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/constant.js";
import { createSession, getUserByEmail, signupUser } from "../services/auth.services.js";
import { convertTime, generateJWT, verifyHash } from "../utils/util.js";

const getLoginPage = (req, res) => {
    return res.render('userAuth/login.ejs');
}

const getSignupPage = (req, res) => {
    return res.render('userAuth/signup.ejs');
}

const postLoginPage = async (req, res) => {
    const form = req.body;

    const user = await getUserByEmail(form.email);

    if (!user) {
        console.log("User Doesn\'t exists");
        return res.redirect('/auth/login');
    };

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

    const accessToken = generateJWT({ id: user._id.toString(), sid: session._id.toString() }, ACCESS_TOKEN_EXPIRE);
    const refreshToken = generateJWT({ sid: session._id.toString() }, REFRESH_TOKEN_EXPIRE);

    res.cookie("accessToken", accessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE) });
    res.cookie("refreshToken", refreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE) });

    return res.redirect('/');
}

const postSignupPage = async (req, res) => {
    const form = req.body;

    const user = await getUserByEmail(form.email);

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
}

export {
    getLoginPage,
    getSignupPage,
    postLoginPage,
    postSignupPage
}