const express = require("express");
const router = express.Router()

const {nestedhierarchy} = require("../Controllers/nestedhierarchy")


router.get("/hierarchy/:id", nestedhierarchy);

module.exports = router