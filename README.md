
# Movie Land 

Visit here [Movie Land](https://movie-land7.vercel.app/).

## Project Overview

**Movie Land** is a simple yet professional web app for displaying information about movies, actors, and genres.  
It is built with Node.js and Express, uses EJS for server-side rendering, and stores data in PostgreSQL.  
This repository is designed for practicing full-stack development with a focus on clean architecture, SEO, and accessibility.

---

## Features
- Display a list of movies on the homepage.
- Movie detail page (title, description, cast, genres, IMDB score, and more).
- Dedicated pages for actors and genres.
- PostgreSQL database with an initialization script (`db/populatedb.js`).
- Server-side rendering with EJS and lightweight CSS styling.
- Ready for deployment on platforms like Railway / Heroku / Vercel (with proper adjustments).

---

## Tech Stack
- Node.js (LTS)
- Express.js
- EJS (templating engine)
- PostgreSQL
- `pg` (node-postgres)
- HTML5 / CSS (vanilla)
- (Optional) Helmet, express-rate-limit for better security

---

## Prerequisites
- Node.js ≥ 18 (or current LTS)
- npm or yarn
- PostgreSQL (local) or a remote database (Railway, Heroku Postgres, Supabase, ...)
- Environment variables (`.env`) file


## Project Structure
```
.
├── app.js
├── package.json
├── db
│   ├── pool.js
│   ├── populatedb.js
│   └── queries.js
├── controllers
│   └── controller.js
├── routes
│   └── router.js
├── public
│   └── styles
├── views
│   ├── layouts
│   └── partials
└── README.md
```

Notes:
- `db/populatedb.js` is responsible for creating tables and inserting sample data.
- `db/queries.js` contains main queries for movies, actors, genres, and movie details.
- Templates are stored under `views/` and static assets under `public/`.

---



- Created by [mutopia](https://github.com/mutopia7).


