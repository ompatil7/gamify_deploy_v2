import nodemailer from "nodemailer";

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
        path: "https://gamify-deploy-v2.onrender.com/public/images/welcomeGamer.jpg", // Adjust the path to your image
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
