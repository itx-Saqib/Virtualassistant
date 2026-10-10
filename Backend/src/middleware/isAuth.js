const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
   

    

    const token = req.cookies?.token;

    if (!token) {
      

      return res.status(401).json({
        message: "No token found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

   

    req.userId = decoded.userId;

    next();

  } catch (error) {
  

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = isAuth;