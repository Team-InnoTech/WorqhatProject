import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET;

// if (!JWT_SECRET) {
//     throw new Error("JWT_SECRET is not defined in environment variables.");
// }

export const verifyToken = (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        req.user = decoded;
        console.log("Authenticated user:", decoded);
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};
