// index.js
const express = require("express");
const amqp = require("amqplib/callback_api");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const app = express();
app.use(bodyParser.json());

const QUEUE_NAME = "userQueue";
const rabbitmqHost = process.env.RABBITMQ_HOST || "localhost";
const rabbitmqPort = process.env.RABBITMQ_PORT || 5672;

amqp.connect(`amqp://${rabbitmqHost}:${rabbitmqPort}`, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }
    app.post(
      "/user",
      [
        check("name").notEmpty(),
        check("email").isEmail(),
        check("age").isInt({ min: 0 }),
      ],
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const user = req.body;
        const createAt = new Date();
        const updatedAt = new Date();
        user.createdAt = createAt;
        user.updatedAt = updatedAt;

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(user)));
        res
          .status(201)
          .json({ message: "User created successfully", id: user._id });
      }
    );

    app.listen(3000, () => {
      console.log("Node.js API service listening on port 3000");
    });
  });
});
