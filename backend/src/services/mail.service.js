import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import {
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
} from "../config/envConfig.js";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "TaskHive",
      link: "https://mailgen.js/",
      // Optional product logo
      // logo: 'https://mailgen.js/img/logo.png'
    },
  });

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(options.mailgenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

  //transporter
  const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
      user: MAILTRAP_USERNAME,
      pass: MAILTRAP_PASSWORD,
    },
  });

  //info
  const mailInfo = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailBody,
  };
  try {
    await transporter.sendMail(mailInfo);
  } catch (error) {
    console.log(error);
  }
};

const emailVerificationMailgenContent = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: "Welcome to TaskHive! We're very excited to have you on board.",
      action: {
        instructions: "To get started with our App , please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your Email",
          link: verificationURL,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
const forgotPasswordMailgenContent = (username, restPasswordURL) => {
  return {
    body: {
      name: username,
      intro: "We got request to reset your password !.",
      action: {
        instructions: "To change your password , please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset your password",
          link: verificationURL,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
