const getLoginPage = (req, res) => {
    return res.render('userAuth/login.ejs');
}

const getSignupPage = (req, res) => {
    return res.render('userAuth/signup.ejs');
}

const postLoginPage = (req, res) => {
    console.log(req.body);
    return res.redirect('/auth/login');
}

const postSignupPage = (req, res) => {
    console.log(req.body);
    return res.redirect('/auth/signup');
}

export {
    getLoginPage,
    getSignupPage,
    postLoginPage,
    postSignupPage
}