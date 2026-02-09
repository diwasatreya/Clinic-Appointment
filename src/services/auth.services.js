import User from '../models/user.model.js';
import Clinic from '../models/clinic.model.js';
import { generateJWT, hashPassword, verifyJWT } from '../utils/util.js';
import Session from '../models/session.model.js';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from '../config/constant.js';

const getUserByNumber = async (phone) => {
    try {
        const user = await User.findOne({ phone });
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};


const signupUser = async (form) => {
    const { firstName, lastName, phone, password } = form;
    const hashedPassword = await hashPassword(password);
    try {
        const user = new User(({
            firstName,
            lastName,
            phone,
            password: hashedPassword
        }));
        await user.save();
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const createSession = async (info) => {
    try {
        const session = new Session({
            userId: info.userId,
            userAgent: info.userAgent,
        });
        await session.save();

        return session;
    } catch (error) {
        console.error(error);
        return null;
    }
}


const generateNewToken = async (token) => {
    try {
        if (!token) {
            console.error('generateNewToken: No refresh token provided');
            return null;
        }

        const decodedRefreshToken = verifyJWT(token);

        if (!decodedRefreshToken) {
            console.error('generateNewToken: Invalid or expired refresh token');
            return null;
        }

        const session = await Session.findById(decodedRefreshToken.sid);
        if (!session) {
            console.error('generateNewToken: Session not found for sid:', decodedRefreshToken.sid);
            return null;
        }

        let newUser;
        let newAccessToken;
        let newRefreshToken;

        if (decodedRefreshToken.role == "user") {
            const user = await User.findById(session.userId);
            if (!user) {
                console.error('generateNewToken: User not found for userId:', session.userId);
                return null;
            }
            newUser = { id: user._id.toString(), username: user.firstName + ' ' + user.lastName, sid: session._id.toString(), phone: user.phone, role: "user" };
            newAccessToken = generateJWT(newUser, ACCESS_TOKEN_EXPIRE);
            newRefreshToken = generateJWT({ sid: session._id.toString(), role: "user" }, REFRESH_TOKEN_EXPIRE);
        } else if (decodedRefreshToken.role == "admin") {
            newUser = { id: 'admin', username: 'Admin', sid: session._id.toString(), phone: 0, role: "admin" };
            newAccessToken = generateJWT(newUser, ACCESS_TOKEN_EXPIRE);
            newRefreshToken = generateJWT({ sid: session._id.toString(), role: "admin" }, REFRESH_TOKEN_EXPIRE);
        } else {
            const clinic = await Clinic.findById(session.userId);
            if (!clinic) {
                console.error('generateNewToken: Clinic not found for userId:', session.userId);
                return null;
            }
            newUser = { id: clinic._id.toString(), username: clinic.clinicName, sid: session._id.toString(), phone: clinic.phone, role: "clinic" };
            newAccessToken = generateJWT(newUser, ACCESS_TOKEN_EXPIRE);
            newRefreshToken = generateJWT({ sid: session._id.toString(), role: "clinic" }, REFRESH_TOKEN_EXPIRE);
        }

        return {
            newAccessToken,
            newRefreshToken,
            newUser
        }
    } catch (error) {
        console.error('generateNewToken: Error generating new tokens:', error);
        return null;
    }
};

const getClinicByNumber = async (phone) => {
    try {
        const clinic = await Clinic.findOne({ phone });
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getClinicByEmail = async (email) => {
    try {
        const clinic = await Clinic.findOne({ email: email.trim().toLowerCase() });
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const createNewClinic = async ({ clinicName, email, phone, address, password }) => {
    const hashedPassword = await hashPassword(password);
    try {
        const clinic = new Clinic({
            clinicName,
            email: email.trim().toLowerCase(),
            phone,
            address,
            password: hashedPassword,
            approved: false // New clinics need to request approval
        });
        await clinic.save();
        return clinic;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const updateUserData = async (userObj, form) => {
    try {
        const user = await User.findById(userObj._id);
        if (!user) {
            console.error('updateUserData: User not found');
            return null;
        }

        // Update only allowed fields (phone number cannot be changed)
        user.firstName = form['first-name'];
        user.lastName = form['last-name'];
        user.address = form.address;
        // Note: phone number is intentionally NOT updated to prevent changes

        await user.save();

        return user;
    } catch (error) {
        console.error('updateUserData: Error updating user data:', error);
        return null;
    }
}

export {
    getUserByNumber,
    signupUser,
    createSession,
    generateNewToken,
    getClinicByNumber,
    getClinicByEmail,
    createNewClinic,
    updateUserData,
    getUserById
}