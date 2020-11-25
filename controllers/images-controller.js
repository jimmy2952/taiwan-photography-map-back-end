const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_IMAGES = [
  {
    id: "p1",
    imageTitle: "九份不厭亭1",
    imageDescription: "新北最適合拍照的地方。",
    imageCategory: "風景",
    imageCityLocation: "新北市",
    imageDistrictLocation: "瑞芳區",
    imageScapeName: "九份",
    creator: "u1"
  },
  {
    id: "p2",
    imageTitle: "九份不厭亭2",
    imageDescription: "新北最適合拍照的地方。",
    imageCategory: "風景",
    imageCityLocation: "新北市",
    imageDistrictLocation: "瑞芳區",
    imageScapeName: "九份",
    creator: "u1"
  },
  {
    id: "p3",
    imageTitle: "林家花園",
    imageDescription: "新北第二適合拍照的地方。",
    imageCategory: "風景",
    imageCityLocation: "新北市",
    imageDistrictLocation: "板橋區",
    imageScapeName: "林家花園",
    creator: "u2"
  },
  {
    id: "p4",
    imageTitle: "金針花海",
    imageDescription: "花蓮秘境。",
    imageCategory: "風景",
    imageCityLocation: "花蓮縣",
    imageDistrictLocation: "玉里鎮",
    imageScapeName: "赤柯山",
    creator: "u3"
  },
];

const getScapesByCity = (req, res, next) => {
  const cityName = req.params.cityName

  const city = DUMMY_IMAGES.filter((image) => {
    return image.imageCityLocation === cityName
  })

  if (!city || city.length === 0) {
    return next(
      new HttpError("該城市目前還沒有照片哦！", 404)
    );
  }
  res.json({ city });
}

const getImagesByScape = (req, res, next) => {
  const cityName = req.params.cityName
  const scapeName = req.params.scapeName

  res.json({ cityName, scapeName })
}

const addImage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("請檢查必填欄位", 422)
    );
  }
  const { imageTitle, imageDescription, imageCategory, imageCityLocation, imageDistrictLocation, imageScapeName } = req.body
  const newImage = {
    id: uuid(),
    imageTitle,
    imageDescription,
    imageCategory,
    imageCityLocation,
    imageDistrictLocation,
    imageScapeName
  }
  DUMMY_IMAGES.push(newImage)
  res.status(201).json({ image: newImage });
}




exports.getScapesByCity = getScapesByCity
exports.getImagesByScape = getImagesByScape
exports.addImage = addImage