const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers/followController");

router.get("/", controller.getFollowList);

router.get("/:username", controller.getFollowListByName);
router.post("/:username", controller.followUser);
router.delete("/:username", controller.unfollowUser);

module.exports = router;