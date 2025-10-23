import { verifyJWT } from "../utils/util.js";

const useAuth = async (req, res, next) => {

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        req.user = null;
        return next();
    }

    const decodeAccessToken = verifyJWT(accessToken);

    if (!decodeAccessToken) {
        req.user = null;
        return next();
    }

    req.user = decodeAccessToken;
    return next();
}


export default useAuth;