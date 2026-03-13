const {Connection} = require("../../config/db");

// fetching the data through the id 

const CRUD = async (req , res) => {
    
    const {name , email, id} = req.body;

    const query = "SELECT * FROM users"
}

module.exports = { CRUD }