const router = require("express").Router();
const controller = require("../controllers/postsController");
const passport = require("../config/passport");

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    controller.getFollowingPosts
);


module.exports = router;