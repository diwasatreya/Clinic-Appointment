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
};

const parseDateTime = (str) => {
    // Example input: "2025-11-22 1:00 PM"
    const match = str.match(
        /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!match) {
        console.warn("Invalid date format:", str);
        return null;
    }

    const [_, datePart, hourStr, minuteStr, meridian] = match;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    // Convert 12-hour → 24-hour format
    if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Create local Date (not UTC)
    const [year, month, day] = datePart.split("-").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0);

    return date;
};

export {
    hashPassword,
    verifyHash,
    generateJWT,
    verifyJWT,
    convertTime,
    parseDateTime
}