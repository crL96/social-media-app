const router = require("express").Router();
const controller = require("../controllers/userController");
const passport = require("../config/passport");

router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    controller.getCurrentUserProfile
);

router.put(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    controller.updateUserProfile
);

router.get(
    "/profile/:username",
    passport.authenticate("jwt", { session: false }),
    controller.getUserProfile
);

module.exports = router;
