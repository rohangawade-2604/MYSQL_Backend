const {queryAsync} = require("../Controllers/hierarchy")

const loginController = async(req , res) => {
    try {
        
        const {id, password} = req.body;

        if(!id || !password) {
            return res.send.status(400).json({
                success: false,
                message: "Username and password is required"
            })
        }

        //--------------- For TLM Users----------------

        let query = "SELECT * FROM TLM WHERE TLMID = ? AND TLMPassword = ?";
        let result = await queryAsync(query, [id, password]);

        if(result.length > 0){
            return res.json({
                message: "Login successfully",
                role: "TLM",
                user: result[0]
            })
        }

     //--------------- For SLM Users----------------
     
     query = "SELECT * FROM SLM WHERE SLMID = ? AND TLMPassword = ?";
     result = await queryAsync(query, [id, password]);

     if(result.length > 0){
        return res.json({
            message: "login succesfully",
            role: "SLM",
            user: result[0]
        })
     }


     //--------------- For FLM Users----------------

     query = "SELECT * FROM FLM WHERE FLMID = ? AND FLMPassword = ?";
     result = await queryAsync(query, [id, password]);

     if(result.length > 0){
        return res.json({
            message: "Login successfully",
            role: "FLM",
            user: result[0]
        })
     }


     query = "SELECT * FROM MR WHERE MRID = ? AND MRPassword = ?";
     result = await queryAsync(query, [id, password]);

     if(result.length > 0){
        return res.json({
            message: "Login Successfully",
            role: "MR",
            user: result[0]
        })
     }

     return res.status(401).json({
        success: false,
        message: "Invalid ID or Password"
     });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });        
    }
}   

module.exports = {loginController}
