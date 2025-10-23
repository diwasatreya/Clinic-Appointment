import { getUserByEmail, signupUser } from "../services/auth.services.js";

const getLoginPage = (req, res) => {
    return res.render('userAuth/login.ejs');
}

const getSignupPage = (req, res) => {
    return res.render('userAuth/signup.ejs');
}

const postLoginPage = async (req, res) => {
    const form = req.body;

    const user = await getUserByEmail(form.email);

    if(!user) {
        console.log("User Doesnt exists");
        return res.redirect('/auth/login');
    };

    return res.redirect('/auth/login');
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

    return res.redirect('/auth/signup');
}

export {
    getLoginPage,
    getSignupPage,
    postLoginPage,
    postSignupPage
}