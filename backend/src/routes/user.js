const router = require("express").Router();
const controller = require("../controllers/userController");
const passport = require("../config/passport");

router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    controller.getCurrentUserProfile
);

module.exports = router;
