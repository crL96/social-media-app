const express = require("express");
const cors = require("cors");

const app = express();

//App middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
    res.send("Server running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port: " + port));
