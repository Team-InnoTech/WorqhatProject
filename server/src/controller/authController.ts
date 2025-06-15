import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { worqClient } from "../db/worqdbClient";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }

    const result = await worqClient(`select * from users where email = '${email}'`);
    const userCheck = result.data || [];
    if (userCheck.length > 0) {
        res.status(400).json({ message: "User already exists." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `Insert into users (username, email, password) values ('${username}', '${email}', '${hashedPassword}')`;

    try {
        const result = await worqClient(query);
        console.log(result);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const getuser = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await worqClient(getuser);
    const user = result.data?.[0];
    console.log(user);

    if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(user.password);
    if (!isMatch) {
        res.status(400).json({ message: "Invalid password" });
        return;
    }

    const token = jwt.sign({ id: user.documentId, email: user.email }, JWT_SECRET as string, { expiresIn: '1d' });

    res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user.documentId, username: user.username, email: user.email },
    });
};

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    res.status(200).json({ message: "Authenticated user", user });
};