const express = require("express");
const { check } = require("express-validator");

const imagesController = require("../controllers/images-controller");
const fileUpload = require("../middleware/file-upload")
const checkAuth = require("../middleware/check-auth")

const router = express.Router();

router.get("/:cityName", imagesController.getScapesByCity);
router.get("/:cityName/:scapeName", imagesController.getImagesByScape);

router.use(checkAuth)

router.post(
  "/",
  fileUpload.single("image"),
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