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
        const decodedRefreshToken = verifyJWT(token);

        const session = await Session.findById(decodedRefreshToken.sid);
        if (!session) throw new Error("No Session Avaiable!");

        let newUser;
        let newAccessToken;
        let newRefreshToken;
        if (decodedRefreshToken.role == "user") {
            const user = await User.findById(session.userId);
            if (!user) throw new Error("User not found!");
            newUser = { id: user._id.toString(), username: user.firstName + ' ' + user.lastName, sid: session._id.toString(), phone: user.phone, role: "user" };
            newAccessToken = generateJWT(newUser, ACCESS_TOKEN_EXPIRE);
            newRefreshToken = generateJWT({ sid: session._id.toString(), role: "user" }, REFRESH_TOKEN_EXPIRE);
        } else {
            const clinic = await Clinic.findById(session.userId);
            if (!clinic) throw new Error("Clinic not found!");
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
        console.error(error);
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
            password: hashedPassword
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
        const phoneNumber = parseInt(form['phone-number']);
        if (!phoneNumber || isNaN(phoneNumber)) {
            return null;
        }

        const existingUser = await User.findOne({
            phone: phoneNumber,
            _id: { $ne: userObj._id },
        });

        if (existingUser) return null;

        const user = await User.findById(userObj._id);
        if (!user) return null;

        user.firstName = form['first-name'];
        user.lastName = form['last-name'];
        user.phone = phoneNumber;
        user.address = form.address;

        await user.save();

        return user;
    } catch (error) {
        console.error(error);
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
    updateUserData
}