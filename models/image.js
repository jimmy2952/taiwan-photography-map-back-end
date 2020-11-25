const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  imageTitle: { type: String, required: true },
  imageDescription: { type: String, required: false },
  imageCategory: { type: String, required: true },
  imageCityLocation: { type: String, required: true },
  imageDistrictLocation: { type: String, required: true },
  imageScapeName: { type: String, required: true },
  creator: { type: String, required: true },
});

module.exports = mongoose.model("Place", placeSchema) 