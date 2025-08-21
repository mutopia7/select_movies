const { Router } = require("express");
const router = Router();
const controller = require("../controllers/controller")

router.get("/", controller.renderHome);
router.get("/movie/:id", controller.renderDetail)
router.get("/actors", controller.renderActors)
router.get("/genres", controller.renderGenres)

module.exports = router;