import { getUserByEmail, signupUser } from "../services/auth.services.js";
import { generateJWT, verifyHash } from "../utils/util.js";

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

    const accessToken = generateJWT({ id: user._id.toString() });

    res.cookie("accessToken", accessToken);

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