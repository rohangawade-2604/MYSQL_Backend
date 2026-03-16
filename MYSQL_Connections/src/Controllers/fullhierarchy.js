const {queryAsync} = require("../Controllers/hierarchy.js")

const fullhierarchy = async() => {

    try {
        
        const query = `SELECT 
        T.TLMID, T.TLMName, T.TLMPassword, T.TLMHq, T.TLMZone,
        S.SLMID, S.TLMName, S.SLMPassword, S.SLMHq, S.SLMZone,
        F.FLMID, F.FLMName, F.FLMPassword, F.FLMHq, F.FLMZone,
        M.MRID, M.MRName, M.MRPassword, M.MRHq, M.MRZone,

        FROM TLM T
        LEFT JOIN SLM S ON T.SLMID = S.SLMID
        LEFT JOIN FLM F ON S.FLMID = F.FLMID
        LEFT JOIN MR M ON F.MLMID = M.MRID
        `;

        const result = await queryAsync(query);

        return res.json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            message: "error is been occured",
            error: error.message
        })
    }
}

module.exports = {fullhierarchy}