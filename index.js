require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Mailer listening on port ${port}`);
});
