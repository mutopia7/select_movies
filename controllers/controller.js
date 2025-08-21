const db = require('../db/queries');

async function renderHome(req,res) {
    const movies = await db.getAllMovies();
    res.render("layouts/home", { movies: movies});
}

async function renderDetail(req, res) {
    const id = req.params.id;
    const movie = await db.getDetailMovie(id);
    res.render("layouts/detail", { movie: movie })
}

async function renderActors(req,res) {
    const actors = await db.getAllActors();
    res.render("layouts/actors", {actors: actors})
}

async function renderGenres(req,res) {
    const genres = await db.getAllGenres();
    res.render("layouts/genres", {genres: genres})
}


module.exports = {
    renderHome,
    renderDetail,
    renderActors,
    renderGenres
}