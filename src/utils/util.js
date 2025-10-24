import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
const hashPassword = async (password) => {
    return await argon2.hash(password);
}

const verifyHash = async (hashedCode, code) => {
    try {
        return await argon2.verify(hashedCode, code);
    } catch (error) {
        return false;
    }
}

const generateJWT = (payload, time = null) => {
    const jwtSecretToken = process.env.JWT_SECRET;
    if (!jwtSecretToken) {
        throw new Error("No JWT Secret Token Provided!");
    }

    if (time != null) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
    }

    return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyJWT = (token) => {
    const jwtSecretToken = process.env.JWT_SECRET;
    try {
        if (!jwtSecretToken) {
            throw new Error("No JWT Secret Token Provided!");
        }
        return jwt.verify(token, jwtSecretToken);
    } catch (error) {
        console.error(error);
        return null;
    }
};

function convertTime(time) {
    const units = {
        ms: 1,
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
        w: 1000 * 60 * 60 * 24 * 7,
    };

    const match = time.match(/^(\d+)(ms|s|m|h|d|w)$/i);
    if (!match) throw new Error("Invalid time format.");

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    return value * units[unit];
} ''

export {
    hashPassword,
    verifyHash,
    generateJWT,
    verifyJWT,
    convertTime
}