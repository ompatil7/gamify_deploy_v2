import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: "jvzs abqf wgms wrpm",
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "welcomeGamer.jpg",
        path: path.join(__dirname, "public", "images", "welcomeGamer.jpg"), // Local path to your image
        cid: "welcome-gamer", // Same CID as used in the HTML
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
