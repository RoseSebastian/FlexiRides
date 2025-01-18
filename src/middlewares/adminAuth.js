import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "User not autherized", success: false });
        }
        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);        
        if (!tokenVerified) {
            return res.status(401).json({ message: "User not autherized", success: false });
        }
        if(tokenVerified.role != 'dealer' && tokenVerified.role !='admin'){
            return res.status(401).json({ message: "user not autherized", success: false });
        }
        req.loggedInUser = tokenVerified;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "user autherization failed", success: false });
    }
};