const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers/commentsController");
const auth = require("../middleware/auth");

router.post("/", controller.createComment);

router.delete("/:commentId", auth.checkCommentAuth, controller.deleteComment);

module.exports = router;