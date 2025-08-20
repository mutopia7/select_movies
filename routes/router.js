const { Router } = require("express");
const router = Router();
const controller = require("../controllers/controller")

router.get("/", controller.renderHome);
router.get("/movie/:id", controller.renderDetail)

module.exports = router;