const router = require("express").Router();
const controller = require("../controllers/authController");

router.post("/sign-up", controller.createUser);

module.exports = router;