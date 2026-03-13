const express = require("express");

const router = express.Router();

const {upload} = require("../../Folder/Middleware/upload");
const { uploadHierarchyExcel } = require("../Controllers/hierarchy");


router.post("/upload-excel", upload.single("file"), uploadHierarchyExcel)

module.exports = router