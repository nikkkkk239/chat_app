import User from "../models/user.model.js"
import { verifyToken } from "../lib/utils.js"

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized request - No token." })
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protect route component : ", error);
        return res.status(500).json({ message: "Internal server error." })
    }
}