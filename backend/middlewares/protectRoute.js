import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
//next for running the next function after successsfull completions
const protectRoute = async (req, res, next) => {
  try {
    console.log("Cookies received: ", req.headers); // Log all cookies

    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password"); //same in payload, - cause do not wan to return password

    req.user = user;
    //inside req obj we are adding user field which we just got from the database

    //calling next function
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in protectRoute ", error.message);
  }
};

export default protectRoute;

// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
// //next for running the next function after successsfull completions
// const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) return res.status(401).json({ error: "Unauthorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId).select("-password"); //same in payload, - cause do not wan to return password

//     req.user = user;
//     //inside req obj we are adding user field which we just got from the database

//     //calling next function
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       res.clearCookie("jwt", { httpOnly: true, sameSite: "strict" });
//       return res.status(401).json({ error: "Token expired" });
//     }
//     res.status(401).json({ error: "Invalid token" });
//     console.log("Error in protectRoute ", error.message);
//   }
// };

// export default protectRoute;
