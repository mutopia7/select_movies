const db = require('../db/queries');

async function renderHome(req,res) {
    const movies = await db.getAllMovies();
    res.render("layouts/home", { movies: movies});
}

async function renderDetail(req, res) {
    const id = req.params.id;
    const movie = await db.getDetailMovie(id);
    res.render("layouts/detail", { movie: movie[0] })
}


module.exports = {
    renderHome,
    renderDetail
}