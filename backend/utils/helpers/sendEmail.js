import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import path from "path";
// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emailTemplatePath = path.join(
  __dirname,
  "../../emails/welcomeTemplate.html"
);
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
        path: emailTemplatePath, // Local path
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
