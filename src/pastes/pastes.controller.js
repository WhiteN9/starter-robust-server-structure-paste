const pastes = require("../data/pastes-data");

function list(req, res) {
  res.json({ data: pastes });
}

function read(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({
      status: 400,
      message: `Paste id not found: ${pasteId}`,
    });
  }
}

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

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

function create(req, res) {
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
}

module.exports = {
  list,
  read,
  //create exports an array of
  //the middleware function bodyHasTextProperty()
  //and the create route handler.
  create: [bodyHasTextProperty, create],
};
