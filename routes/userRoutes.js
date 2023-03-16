const express = require("express");
const userController = require("./../controllers/userController.js");
const authController = require("./../controllers/authController.js");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.post('/contact', userController.contactFormSubmit);

//admin team member
router.post('/add_team_member', userController.addTeamMemberAdmin);
router.post('/view_team_member', userController.viewTeamMemberAdmin);

router.get('/get_team_list', userController.viewTeamMemberUser);


//protect all routes after this middleware
// router.use(authController.protect);

router.patch("/update-password", authController.updatePassword);
router.get("/user-info",authController.protect, userController.userInfo);

router.patch("/updateme", userController.updateMe);

router.delete("/deleteme", userController.deleteMe);

router.get(
  "/me",
  // authController.protect,
  userController.getMe,
  userController.getUser
);
// router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
// .post(userController.createUser);

router.route("/:id").get(userController.getUser);
// .patch(userController.updateUser)
// .delete(userController.deleteUser);


module.exports = router;
