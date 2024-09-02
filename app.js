const express = require("express");
const cors = require("cors");
const getBooksInWishlist = require("./utils/queryDB");
const sendEmails = require("./utils/sendEmail");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { user_id, radius, title } = req.query;
    //   const { book } = req.body;

    const emails = await getBooksInWishlist(user_id, title, radius);

    if (emails.length > 0) {
      console.log("email");
      sendEmails(emails, { title: "test" });
    }

    res.status(200).json({ message: "Emails sent" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = app;
