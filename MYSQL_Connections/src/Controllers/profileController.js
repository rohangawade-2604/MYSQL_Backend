const { Connection } = require("../../config/db");
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

module.exports = {
  UpdateProfileController,
};
