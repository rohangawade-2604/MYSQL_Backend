const { queryAsync } = require("../Controllers/hierarchy");


// nestedhierarchy concept 
const nestedhierarchy = async (req, res) => {
  try {
    const { id } = req.params;

    let data = null;
    let role = "";

    // ---------- Check TLM
    let query = `
        SELECT
        T.*,
            S.SLMID, S.SLMName, S.SLMPassword, S.SLMHq, S.SLMZone,
            F.FLMID, F.FLMName, F.FLMPassword, F.FLMHq, F.FLMZone,
            M.MRID, M.MRName, M.MRPassword, M.MRHq, M.MRZone
        FROM TLM T
        LEFT JOIN SLM S ON T.SLMID = S.SLMID
        LEFT JOIN FLM F ON S.FLMID = F.FLMID
        LEFT JOIN MR M ON F.MRID = M.MRID
        WHERE T.TLMID = ?`;

    let result = await queryAsync(query, [id]);

    if (result.length > 0) {
      role = "TLM";
      return res.json({ role, data: result });
    }

    // ---------- Check SLM

    query = `
        SELECT 
            S.*,
            F.FLMID, F.FLMName, F.FLMPassword, F.FLMHq, F.FLMZone,
            M.MRID, M.MRName, M.MRPassword, M.MRHq, M.MRZone
        FROM SLM S
        LEFT JOIN FLM F ON S.FLMID = F.FLMID
        LEFT JOIN MR M ON F.MRID = M.MRID
        WHERE S.SLMID = ?
        `;

    result = await queryAsync(query, [id]);

    if (result.length > 0) {
      role = "SLM";
      return res.json({ role, data: result });
    }

    //-------------check FLM

    query = `
    SELECT 
        F.*, 
        M.MRID, M.MRName, M.MRPassword, MRHq, MRZone
    FROM FLM F
    LEFT JOIN MR M ON F.MRID = M.MRID
    WHERE F.FLMID = ?
    `;

    result = await queryAsync(query, [id]);

    if (result.length > 0) {
      role = "FLM";
      return res.json({ role, data: result });
    }


     // ---------- Check MR
    query = `
      SELECT * FROM MR WHERE MRID = ?
    `;

    result = await queryAsync(query, [id]);

    if(result.length > 0){
        role = "MR"
        return res.json({ role, data: result})
    }


    return res.status(404).json({
        message: "Id not founded"
    });

  } catch (error) {
    res.status(500).json({
        error: error.message
    })
  }
};

module.exports = {nestedhierarchy}