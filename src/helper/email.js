const nodemailer = require("nodemailer");

// let SMTP_EMAIL=
// let SMTP_PASS=
// let SMTP_SERVER=
// let SMTP_PORT=587

module.exports = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "cloudsmtptest440@gmail.com", 
    pass: "cloud@Email22" 
  }
});