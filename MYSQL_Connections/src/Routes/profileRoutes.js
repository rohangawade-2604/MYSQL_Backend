const express = require("express");

const router = express.Router();


const {UpdateProfileController} = require("../Controllers/profileController")


router.put("/update-profile/:userID", upload.single("profile_pic"), UpdateProfileController);


module.exports = router