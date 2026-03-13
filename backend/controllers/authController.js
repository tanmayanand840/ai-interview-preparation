import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "../firebaseAdmin.js";

// 🔹 Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // 🔒 always user
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Google Login via Firebase
export const googleFirebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No idToken provided" });
    }

    if (!admin.apps.length) {
      return res
        .status(500)
        .json({ message: "Firebase not configured on server" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    if (!email) {
      return res.status(400).json({ message: "Firebase user has no email" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // create a user with a random hashed password just to satisfy schema
      const randomPassword = await bcrypt.hash(uid || email, 10);
      user = await User.create({
        name: name || email,
        email,
        password: randomPassword,
        role: "user",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google login via Firebase failed" });
  }
};
