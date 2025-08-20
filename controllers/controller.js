const db = require('../db/queries');

async function renderHome(req,res) {
    const movies = await db.getAllMovies();
    res.render("layouts/home", { movies: movies});
}



module.exports = {
    renderHome
}