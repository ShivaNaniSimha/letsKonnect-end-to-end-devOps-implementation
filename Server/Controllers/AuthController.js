import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// REGISTER new user
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "This user already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password.toString(), salt);

    // Create new user
    const newUser = new UserModel({
      ...req.body,
      password: hashedPass,
    });

    const user = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" } // Optional: token expiry
    );

    res.status(200).json({ user, token });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json("Sorry, wrong email or password!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json("Sorry, wrong email or password!");
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};
