const { Connection } = require("../../config/db");
const { connect } = require("../Routes/profileRoutes");
// const uuid = require("uuid")

const UpdateProfileController = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    const profilePic = req.file.filename;

    // const tables = ["TLM", "SLM", "FLM", "MR"];

    const tables = [
      { table: "TLM", column: "uuid" },
      { table: "SLM", column: "uuid" },
      { table: "FLM", column: "uuid" },
      { table: "MR", column: "uuid" },
    ];

    for (let item of tables) {
      const checkQuery = `SELECT uuid FROM ${item.table} WHERE  ${item.column} = ? `;

      const [row] = await Connection.promise().query(checkQuery, [uuid]);

      console.log("Searching in:", item.table);
      console.log("Result:", row);

      if (row.length > 0) {
        const updateQuery = `UPDATE ${item.table} SET profile_pic = ? WHERE uuid = ?`;

        await Connection.promise().query(updateQuery, [profilePic, uuid]);

        return res.status(200).json({
          message: "profile picture udpated successfully.!!!",
          table: item.table,
          uuid: uuid,
        });
      }
    }

    return res.status(404).json({
      message: " User not found anywhere...!!!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error is been occured",
      error: error.message,
    });
  }
};


const deleteProfileController = async(req, res) => {
  try {

    const {uuid} = req.params;

    // if(!req.file) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Profile picture is required here"
    //   })
    // }

    // const profilePic = req.file.filename;

    const tables = [
      {table: "TLM", column: "uuid"},
      {table: "SLM", column: "uuid"},
      {table: "FLM", column: "uuid"},
      {table: "MR", column: "uuid"},
    ]

    for(let item of tables){
      const checkQuery = `SELECT uuid FROM ${item.table} WHERE ${item.column} = ?`;

      const [row] = await Connection.promise().query(checkQuery,[uuid]);

      console.log("Searching in ", item.table);
      console.log("Result we got", row);
      
      
      if(row.length > 0){
        const DeleteQuery = `UPDATE ${item.table} SET profile_pic = NULL WHERE ${item.column} = ?`

        await Connection.promise().query(DeleteQuery, [uuid]);

        return res.status(200).json({
          success: true,
          message: "Profile picture is been Delete successfully ...!!!",
          table: item.table,
          uuid: uuid,
        })
      }
    }

    return res.status(404).json({
      success: false,
      message: "User not found anywhere..!!!",
    })

  } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error is been occured",
        error: error.message,
      })    
  }
}


const GetUserByRoleController = async(req, res) => {
  try {

    const {uuid, id} = req.params;

    const roleTableMap = {
      TLM: "TLM",
      SLM: "SLM",
      FLM: "FLM",
      MR: "MR",
    }

    const tablename = roleTableMap[id];


    if(!tablename){
      return res.status(400).json({
        success: false,
        message: "invalid role provided"
      });
    }

    const query = `SELECT * FROM ${tablename} WHERE uuid = ?`;

    const [row] = await Connection.promise().query(query, [uuid]);

    if(row.length === 0){
      return res.status(404).json({
        success: false,
        message: "User not founded here",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Data fetch Successfully ",
      data: row[0],
    })

  } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error is been occured",
        error: error.message
      })    
  }
};


const updateUserDetails = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, hq, zone } = req.body;

    // ✅ Validation
    if (!name || !hq || !zone) {
      return res.status(400).json({
        success: false,
        message: "name, hq, and zone are required",
      });
    }

    // ✅ Table + Column Mapping
    const tables = [
      {
        table: "TLM",
        idCol: "uuid",
        nameCol: "TLMName",
        hqCol: "TLMHq",
        zoneCol: "TLMZone",
      },
      {
        table: "SLM",
        idCol: "uuid",
        nameCol: "SLMName",
        hqCol: "SLMHq",
        zoneCol: "SLMZone",
      },
      {
        table: "FLM",
        idCol: "uuid",
        nameCol: "FLMName",
        hqCol: "FLMHq",
        zoneCol: "FLMZone",
      },
      {
        table: "MR",
        idCol: "uuid",
        nameCol: "MRName",
        hqCol: "MRHq",
        zoneCol: "MRZone",
      },
    ];

    // ✅ Loop through tables
    for (let item of tables) {
      const checkQuery = `SELECT ${item.idCol} FROM ${item.table} WHERE ${item.idCol} = ?`;

      const [rows] = await Connection.promise().query(checkQuery, [uuid]);

      // ✅ If user found in this table
      if (rows.length > 0) {
        const updateQuery = `
          UPDATE ${item.table}
          SET ${item.nameCol} = ?, 
              ${item.hqCol} = ?, 
              ${item.zoneCol} = ?
          WHERE ${item.idCol} = ?     
        `;

        await Connection.promise().query(updateQuery, [
          name,
          hq,
          zone,
          uuid,
        ]);

        return res.status(200).json({
          success: true,
          message: "User updated successfully",
          table: item.table,
        });
      }
    }

    // ❌ If not found in any table
    return res.status(404).json({
      success: false,
      message: "User not found in any table",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


const getPerHoursData = async(req, res) => {

  try {
    
    const tables = [
      {
        table: "TLM",
        nameCol: "TLMName",
        hqCol: "TLMHq",
        zoneCol: "TLMZone",
      },
      {
        table: "SLM",
        nameCol: "SLMName",
        hqCol: "SLMHq",
        zoneCol: "SLMZone",
      },
      {
        table: "FLM",
        nameCol: "FLMName",
        hqCol: "FLMHq",
        zoneCol: "FLMZone",
      },
      {
        table: "MR",
        nameCol: "MRName",
        hqCol: "MRHq",
        zoneCol: "MRZone",
      },
    ]

    let finalData = [];

    for(let item of tables){
      const query = `SELECT *,
       '${item.table}' AS role
      FROM ${item.table}
      WHERE modified_at >= NOW() - INTERVAL 45 MINUTE`;

      const [row] = await Connection.promise().query(query);

      finalData = [...finalData, ...row];
    }

    return res.status(200).json({
      success: true,
      message: "found late 3 hours Data in it",
      count:finalData.length,
      data: finalData,
    })

  } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server is been crashed today ",
        error: error.message
      })    
  }
}

const getUserwithQuery = async(req, res) => {
  try {

    const {name, hq, zone} = req.query;

    let finalData = []

    const tables = [
      {
        table: "TLM",
        nameCol: "TLMName",
        hqCol: "TLMHq",
        zoneCol: "TLMZone",
      },
      {
        table: "SLM",
        nameCol: "SLMName",
        hqCol: "SLMHq",
        zoneCol: "SLMZone",
      },
      {
        table: "FLM",
        nameCol: "FLMName",
        hqCol: "FLMHq",
        zoneCol: "FLMZone",
      },
      {
        table: "MR",
        nameCol: "MRName",
        hqCol: "MRHq",
        zoneCol: "MRZone",
      },
    ]

    

    for(let item of tables){
      
      let query = `
      SELECT * FROM
      ${item.table}
      WHERE modified_at >= NOW() - INTERVAL 3 HOUR
      `

      let values = [];

      if(name){
        query += ` AND ${item.nameCol} LIKE ?`;
        values.push(`%${name}%`)
      }

      if(hq){
        query += ` AND ${item.hqCol} LIKE ?`;
        values.push(`%${hq}%`)
      }

      if(zone){
        query += ` AND ${item.zoneCol} LIKE ?`;
        values.push(`%${zone}%`)
      }

      const [row] = await Connection.promise().query(query, values);

      finalData = [...finalData, ...row];
    }

    return res.status(200).json({
      success: true,
      message: "you got the answer here",
      data: finalData,
    })

  } catch (error) {
      return res.status(500).json({
        success: false,
        message: "L lag gaye bhaaiiii",
        error: error.message,
      })    
  }
}


const deleteuser = async(req, res) => {
  
  try {
    
    const { uuid } = req.params
  const { confirm } = req.query

  if(confirm !== "true"){
    return res.status(400).json({
      success: false,
      message: "please confirm deletion after by adding ?confirm=true"
    })
  }

  const tables = [
    {table: "TLM", idCol: "uuid"},
    {table: "SLM", idCol: "uuid"},
    {table: "FLM", idCol: "uuid"},
    {table: "MR", idCol: "uuid"},
  ]

  for(let item of tables){
    const checkQuery = `
    SELECT ${item.idCol}
    FROM ${item.table}
    WHERE ${item.idCol} =? 
    `

    const [row] = await Connection.promise().query(checkQuery, [uuid]);

    if(row.length > 0){
      const deleteQuery = `
      DELETE FROM ${item.table}
      WHERE ${item.idCol} = ?
      `

      await Connection.promise().query(deleteQuery, [uuid])

      return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        table: item.table,
      })
    }
  }

  return res.status(404).json({
    success: false,
    message: "user not found",
  })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in server",
      error: error.message,
    })    
  }
}


const mrchanges = async(req, res) => {
  try {
    const {mrId , newFlmId} = req.body;

    //validation part
    if(!mrId || !newFlmId){
      return res.status(400).json({
        success: false,
        message: "mrId and newFlmId are required"
      })
    }

    const [mrRows] = await Connection.promise().query(
      `SELECT MRID , FLMID FROM MR WHERE MRID = ?`, [mrId]
    );

    if(mrRows.length === 0){
      return res.status(404).json({
        success: false,
        message: "MR not found here",
      })
    }

    const oldFLmId = mrRows[0].FLMID;

    // check FLM exist or not 
    const [flmRows] = await Connection.promise().query(
      `SELECT FLMID FROM FLM WHERE FLMID = ?`,[newFlmId]
    )

    if(flmRows.length === 0){
      return res.status(404).json({
        success: false,
        message: "New flm id not found here",
      })
    }

    await Connection.promise().query(
      `UPDATE MR SET FLMID = ? WHERE MRID = ?`, [newFlmId,mrId]
    )
    

    return res.status(200).json({
      success: true,
      message: `MR shifted from FLM ${oldFLmId} to FLM ${newFlmId}`,
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error is been occured",
      error: error.message,
    })
  }
}


module.exports = {
  UpdateProfileController,
  deleteProfileController,
  GetUserByRoleController,
  updateUserDetails,
  getPerHoursData,
  getUserwithQuery,
  deleteuser,
  mrchanges
};
