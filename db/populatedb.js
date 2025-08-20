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
('Inception', 'http://www.impawards.com/2010/posters/inception_xlg.jpg',
 'A thief who enters the dreams of others to steal secrets must pull off one last job.', 2010, 8.8, 148),
('The Dark Knight', 'http://www.impawards.com/2008/posters/dark_knight.jpg',
 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.', 2008, 9.0, 152),
('Interstellar', 'http://www.impawards.com/2014/posters/interstellar_ver2.jpg',
 'A team of explorers travel through a wormhole in space in an attempt to save humanity.', 2014, 8.6, 169);

-- actors
INSERT INTO actors (name, imgURL) VALUES
('Leonardo DiCaprio', 'https://media.gettyimages.com/id/1921103033/photo/academy-of-motion-picture-arts-sciences-14th-annual-governors-awards.jpg?s=1024x1024&w=gi&k=20&c=g6Zf-TKdOb34jo1RtaJkzCAMtH-A0Mxz4MQFJyd3TeY='),
('Joseph Gordon-Levitt', 'https://media.gettyimages.com/id/999060696/photo/comedy-central-roast-of-bruce-willis-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=Wcn9TqPbflXtP4neTYSqENrln_2LIozJsENkmwfqyAk='),
('Ellen Page', 'https://media.gettyimages.com/id/2155637712/photo/close-to-you-premiere-newfest-pride.jpg?s=1024x1024&w=gi&k=20&c=FRHyxLjeAFcPvda0UYG_CWQAtLjtXDkUArVpNyYnmG0='),
('Christian Bale', 'https://media.gettyimages.com/id/1449315110/photo/the-pale-blue-eye-los-angeles-premiere-photo-call.jpg?s=1024x1024&w=gi&k=20&c=a-VAwELB-B0RNdbODjmRGi961to3P3S-sjhpM4_NwqU='),
('Heath Ledger', 'https://media.gettyimages.com/id/71825351/photo/tiff-portrait-session-for-candy.jpg?s=1024x1024&w=gi&k=20&c=ofA_wFAZ5tpyVj21h8Q0eLFyJuLFZj4AiSDlkWBSZ_Y='),
('Matthew McConaughey', 'https://media.gettyimages.com/id/2204462198/photo/the-rivals-of-amziah-king-world-premiere-2025-sxsw-conference-and-festival.jpg?s=1024x1024&w=gi&k=20&c=UTH5zvSVCU5sLZdjLOViyNNN0Q8y9_jsOSYfiB0mBOc='),
('Anne Hathaway', 'https://media.gettyimages.com/id/2036419967/photo/30th-annual-screen-actors-guild-awards-arrivals.jpg?s=1024x1024&w=gi&k=20&c=MxCLRuEu3C4NctT0MyPEEgl5EfDUyfx94vFU9JYAPfA=');

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
