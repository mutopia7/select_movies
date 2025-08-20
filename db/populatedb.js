#! /usr/bin/env node
require("dotenv").config()
const { Client } = require("pg");

const SQL = `

DROP TABLE IF EXISTS movie_genres, movie_actors, movies, actors, genres CASCADE;


-- movies table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    imgURL TEXT,
    descript TEXT,
    year INT,
    imdb_score NUMERIC(3,1), -- مثل 8.7
    length INT -- مدت زمان فیلم به دقیقه
);

-- actors tables
CREATE TABLE actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    imgURL TEXT
);

-- genres table
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Mediator table for many-to-many relationship between movies and actors
CREATE TABLE movie_actors (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, actor_id)
);

-- Mediation table for many-to-many relationship between movies and genres
CREATE TABLE movie_genres (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- ===== sample data =====

-- movies
INSERT INTO movies (title, imgURL, descript, year, imdb_score, length) VALUES
('Inception', 'https://image.tmdb.org/t/p/original/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
 'A thief who enters the dreams of others to steal secrets must pull off one last job.', 2010, 8.8, 148),
('The Dark Knight', 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.', 2008, 9.0, 152),
('Interstellar', 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
 'A team of explorers travel through a wormhole in space in an attempt to save humanity.', 2014, 8.6, 169);

-- actors
INSERT INTO actors (name, imgURL) VALUES
('Leonardo DiCaprio', 'https://image.tmdb.org/t/p/original/aLUFp0zWpLVyIOgY0scIpuuKZLE.jpg'),
('Joseph Gordon-Levitt', 'https://image.tmdb.org/t/p/original/dhv9f3AaozOjpvjAwVzOWlmmT2V.jpg'),
('Ellen Page', 'https://image.tmdb.org/t/p/original/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg'),
('Christian Bale', 'https://image.tmdb.org/t/p/original/qCpZn2e3dimwbryLnqxZuI88PTi.jpg'),
('Heath Ledger', 'https://image.tmdb.org/t/p/original/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg'),
('Matthew McConaughey', 'https://image.tmdb.org/t/p/original/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg'),
('Anne Hathaway', 'https://image.tmdb.org/t/p/original/nbccV2pMoyLTCeg5DQip24Eq0Jp.jpg');
-- genres
INSERT INTO genres (name) VALUES
('Action'),
('Sci-Fi'),
('Drama'),
('Thriller');

-- Movie ↔ Actor Relationship
INSERT INTO movie_actors (movie_id, actor_id) VALUES
-- Inception actors
(1, 1), -- Leonardo DiCaprio
(1, 2), -- Joseph Gordon-Levitt
(1, 3), -- Ellen Page
-- The Dark Knight actors
(2, 4), -- Christian Bale
(2, 5), -- Heath Ledger
-- Interstellar actors
(3, 6), -- Matthew McConaughey
(3, 7); -- Anne Hathaway

-- Film ↔ Genre Relationship
INSERT INTO movie_genres (movie_id, genre_id) VALUES
-- Inception
(1, 1), (1, 2), (1, 4),
-- The Dark Knight
(2, 1), (2, 4),
-- Interstellar
(3, 2), (3, 3);

CREATE INDEX idx_movie_actors_movie_id ON movie_actors(movie_id);
CREATE INDEX idx_movie_actors_actor_id ON movie_actors(actor_id);
CREATE INDEX idx_movie_genres_movie_id ON movie_genres(movie_id);
CREATE INDEX idx_movie_genres_genre_id ON movie_genres(genre_id);

`;

async function main() {
  console.log("seeding..."); 
  
  let client;
  if (process.env.DATABASE_URL) {
      client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
      });
  } else {
      client = new Client({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,  
          database: process.env.DATABASE,
          port: process.env.DB_PORT
      });
  }

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
