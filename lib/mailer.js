const nodemailer = require("nodemailer");
require("dotenv").config();
const CustomError = require("../lib/customError");
// const Error = require('../lib/error');
const { EMAIL_USER, EMAIL_PASS} = process.env;

exports.sendMail = async (msg, subject, receiver) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,  
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: '"Twitee" <victoriataiwo1998@gmail.com>',
      subject: subject,
      html: msg,
      to: receiver,
    });

    return `Message sent', ${nodemailer.getTestMessageUrl(info)}`;
  } catch (err) {
    console.log(err);
    return new CustomError(500, "Server Error");
}
};
