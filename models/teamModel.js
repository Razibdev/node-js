const mongoose = require("mongoose");
const validator = require("validator");

const teamSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Please tell us your full name!!!"],
  },
  designation: {
    type: String,
    required: [true, "Please tell us your designation!!!"],
  },
  short_bio: {
    type: String,
    required: [true, "Please share with us your bio"],
  },
  feature_image: String,
  fb_link: String,
  tw_link: String,
  ln_link: String,
  gh_link: String,

});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
