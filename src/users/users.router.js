const router = require("express").Router({ mergeParams: true });
const controller = require("./users.controller");
const pasteRouter = require("../pastes/pastes.router");
const methodNotAllowed = require("../pastes/pastes.router");

router.use("/:userId/pastes", controller.userExists, pasteRouter);

router.route("/:userId").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
