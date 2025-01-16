import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  try {
    console.log("Sending email to", { email, from: process.env.SMTP_FROM });
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Flow3 password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`,
      html: `
              <h1>Password Reset OTP</h1>
              <p>Your OTP for password reset is: <strong>${otp}</strong></p>
              <p>This OTP will expire in 5 minutes.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error("Error sending email");
  }
};
