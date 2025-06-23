const router = require("express").Router();
const controller = require("../controllers/postsController");
const passport = require("../config/passport");
const commentsRouter = require("./comments");

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", controller.getFollowingPosts);

router.get("/:postId", controller.getPost);

router.use("/:postId/comments", commentsRouter);

module.exports = router;
