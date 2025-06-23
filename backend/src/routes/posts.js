const router = require("express").Router();
const controller = require("../controllers/postsController");
const passport = require("../config/passport");

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", controller.getFollowingPosts);

router.get("/:postId", controller.getPost);

module.exports = router;
