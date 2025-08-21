const { Router } = require("express");
const router = Router();
const controller = require("../controllers/controller")

router.get("/", controller.renderHome);
router.get("/movie/:id", controller.renderDetail)
router.get("/actors", controller.renderActors)

module.exports = router;