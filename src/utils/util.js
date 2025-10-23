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

const generateJWT = (payload) => {
    const jwtSecretToken = process.env.JWT_SECRET;
    if (!jwtSecretToken) {
        throw new Error("No JWT Secret Token Provided!");
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
}

export {
    hashPassword,
    verifyHash,
    generateJWT,
    verifyJWT
}