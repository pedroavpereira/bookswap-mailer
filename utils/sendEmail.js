const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmails = async (emails, item) => {
  // Define email options
  const mailOptions = {
    from: "your-email@gmail.com",
    to: emails.map((email) => `${email.email}`),
    subject: `Subject of your ${item.title}`,
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Error: ${error}`);
    }
    console.log(`Email sent: ${info.response}`);
  });
};

module.exports = sendEmails;
