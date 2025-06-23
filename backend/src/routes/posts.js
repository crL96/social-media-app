const router = require("express").Router();
const controller = require("../controllers/postsController");
const passport = require("../config/passport");

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    controller.getFollowingPosts
);

router.get(
    "/:postId",
    passport.authenticate("jwt", { session: false }),
    controller.getPost
);


module.exports = router;