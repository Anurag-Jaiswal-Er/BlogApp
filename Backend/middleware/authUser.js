import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Authentication

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Middleware :", token);
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECERET_KEY);
    const user = (req.user = await User.findById(decode.userId));
    if (!user) {
      res.status(403).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error occuring in Authentication : ", +error);
    return res.status(401).json({ error: "User not authenticated" });
  }
};

// Authorization

export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: `User with give role ${req.user.role} not allowed` });
    }
    next();
  };
};
