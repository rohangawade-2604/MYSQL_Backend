const express = require("express");
const router = express.Router();
const profile = require("../../Folder/Middleware/profile")


const {UpdateProfileController} = require("../Controllers/profileController")


router.put("/update-profile/:uuid", profile.single("profile_pic"), UpdateProfileController);


module.exports = router