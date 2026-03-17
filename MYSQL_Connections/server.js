const express = require("express");
const dotenv= require("dotenv")
const {Connection} = require("./config/db")
const http = require("http")
const cors = require("cors");
const userRoutes = require("./src/Routes/userRoutes")
const CRUDRoutes = require("./src/Routes/CRUDRoutes")
const hierarchyroutes = require("./src/Routes/hierarchyroutes")
const loginRoutes = require("./src/Routes/loginRoutes")
const nestedhierarchyroutes = require("./src/Routes/nestedhierarchyroutes")
const profileRoutes = require("./src/Routes/profileRoutes")
const fullhierarchyroutes = require("./src/Routes/fullhierarchyroutes")

dotenv.config()

const app = express()
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Alla na response bhava....!!!!")
    console.log("bhetla bhai response");  
})

app.use("/api", userRoutes)
app.use("/api", hierarchyroutes)
app.use("/api", loginRoutes)
app.use("/api", nestedhierarchyroutes )
app.use("/api", profileRoutes)
app.use("/api", fullhierarchyroutes)

const PORT = process.env.PORT || 5000

// const server = http.createServer(app)


app.listen(PORT, async() => {
    console.log(`port chalu ho chuka hai bhai , ye le ${PORT} rupayee`);

     await Connection.connect((error) => {
        if (error) {
            console.log("Kuch to Gadbad kiya hai tunnnee..!!! ❌", error);
        } else {
            console.log("Tension maat le Chal rha hu mein ✅");
        }
    });
    
})


