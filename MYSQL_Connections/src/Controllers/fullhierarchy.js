const { queryAsync } = require("../Controllers/hierarchy.js");

const fullhierarchy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const query = `
        SELECT
        T.TLMID,
        T.TLMName,
        T.TLMPassword,
  T.TLMHq,
  T.TLMZone,

  S.SLMID,
  S.SLMName,
  S.SLMPassword,
  S.SLMHq,
  S.SLMZone,

  F.FLMID,
  F.FLMName,
  F.FLMPassword,
  F.FLMHq,
  F.FLMZone,

  M.MRID,
  M.MRName,
  M.MRPassword,
  M.MRHq,
  M.MRZone

FROM TLM T
LEFT JOIN SLM S ON T.SLMID = S.SLMID
LEFT JOIN FLM F ON S.FLMID = F.FLMID
LEFT JOIN MR M ON F.MRID = M.MRID
        `;

    const result = await queryAsync(query);

    return res.json({
      page,
      limit,
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "error is been occured",
      error: error.message,
    });
  }
};

module.exports = { fullhierarchy };
