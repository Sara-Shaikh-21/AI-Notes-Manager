// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "No token" });
    }

    const token = header.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // Attach as req.user to match notes.js usage
        req.user = { id: payload.userId };
        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default authMiddleware;
