const router = require("express").Router();
const controller = require("./pastes.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:pasteId").get(controller.read);

module.exports = router;
