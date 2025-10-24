import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../config/constant.js";
import { generateNewToken } from "../services/auth.services.js";
import { convertTime, verifyJWT } from "../utils/util.js";

const useAuth = async (req, res, next) => {

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
        req.user = null;
        return next();
    }

    if (!accessToken) {

        const { newAccessToken, newRefreshToken, userId } = await generateNewToken(refreshToken);

        res.cookie("accessToken", newAccessToken, { maxAge: convertTime(ACCESS_TOKEN_EXPIRE) });
        res.cookie("refreshToken", newRefreshToken, { maxAge: convertTime(REFRESH_TOKEN_EXPIRE) });

        req.user = userId;
        return next();
    }

    const decodeAccessToken = verifyJWT(accessToken);
    req.user = decodeAccessToken.id;
    return next();
}

export default useAuth;