import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { worqClient } from "../db/worqdbClient";
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail"

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

    const safeEmail = email.replace(/'/g, "''");
    const getuser = `SELECT * FROM users WHERE email = '${safeEmail}'`;
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

(globalThis as any).otpStore = (globalThis as any).otpStore || {}

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // expires in 5 minutes

  try {
    await sendEmail(email, "Your OTP Code", `Your verification OTP is: ${otp} \n It will expires in 5 min` );

    // Store OTP + expiry in global
    (global as any).otpStore = (global as any).otpStore || {};
    (global as any).otpStore[email] = { otp, expiresAt, verified: false };

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  const storedOtpObj = (global as any).otpStore?.[email];

  if (!storedOtpObj) {
    res.status(400).json({ success: false, message: "No OTP found for this email" });
    return;
  }

  if (Date.now() > storedOtpObj.expiresAt) {
    res.status(400).json({ success: false, message: "OTP has expired" });
    delete (global as any).otpStore[email];
    return;
  }

  if (storedOtpObj.otp !== otp) {
    res.status(400).json({ success: false, message: "Invalid OTP" });
    return;
  }

  (global as any).otpStore[email].verified = true;

  res.status(200).json({ success: true, message: "OTP verified successfully" });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  const storedOtpObj = (global as any).otpStore?.[email];

  if (!storedOtpObj || !storedOtpObj.verified) {
    res.status(400).json({ success: false, message: "OTP not verified or expired" });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const query = `UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}'`;

  try {
    await worqClient(query);

    // Clear OTP after reset
    delete (global as any).otpStore[email];

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to reset password", error: error.message });
  }
};

