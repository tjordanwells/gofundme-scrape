const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FundraiserSchema = new Schema({
    category: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: false
    },
    raised: {
      type: String,
      required: false
    },
    total: {
      type: String,
      required: false
    }
});

const Fundraiser = mongoose.model("Fundraiser", FundraiserSchema);

module.exports = Fundraiser;