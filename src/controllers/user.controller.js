import { getAllClinics } from "../services/clinics.services.js";

const showHomePage = async (req, res) => {
    // if (!req.user) return res.redirect('/auth/login');
    const colors = ["red", "blue", "purple"];

    const clinics = await getAllClinics();
    res.render('index.ejs', { user: req.user, clinics, colors });
}

const showTest = async (req, res) => {
    res.render('test.ejs');
}

export {
    showHomePage,
    showTest
}