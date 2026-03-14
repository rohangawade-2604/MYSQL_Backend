const express = require("express");

const routes = express.Router();

const {getUsers} = require("../Controllers/user")

routes.delete("/users", getUsers);


module.exports = routes

