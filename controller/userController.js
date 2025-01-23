const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config(); 
const User = require("../model/userModel");



exports.register = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, name, password: hashedPassword }); 
    await newUser.save();

    const payload = { id: newUser._id, email: newUser.email };
    const token = jwt.sign(payload, process.env.USER_JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: "Account created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during registration" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.USER_JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login" });
  }
};
