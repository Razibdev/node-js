const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: [true, "Please tell us Project Name!!!"],
    },
    project_description: {
        type: String,
        required: [true, "Please tell us your project description!!!"],
    },
    project_type: {
        type: String,
        required: [true, "Please tell us your project type!!!"],
        enum: {
            values: ["web", "app", "graphics"],
            message: "Project type is either: web, app, graphics",
        },
    },
    project_price: {
        type: Number,
        required: [true, "Please provide project price"],

    },
    project_offer_price: {
            type: Number,
        },
    feature_image: {
        type: String,
        required: [true, "Please tell us project feature image!!!"],
    },
     gallary_image: {
        type: Array
    },


});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
