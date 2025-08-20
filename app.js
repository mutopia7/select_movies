const express = require("express");
const app = express();
const path = require("node:path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const router = require("./routes/router")


// Header security
// app.use(helmet());

// Limit the number of requests (to prevent brute-force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Maximum request in this period
});
// app.use(limiter);

// To capture form data and JSON
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));


// set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// serving Static Assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


app.use("/", router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})

