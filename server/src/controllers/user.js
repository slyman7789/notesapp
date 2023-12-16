import { isValidObjectId } from "mongoose";
import User from "../model/user.model.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import generateToken from "../config/generateToken.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw createHttpError(400, "Form fields is missing");
    }
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      throw createHttpError(
        409,
        "username already taken, please choose a new one"
      );
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      throw createHttpError(
        409,
        "Email has already been used, please use another email"
      );
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    const user = await User.create({
      username: username,
      email: email,
      password: passwordHashed,
    });
    const access_token = generateToken(user.id);
    res
      .status(201)
      .json({ access_token, msg: "user registration successfull" });
  } catch (error) {
    next(error);
  }
};

// login process
export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw createHttpError(400, "Form fields is missing");
    }
    const user = await User.findOne({ username: username }).select(
      " +password"
    );
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid password");
    }
    const access_token = generateToken(user.id);
    res.status(200).json({ access_token, msg: "Login successfull" });
  } catch (error) {
    next(error);
  }
};

export const getAuthUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
