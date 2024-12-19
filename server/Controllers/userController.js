const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: '3d' });
};

//Registering
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json('User is already exist...');

    if (!name || !email || !password)
      return res.status(400).json('All fields are required');

    if (!validator.isEmail(email))
      return res.status(400).json('Email must be a valid email');

    if (!validator.isStrongPassword(password))
      return res.status(400).json('Password must be a strong password');

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//Logging in
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login Request Body:', req.body);
  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json('Invalid email or password');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json('Invalid email or passowrd');

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//finding a  user
const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//Getting all the user
const getUsers = async (req, res) => {
  try {
    const user = await userModel.find();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
