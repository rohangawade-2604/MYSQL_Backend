const express = require("express");

const routes = express.Router();

const {CRUD} = require("../Controllers/CRUD");

routes.get("/users/:id", CRUD)


module.exports = routes