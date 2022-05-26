const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

const pastesRouter = require("./pastes/pastes.router");

app.use(express.json());
//The express.json() function is a built-in middleware that adds a body property to the request (req.body)
//The req.body request will contain the parsed data
//or it will return an empty object ({}) if there was no body to parse,
//the Content-Type wasn't matched, or an error occurred.

app.use("/pastes", pastesRouter);

app.get("/pastes/:pasteId", pastesRouter);

// Not found handler
app.use((request, response, next) => {
  response.status(400).send(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  //1
  //response.status(400).send(error);
  //2
  //different error will set different status code prior;
  //response.status(error.status).send(error.message);
  //3
  //destructure it with default values;
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});

module.exports = app;
