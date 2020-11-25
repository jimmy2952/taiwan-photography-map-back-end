const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Image = require("../models/image");

let DUMMY_IMAGES = [
  {
    id: "p1",
    imageTitle: "九份不厭亭1",
    imageDescription: "新北最適合拍照的地方。",
    imageCategory: "風景",
    imageCityLocation: "新北市",
    imageDistrictLocation: "瑞芳區",
    imageScapeName: "九份",
    creator: "u1",
  },
  {
    id: "p2",
    imageTitle: "九份不厭亭2",
    imageDescription: "新北最適合拍照的地方。",
    imageCategory: "風景",
    imageCityLocation: "新北市",
    imageDistrictLocation: "瑞芳區",
    imageScapeName: "九份",
    creator: "u1",
  },
  {
    id: "p3",
    imageTitle: "林家花園",
    imageDescription: "新北第二適合拍照的地方。",
    imageCategory: "風景",
    imageCityLocation: "新北市",
    imageDistrictLocation: "板橋區",
    imageScapeName: "林家花園",
    creator: "u2",
  },
  {
    id: "p4",
    imageTitle: "金針花海",
    imageDescription: "花蓮秘境。",
    imageCategory: "風景",
    imageCityLocation: "花蓮縣",
    imageDistrictLocation: "玉里鎮",
    imageScapeName: "赤柯山",
    creator: "u3",
  },
];

const getScapesByCity = async (req, res, next) => {
  const cityName = req.params.cityName;

  let scapes;
  try {
    scapes = await Image.find({ imageCityLocation: cityName });
  } catch (err) {
    const error = new HttpError("伺服器錯誤，請稍後再試。", 500);
    return next(error);
  }

  if (!scapes || scapes.length === 0) {
    return next(new HttpError("該城市目前還沒有照片哦！", 404));
  }
  res.json({
    scapes: scapes.map((scape) => scape.toObject({ getters: true })),
  });
};

const getImagesByScape = async (req, res, next) => {
  const cityName = req.params.cityName;
  const scapeName = req.params.scapeName;

  let images;
  try {
    images = await Image.find({
      imageCityLocation: cityName,
      imageScapeName: scapeName,
    });
  } catch (err) {
    const error = new HttpError("伺服器錯誤，請稍後再試。", 500);
    return next(error);
  }

  if (!images || images.length === 0) {
    return next(new HttpError("該城市目前還沒有照片哦！", 404));
  }
  res.json({
    images: images.map((image) => image.toObject({ getters: true })),
  });
};

const addImage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("請檢查必填欄位", 422));
  }
  const {
    imageTitle,
    imageDescription,
    imageCategory,
    imageCityLocation,
    imageDistrictLocation,
    imageScapeName,
    creator,
  } = req.body;
  const newImage = new Image({
    imageTitle,
    imageDescription,
    imageCategory,
    imageCityLocation,
    imageDistrictLocation,
    imageScapeName,
    creator,
  });
  try {
    await newImage.save();
  } catch (err) {
    const error = new HttpError("新增照片失敗，請稍後再試。", 500);
    return next();
  }

  res.status(201).json({ image: newImage });
};

exports.getScapesByCity = getScapesByCity;
exports.getImagesByScape = getImagesByScape;
exports.addImage = addImage;
