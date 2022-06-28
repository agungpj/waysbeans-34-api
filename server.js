const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const router = require("./src/routes");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/", router);

app.get("/", function (req, res) {
  res.send({
    message: "Hello World",
    CLIENT_URL: process.env.CLIENT_URL,
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
