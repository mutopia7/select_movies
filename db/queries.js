const pool = require("./pool");

async function getAllMovies() {
    const { rows } = await pool.query("SELECT * FROM movies");
    return rows
}

async function getDetailMovie(id) {
    const { rows } = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    return rows
}


module.exports = {
    getAllMovies,
    getDetailMovie
}