const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Image = require("../models/image");
const User = require("../models/user");

const getAllImage = async (req, res, next) => {
  let images;
  let imagesWithScapes = [];
  try {
    images = await Image.find({}, "imageCityLocation imageScapeName");
    imagesWithScapes = [];
    images.forEach((image, index) => {
      if (index == 0) {
        imagesWithScapes.push(image)
      } else {
        for (const value of imagesWithScapes) {
          if (imagesWithScapes.find(element => element.imageScapeName === image.imageScapeName)) {
            break
          } else {
            imagesWithScapes.push(image)
          }
        }
      }
    });
  } catch (err) {
    const error = new HttpError("伺服器錯誤，請稍後再試。", 500);
    return next(error);
  }
  res.send({
    images: imagesWithScapes.map((image) => image.toObject({ getters: true })),
  });
};

const getSingleImage = async (req, res, next) => {
  const imageId = req.params.imageId;
  try {
    image = await Image.findById(imageId);
  } catch (err) {
    const error = new HttpError("伺服器錯誤，請稍後再試。", 500);
    return next(error);
  }
  res.set('Content-Type', 'image/png');
  res.send(image.image)
}

const getScapesByCity = async (req, res, next) => {
  const cityName = req.params.cityName;

  let scapes;
  try {
    scapes = await Image.find(
      { imageCityLocation: cityName },
      "image imageScapeName"
    );
    scapeInCity = [];
    scapes.forEach((image, index) => {
      if (index == 0) {
        scapeInCity.push(image)
      } else {
        for (const value of scapeInCity) {
          if (scapeInCity.find(element => element.imageScapeName === image.imageScapeName)) {
            break
          } else {
            scapeInCity.push(image)
          }
        }
      }
    });
  } catch (err) {
    const error = new HttpError("伺服器錯誤，請稍後再試。", 500);
    return next(error);
  }

  if (!scapes || scapes.length === 0) {
    return next(new HttpError("該城市目前還沒有照片哦！", 404));
  }
  res.json({
    scapes: scapeInCity.map((scape) => scape.toObject({ getters: true })),
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
  } = req.body;
  const newImage = new Image({
    image: req.file.buffer,
    imageTitle,
    imageDescription,
    imageCategory,
    imageCityLocation,
    imageDistrictLocation,
    imageScapeName,
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("新增照片失敗，請稍後再試。", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("查無此帳號。", 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newImage.save({ session: sess });
    user.images.push(newImage);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("新增照片失敗，請稍後再試。", 500);
    return next(error);
  }
  console.log(newImage)

  res.status(201).json({ image: newImage.toObject({ getters: true }) });
};

exports.getAllImage = getAllImage;
exports.getSingleImage = getSingleImage;
exports.getScapesByCity = getScapesByCity;
exports.getImagesByScape = getImagesByScape;
exports.addImage = addImage;
