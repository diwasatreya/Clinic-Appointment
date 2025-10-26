const showHomePage = (req, res) => {
    if (!req.user) return res.redirect('/auth/login');

    res.render('index.ejs', { user: req.user });
}

export {
    showHomePage
}