const express = require("express");
const projectController = require("./../controllers/projectController.js");
const authController = require("./../controllers/authController.js");

const router = express.Router();

//user section frontend
router.get('/all-app-view', projectController.getAllAppView);
router.get('/web-app-view', projectController.getWebAppView);
router.get('/app-app-view', projectController.getAppAppView);
router.get('/graphics-app-view', projectController.getGraphicsAppView);



// authController.protect, authController.restrictTo("admin"),
router.post("/add_project", projectController.addProject);
router.get("/view_project", projectController.viewProject);
// menu section route
router.post('/:pid/add_sub_project', projectController.addProjectMenu);
router.post('/:pid/view_sub_project', projectController.viewProjectMenu);
router.delete('/:pid/delete_sub_project/:id', projectController.deleteProjectMenu);





module.exports = router;