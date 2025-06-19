const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");

const app = express();

//App middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
    res.send("Server running");
});
app.use("/auth", authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port: " + port));
