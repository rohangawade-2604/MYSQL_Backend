const XLSX = require("xlsx");
const fs = require("fs");
const { Connection } = require("../../config/db");

const queryAsync = (sql, params) =>
  new Promise((resolve, reject) => {
    Connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

const uploadHierarchyExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel file required" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of data) {
      const {
        TLMID,
        TLMName,
        TLMPassword,
        TLMHq,
        TLMZone,
        SLMID,
        SLMName,
        SLMPassword,
        SLMHq,
        SLMZone,
        FLMID,
        FLMName,
        FLMPassword,
        FLMHq,
        FLMZone,
        MRID,
        MRName,
        MRPassword,
        MRHq,
        MRZone,
      } = row;

      // ✅ TLM (REMOVE SLMID)
      await queryAsync(
        `INSERT IGNORE INTO TLM (TLMID,TLMName,TLMPassword,TLMHq,TLMZone)
         VALUES (?,?,?,?,?)`,
        [TLMID, TLMName, TLMPassword, TLMHq, TLMZone],
      );

      // ✅ SLM → ADD TLMID
      await queryAsync(
        `INSERT IGNORE INTO SLM (SLMID,SLMName,SLMPassword,SLMHq,SLMZone,TLMID)
         VALUES (?,?,?,?,?,?)`,
        [SLMID, SLMName, SLMPassword, SLMHq, SLMZone, TLMID],
      );

      // ✅ FLM → ADD SLMID
      await queryAsync(
        `INSERT IGNORE INTO FLM (FLMID,FLMName,FLMPassword,FLMHq,FLMZone,SLMID)
         VALUES (?,?,?,?,?,?)`,
        [FLMID, FLMName, FLMPassword, FLMHq, FLMZone, SLMID],
      );

      // ✅ MR → ADD FLMID (MOST IMPORTANT)
      await queryAsync(
        `INSERT IGNORE INTO MR (MRID,MRName,MRPassword,MRHq,MRZone,FLMID)
         VALUES (?,?,?,?,?,?)`,
        [MRID, MRName, MRPassword, MRHq, MRZone, FLMID],
      );
    }

    // after loop ends

    // ✅ FETCH FULL DATA WITH RELATION
    const [rows] = await Connection.promise().query(`
  SELECT 
    t.TLMID,
    s.SLMID,
    f.FLMID,
    m.MRID
  FROM TLM t
  LEFT JOIN SLM s ON t.TLMID = s.TLMID
  LEFT JOIN FLM f ON s.SLMID = f.SLMID
  LEFT JOIN MR m ON f.FLMID = m.FLMID
`);

    // ✅ CONVERT INTO HIERARCHY
    const flatData = result.data; // your current flat data

    const hierarchy = [];

    flatData.forEach((row) => {
      // 🔹 TLM
      let tlm = hierarchy.find((t) => t.TLMID === row.TLMID);
      if (!tlm) {
        tlm = {
          TLMID: row.TLMID,
          TLMName: row.TLMName,
          SLMs: [],
        };
        hierarchy.push(tlm);
      }

      // 🔹 SLM
      let slm = tlm.SLMs.find((s) => s.SLMID === row.SLMID);
      if (!slm) {
        slm = {
          SLMID: row.SLMID,
          SLMName: row.SLMName,
          FLMs: [],
        };
        tlm.SLMs.push(slm);
      }

      // 🔹 FLM
      let flm = slm.FLMs.find((f) => f.FLMID === row.FLMID);
      if (!flm) {
        flm = {
          FLMID: row.FLMID,
          FLMName: row.FLMName,
          MRs: [],
        };
        slm.FLMs.push(flm);
      }

      // 🔹 MR
      if (row.MRID) {
        const exists = flm.MRs.find((m) => m.MRID === row.MRID);
        if (!exists) {
          flm.MRs.push({
            MRID: row.MRID,
            MRName: row.MRName,
          });
        }
      }
    });
    fs.unlink(req.file.path, () => {});

    res.status(200).json({ message: "Excel data imported successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error importing excel",
      error: error.message,
    });
  }
};

module.exports = { uploadHierarchyExcel, queryAsync };
