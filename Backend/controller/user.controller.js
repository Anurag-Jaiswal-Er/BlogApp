import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import CreateTokenAndSaveCookies from "../jwt/AuthToken.js";
import bcrypt from "bcryptjs";
const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User Photo is Required" });
    }
    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg and png are allowed",
      });
    }
    const { email, name, password, phone, education, role } = req.body;
    if (
      !email ||
      !name ||
      !password ||
      !phone ||
      !education ||
      !role ||
      !photo
    ) {
      return req
        .status(400)
        .json({ message: "Please fill the Required Field" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const uploadResult = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!uploadResult || uploadResult.error) {
      console.log(uploadResult.error);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      email,
      name,
      password: hashPassword,
      phone,
      education,
      role,
      photo: {
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      },
    });
    await newuser.save();
    if (newuser) {
      const token = await CreateTokenAndSaveCookies(newuser._id, res);
      res.status(400).json({
        message: "user registerd successfully",
        newuser,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server" });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill the required field" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user.password) {
      return res.status(400).json({ message: "User Password is missing" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `Given role ${role} not found` });
    }

    const token = await CreateTokenAndSaveCookies(user._id, res);
    res.status(200).json({
      message: "User logged in successsfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({ message: "Interal server Error" });
  }
};

export default register;
