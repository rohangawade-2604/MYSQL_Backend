const express = require("express");
const router = express.Router();
const profile = require("../../Folder/Middleware/profile")


const {UpdateProfileController} = require("../Controllers/profileController")
const {deleteProfileController} = require("../Controllers/profileController")
const {GetUserByRoleController} = require("../Controllers/profileController")


router.put("/update-profile/:uuid", profile.single("profile_pic"), UpdateProfileController);
router.delete("/delete-profile/:uuid",  deleteProfileController);
router.delete("/user/:role/:uuid",  GetUserByRoleController);


module.exports = router