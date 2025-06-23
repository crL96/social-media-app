const router = require("express").Router();
const controller = require("../controllers/userController");
const passport = require("../config/passport");

router.use(passport.authenticate("jwt", { session: false }));

router.get("/profile", controller.getCurrentUserProfile);

router.put("/profile", controller.updateUserProfile);

router.get("/profile/:username", controller.getUserProfile);

router.get("/search/:searchterm", controller.searchUsers);

module.exports = router;
