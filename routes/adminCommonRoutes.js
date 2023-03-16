const express = require("express");
const projectController = require("./../controllers/projectController.js");
const authController = require("./../controllers/authController.js");

const router = express.Router();
// authController.protect, authController.restrictTo("admin"),
router.get("/view_contact_list", projectController.viewContactList);

module.exports = router;