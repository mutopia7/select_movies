const { Router } = require("express");
const router = Router();
const controller = require("../controllers/controller")

router.get("/", controller.renderHome)

module.exports = router;