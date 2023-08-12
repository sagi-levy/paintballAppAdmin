require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1/paintball-activities")
  .then(() => console.log("connected to mongo"))
  .catch(() => console.log("could not connect to mongo"));

const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routes/usersRoute");
const authRouter = require("./routes/auth");
const cardAuth = require("./routes/card.auth");

const app = express();
app.use(cors());
app.use(morgan("dev"), express.json());
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/cards", cardAuth);

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
app.use(bodyParser.json());

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: "sagilevy1612@gmail.com",
    to: "sagilevy1612@example.com",
    subject: "New Email from Your React Form",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sagilevy1612@gmail.com",
      pass: "gnofeoeknyhgsmqp", // I will replace this with .env file
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully!");
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
