const express = require("express");
const { check } = require("express-validator");

const imagesController = require("../controllers/images-controller");

const router = express.Router();

router.get("/:cityName", imagesController.getScapesByCity);
router.get("/:cityName/:scapeName", imagesController.getImagesByScape);

router.post(
  "/",
  [
    check("imageTitle").not().isEmpty(),
    check("imageCategory").not().isEmpty(),
    check("imageCityLocation").not().isEmpty(),
    check("imageDistrictLocation").not().isEmpty(),
    check("imageScapeName").not().isEmpty()
  ],
  imagesController.addImage
);

module.exports = router;