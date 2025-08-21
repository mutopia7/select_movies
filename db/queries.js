const pool = require("./pool");

async function getAllMovies() {
    const { rows } = await pool.query("SELECT * FROM movies");
    return rows
}

async function getDetailMovie(id) {
    const { rows } = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    return rows
}

async function getAllActors(){
    const { rows } = await pool.query("SELECT * FROM actors");
    return rows
}

async function getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM genres");
    return rows
}

module.exports = {
    getAllMovies,
    getDetailMovie,
    getAllActors,
    getAllGenres
}