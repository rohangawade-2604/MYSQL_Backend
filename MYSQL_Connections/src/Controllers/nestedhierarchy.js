const { queryAsync } = require("../Controllers/hierarchy");


// --------formating concept of data 
const formatHierarchy = (rows) => {
  const slmMap = {};

  rows.forEach((row) => {
    if (!slmMap[row.SLMID]) {
      slmMap[row.SLMID] = {
        SLMID: row.SLMID,
        SLMName: row.SLMName,
        SLMHq: row.SLMHq,
        SLMZone: row.SLMZone,
        FLMs: []
      };
    }

    const slm = slmMap[row.SLMID];

    let flm = slm.FLMs.find((f) => f.FLMID === row.FLMID);

    if (!flm) {
      flm = {
        FLMID: row.FLMID,
        FLMName: row.FLMName,
        FLMHq: row.FLMHq,
        FLMZone: row.FLMZone,
        MRs: []
      };

      slm.FLMs.push(flm);
    }

    if (row.MRID) {
      flm.MRs.push({
        MRID: row.MRID,
        MRName: row.MRName,
        MRHq: row.MRHq,
        MRZone: row.MRZone
      });
    }
  });

  return Object.values(slmMap);
};

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

module.exports = {nestedhierarchy ,formatHierarchy}