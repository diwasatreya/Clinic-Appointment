import User from '../models/user.model.js';

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const signupUser = async (form) => {
    const { firstName, lastName, email, role, password } = form;
    try {
        const user = new User(({
            firstName,
            lastName,
            email,
            role,
            password
        }));
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    getUserByEmail,
    signupUser
}