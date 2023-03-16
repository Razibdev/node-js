const mongoose = require("mongoose");
const validator = require("validator");

const projectMenuSchema = new mongoose.Schema({

    project_id: {
        type: String,
        required: [true, "Please tell us Project Id!!!"],
    },
    menu_name: {
        type: String,
        required: [true, "Please tell us Menu Name!!!"],
    },
    menu_description: {
        type: String,
        required: [true, "Please tell us your Menu description!!!"],
    },
    feature_image: {
        type: String
    },


});

const ProjectMenu = mongoose.model("ProjectMenu", projectMenuSchema);
module.exports = ProjectMenu;
