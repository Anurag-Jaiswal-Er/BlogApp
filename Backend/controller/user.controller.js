import { User } from "../models/user.model.js";

const register = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "User Photo is Required" });
  }
  const { photo } = req.files;
  const allowedFormats = ["jpg", "png"];
  if (!allowedFormats.includes(photo.mimetype)) {
    return res
      .status(400)
      .json({ message: "Invalid photo format. Only jpg and png are allowed" });
  }
  const { email, name, password, phone, education, role } = req.body;
  if (!email || !name || !password || !phone || !education || !role || !photo) {
    return req.status(400).json({ message: "Please fill the Required Field" });
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
  const newuser = new User({
    email,
    name,
    password,
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
    res.status(400).json({ message: "user registerd successfully" });
  }
};

export default register;
