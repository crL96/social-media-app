const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers/commentsController");

router.post("/", controller.createComment);

module.exports = router;