// const { getUser } = require("../service/auth");

// async function restrictToLoggedinUserOnly(req, res, next) {
//   const userUid = req.cookies?.uid;

//   if (!userUid) {
//     return res.status(401).json({
//         success: false,
//         message: "User not logged in",
//     });
// }

//   const user = getUser(userUid);

//   if (!user) {
//     return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//     });
// }

//   req.user = user;
//   next();
// }

// async function checkAuth(req, res, next) {
//   const userUid = req.cookies?.uid;

//   const user = getUser(userUid);

//   req.user = user;
//   next();
// }

// module.exports = {
//   restrictToLoggedinUserOnly,
//   checkAuth,
// };

const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "User not logged in",
    });
  }

  const sessionId = authHeader.split(' ')[1]; // Extract session ID from Bearer token
  
  const user = getUser(sessionId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const sessionId = authHeader.split(' ')[1]; // Extract session ID from Bearer token
  
  const user = getUser(sessionId);
  
  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
};
