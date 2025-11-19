import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
        expiresIn: "7d",
    });

    return token;
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_TOKEN);
    } catch (err) {
        return null;
    }
}