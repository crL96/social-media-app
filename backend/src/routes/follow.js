const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers/followController");

router.post("/:username", controller.followUser);
router.delete("/:username", controller.unfollowUser);

module.exports = router;