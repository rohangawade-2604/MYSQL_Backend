const XLSX = require("xlsx");
const fs = require("fs");
const { Connection } = require("../../config/db"); // ensure this is mysql2/promise

// Promisify query for easier async/await
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

    if (!sheetName) {
      return res
        .status(400)
        .json({ message: "No sheet found in excel file" });
    }

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

      
      // Insert TLM (ignore if duplicate)
      const tlmQuery = `
        INSERT IGNORE INTO TLM
        (TLMID, TLMName, TLMPassword, TLMHq, TLMZone, SLMID)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await queryAsync(tlmQuery,  [
        TLMID,
        TLMName,
        TLMPassword,
        TLMHq,
        TLMZone,
        SLMID
      ]);
      console.log(`TLM Inserted: ${TLMID}`);

      // Insert SLM
      const slmQuery = `
        INSERT IGNORE INTO SLM
        (SLMID, SLMName, SLMPassword, SLMHq, SLMZone, FLMID)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await queryAsync(slmQuery,  [SLMID, SLMName, SLMPassword, SLMHq, SLMZone, FLMID]);
      console.log(`SLM Inserted: ${SLMID}`);

      // Insert FLM
      const flmQuery = `
        INSERT IGNORE INTO FLM
        (FLMID, FLMName, FLMPassword, FLMHq, FLMZone, MRID)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await queryAsync(flmQuery, [
        FLMID,
        FLMName,
        FLMPassword,
        FLMHq,
        FLMZone,
        MRID
      ]);
      console.log(`FLM Inserted: ${FLMID}`);

      // Insert MR
      const mrQuery = `
        INSERT IGNORE INTO MR
        (MRID, MRName, MRPassword, MRHq, MRZone)
        VALUES (?, ?, ?, ?, ?)
      `;
      await queryAsync(mrQuery, [MRID, MRName, MRPassword, MRHq, MRZone]);
      console.log(`MR Inserted: ${MRID}`);
    }



    // Delete uploaded file asynchronously
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Failed to delete file:", err);
      else console.log("Uploaded Excel file deleted");
    });

    res.status(200).json({ message: "Excel data imported successfully" });
  } catch (error) {
    console.error("Excel Import Error:", error);
    res.status(500).json({ message: "Error importing excel", error: error.message });
  }
};

module.exports = { uploadHierarchyExcel, queryAsync };