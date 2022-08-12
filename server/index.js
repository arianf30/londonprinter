const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const PORT = 5636;

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const printersRouter = require("./router/printers");

app.use("/api/printers", printersRouter);

const server = app.listen(PORT, () => {
  console.log("Server in port", PORT);
});

module.exports = server;
