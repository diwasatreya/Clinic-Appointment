import { getAllClinics, filterClinics } from "../services/clinics.services.js";

const showHomePage = async (req, res) => {

    const { search } = req.query;

    let clinics;

    if (search && search.length != 0) {
        clinics = await filterClinics(search);
    } else {
        clinics = await getAllClinics();
    }

    return res.render('index.ejs', { user: req.user, clinics });
}

const showTest = async (req, res) => {
    res.render('test.ejs');
}

export {
    showHomePage,
    showTest
}