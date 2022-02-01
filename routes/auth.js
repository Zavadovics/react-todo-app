import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import validateRegisterInput from '../validation/registerValidation.js';
import jwt from 'jsonwebtoken';
import requiresAuth from '../middleware/permissions.js';
const router = express.Router();

// @route   GET /api/auth/test
// @desc    Test the auth route
// @access  Public
router.get('/test', (req, res) => {
  res.send(`Auth's route working`);
});

// @route   POST /api/auth/register
// @desc    Create a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // check for existing user
    const existingEmail = await User.findOne({
      email: new RegExp('^' + req.body.email + '$', 'i'),
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ error: 'There is already a user with this email' });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // create a new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    // save the user to db
    const savedUser = await newUser.save();

    const payload = { userId: savedUser._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('access-token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // remove password so it's not returned
    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;

    // return the new user
    return res.json(userToReturn);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return a access token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // check for the user
    const user = await User.findOne({
      email: new RegExp('^' + req.body.email + '$', 'i'),
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'There was a problem with your login credentials' });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: 'There was a problem with your login credentials' });
    }

    const payload = { userId: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('access-token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    return res.json({
      token: token,
      user: userToReturn,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(err.message);
  }
});

// @route   GET /api/auth/current
// @desc    Return the currently authed user
// @access  Private
router.get('/current', requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  return res.json(req.user);
});

// @route   PUT /api/auth/logout
// @desc    Logout the currently authed user
// @access  Public
router.put('/logout', requiresAuth, async (req, res) => {
  try {
    res.clearCookie('access-token');
    return res.json({ message: 'User has been logged out' });
  } catch (error) {
    console.log(error);
    return res.status(500).send(err.message);
  }

  return res.json(req.user);
});
export default router;
