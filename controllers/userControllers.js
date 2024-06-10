const asyncHandler = require("express-async-handler");
const User = require("../schema/userModel");
const generateToken = require("../config/generateToken");

const fs = require("fs");
const allUsers = asyncHandler(async (req, res) => {
  const keyboard = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyboard).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let userPic = null;
  if (req.file) {
    userPic = {
      name: req.file.originalname,
      data: fs.readFileSync(req.file.path),
    };
  }

  const user = await User.create({
    name,
    email,
    password,
    userPic: userPic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or password");
  }
});

const getUserPic = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.userPic.data) {
      return res.status(404).json({ message: "User or picture not found" });
    }

    // res.set("Content-Type", "image/jpeg");
    res.send(user.userPic.data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  getUserPic,
};
