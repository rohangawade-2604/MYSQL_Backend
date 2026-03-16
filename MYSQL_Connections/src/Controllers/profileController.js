const {Connection} = require("../../config/db");
// const uuid = require("uuid")

const UpdateProfileController = async (req, res) => {
    try {
        
       const { userID } = req.params;

        if(!req.file) {
            return res.status(400).json({
                message: "Profile picture is required"
            });
        }

        const profilePic = req.file.filename;

        const tables = ["tlm", "slm", "flm", "mr"];

        for(let table of tables){
            
            const checkQuery = `SELECT * FROM ${table} WHERE userID = ? `;

            const [row] = await Connection.promise().query(checkQuery, [uuid]);

            if(row.length > 0){
                const updateQuery = `UPDATE ${table} SET profile_pic = ? WHERE uuid = ?`;
                
                await Connection.promise().query(updateQuery [profilePic,uuid]);

                return res.status(200).json({
                    message: "profile picture udpated successfully.!!!",
                    table: table,
                    uuid: uuid
                })
            }
        }

         return res.status(404).json({
            message: " User not found anywhere...!!!"
         });   


    } catch (error) {
        
        res.status(500).json({
            message: "Server Error is been occured",
            error: error.message
        })
    }
}

module.exports = {
    UpdateProfileController
}
