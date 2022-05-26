const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// Middleware functions
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

app.use(express.json());
//The express.json() function is a built-in middleware that adds a body property to the request (req.body)
//The req.body request will contain the parsed data
//or it will return an empty object ({}) if there was no body to parse,
//the Content-Type wasn't matched, or an error occurred.

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

app.get("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", bodyHasTextProperty, (req, res) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;

  const newPaste = {
    id: ++lastPasteId, // Increment last ID, then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
});

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
