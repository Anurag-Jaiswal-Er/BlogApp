import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const CreateTokenAndSaveCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECERET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  await User.findByIdAndUpdate(userId, { token });
  return token;
};
export default CreateTokenAndSaveCookies;