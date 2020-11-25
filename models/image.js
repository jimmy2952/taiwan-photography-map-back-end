const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  image: { type: String, required: true },
  imageTitle: { type: String, required: true },
  imageDescription: { type: String, required: false },
  imageCategory: { type: String, required: true },
  imageCityLocation: { type: String, required: true },
  imageDistrictLocation: { type: String, required: true },
  imageScapeName: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Image", placeSchema) 