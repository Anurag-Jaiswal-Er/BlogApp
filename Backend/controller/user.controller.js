import { User } from "../models/user.model.js";

const register = async (req, res) => {
  const { email, name, password, phone, education, role } = req.body;
  if (!email || !name || !password || !phone || !education || !role) {
    return req.status(400).json({ message: "Please fill the Required Field" });
  }
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }
  const newuser = new User({ email, name, password, phone, education, role });
  await newuser.save();
  if (newuser) {
    res.status(400).json({ message: "user registerd successfully" });
  }
};

export default register;
