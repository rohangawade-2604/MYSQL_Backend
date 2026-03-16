const {Connection} = require("./config/db")

const { v4: uuidv4 } = require("uuid")


const tables = [
    {table: "TLM", column: "TLMID"},
    {table: "SLM", column: "SLMID"},
    {table: "FLM", column: "FLMID"},
    {table: "MR", column: "MRID"}
]


const generateuuid = async() => {
    try {
        
        for(let items of tables){
            
            const [rows] = await Connection.promise().query(
                `SELECT ${items.column} FROM ${items.table}`
            )

            for(let row of rows){
                
                const uuid = uuidv4();

                await Connection.promise().query(
                    `UPDATE ${items.table} SET uuid = ? WHERE ${items.column} = ?`, [uuid, row[items.column]]
                )

                console.log(`uuid add for ${row[items.column]}`);
                
            }
        }

        console.log("ALL uuid generated successfully ");
        process.exit();
        
    } catch (error) {
        console.log(error);
        
    }
}

generateuuid()