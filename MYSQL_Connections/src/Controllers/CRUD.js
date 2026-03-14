const {Connection} = require("../../config/db");

// fetching the data through the id 

const CRUD = async (req , res) => {
    
    const [ id ] = req.params

    const query = "SELECT * FROM users"

    Connection.query(query, [id], (err, result) => {
        try {
            res.status(200).json({
                message: "Retain User Detail Successfully",
                result
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    })
}


module.exports = { CRUD }