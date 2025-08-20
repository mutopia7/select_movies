const express = require("express");
const app = express();
const path = require("node:path")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath))

app.get("/", (req,res) => {
    res.render('layouts/home', { movies: "test" })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})

