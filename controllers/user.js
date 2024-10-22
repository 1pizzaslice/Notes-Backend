const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

const SALT_ROUNDS = 10;

async function handleUserSignup(req, res) {
  const { name, email, password, isAdmin } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    await User.create({
      name,
      email,
      password: hashedPassword, // save hashed password
      isAdmin
    });
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false, 
        error: "Invalid Username or Password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false, 
        error: "Invalid Username or Password",
      });
    }

    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);

    return res.status(200).json({
      success: true,
      data:{id: user._id , sessionId},
      message: "User logged in successfully",
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};