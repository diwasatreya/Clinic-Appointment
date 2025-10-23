import User from '../models/user.model.js';
import { hashPassword } from '../utils/util.js';

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
    const hashedPassword = await hashPassword(password);
    try {
        const user = new User(({
            firstName,
            lastName,
            email,
            role,
            password: hashedPassword
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