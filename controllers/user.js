const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password ,isAdmin} = req.body;
  await User.create({
    name,
    email,
    password,
    isAdmin
  });
  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.json({
        success: false, 
        error: "Invalid Username or Password",
    });
  }

  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie("uid", sessionId);
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
  });
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};