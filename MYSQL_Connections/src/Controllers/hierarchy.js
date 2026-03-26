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
        MRZone
      } = row;

      // ✅ TLM (REMOVE SLMID)
      await queryAsync(
        `INSERT IGNORE INTO TLM (TLMID,TLMName,TLMPassword,TLMHq,TLMZone)
         VALUES (?,?,?,?,?)`,
        [TLMID, TLMName, TLMPassword, TLMHq, TLMZone]
      );

      // ✅ SLM → ADD TLMID
      await queryAsync(
        `INSERT IGNORE INTO SLM (SLMID,SLMName,SLMPassword,SLMHq,SLMZone,TLMID)
         VALUES (?,?,?,?,?,?)`,
        [SLMID, SLMName, SLMPassword, SLMHq, SLMZone, TLMID]
      );

      // ✅ FLM → ADD SLMID
      await queryAsync(
        `INSERT IGNORE INTO FLM (FLMID,FLMName,FLMPassword,FLMHq,FLMZone,SLMID)
         VALUES (?,?,?,?,?,?)`,
        [FLMID, FLMName, FLMPassword, FLMHq, FLMZone, SLMID]
      );

      // ✅ MR → ADD FLMID (MOST IMPORTANT)
      await queryAsync(
        `INSERT IGNORE INTO MR (MRID,MRName,MRPassword,MRHq,MRZone,FLMID)
         VALUES (?,?,?,?,?,?)`,
        [MRID, MRName, MRPassword, MRHq, MRZone, FLMID]
      );
    }

    fs.unlink(req.file.path, () => {});

    res.status(200).json({ message: "Excel data imported successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Error importing excel",
      error: error.message
    });
  }
};

module.exports = { uploadHierarchyExcel, queryAsync };