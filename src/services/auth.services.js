import User from '../models/user.model.js';
import { generateJWT, hashPassword, verifyJWT } from '../utils/util.js';
import Session from '../models/session.model.js';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from '../config/constant.js';

const getUserByNumber = async (number) => {
    try {
        const user = await User.findOne({ number });
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};


const signupUser = async (form) => {
    const { firstName, lastName, number, password } = form;
    const hashedPassword = await hashPassword(password);
    try {
        const user = new User(({
            firstName,
            lastName,
            number,
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
    }
}


const generateNewToken = async (token) => {
    try {
        const decodedRefreshToken = verifyJWT(token);

        const session = await Session.findById(decodedRefreshToken.sid);
        if (!session) throw new Error("No Session Avaiable!");

        const user = await User.findById(session.userId);
        if (!user) throw new Error("No User Found!");

        const newUser = { id: user._id.toString(), username: user.firstName + ' ' + user.lastName, sid: session._id.toString() };

        const newAccessToken = generateJWT(newUser, ACCESS_TOKEN_EXPIRE);
        const newRefreshToken = generateJWT({ sid: session._id.toString() }, REFRESH_TOKEN_EXPIRE);


        return {
            newAccessToken,
            newRefreshToken,
            newUser
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    getUserByNumber,
    signupUser,
    createSession,
    generateNewToken
}