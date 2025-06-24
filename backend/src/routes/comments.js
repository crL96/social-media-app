const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers/commentsController");

router.post("/", controller.createComment);

router.delete("/:commentId", controller.deleteComment);

module.exports = router;