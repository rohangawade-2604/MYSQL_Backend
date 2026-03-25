const express = require("express");
const router = express.Router();
const profile = require("../../Folder/Middleware/profile")


const {UpdateProfileController} = require("../Controllers/profileController")
const {deleteProfileController} = require("../Controllers/profileController")
// const {GetUserByRoleController} = require("../Controllers/profileController")
const {updateUserDetails} = require("../Controllers/profileController")
const {getPerHoursData , getUserwithQuery} = require("../Controllers/profileController")


router.put("/update-profile/:uuid", profile.single("profile_pic"), UpdateProfileController);
router.delete("/delete-profile/:uuid",  deleteProfileController);
// router.delete("/user/:role/:uuid",  GetUserByRoleController);
router.put("/user-details/:uuid",  updateUserDetails);
router.get("/updatehoursData",  getPerHoursData);
router.get("/users",  getUserwithQuery);


module.exports = router