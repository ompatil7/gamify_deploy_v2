import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjusts for cross-site requests
  });

  return token;
};

// const generateTokenAndSetCookie = (userId, res) => {
//   //creating payload
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });

//   //seting cookie
//   res.cookie("jwt", token, {
//     httpOnly: true, //so that this cookie cannot be accessed by browser and js so makes it more secure
//     maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
//     sameSite: "strict", //for CSRF attacks (security vulnerability) makin more secure
//   });

//   return token;
// };

export default generateTokenAndSetCookie;
