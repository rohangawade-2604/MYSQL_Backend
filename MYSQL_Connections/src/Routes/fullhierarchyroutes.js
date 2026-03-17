const express = require("express");

const router = express.Router();

const {fullhierarchy} = require("../Controllers/fullhierarchy")



router.get("/hierarchy", fullhierarchy);

module.exports = router