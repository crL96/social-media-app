const router = require("express").Router();
const controller = require("../controllers/postsController");
const passport = require("../config/passport");
const commentsRouter = require("./comments");

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", controller.getFollowingPosts);
router.post("/", controller.createPost);

router.get("/:postId", controller.getPost);
router.delete("/:postId", controller.deletePost);

router.use("/:postId/comments", commentsRouter);

module.exports = router;
