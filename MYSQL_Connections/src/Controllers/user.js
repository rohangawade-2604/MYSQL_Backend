const { Connection } = require("../../config/db");

const getUsers = (req, res) => {

    // const {name, email} = req.body      can set for get and post
    const {name, email, oldEmail} = req.body   

    // const query = SELECT * FROM users                 get the data 
    // const query = "INSERT INTO users (name, email) VALUES (?, ?)";      post the data 
     const query = "DELETE FROM users WHERE email = ?";

    Connection.query(query, [email], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json({
            message: "User updated successfully",
            result
        });

    });
};

module.exports = { getUsers };