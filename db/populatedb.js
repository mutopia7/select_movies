// 

require("dotenv").config();
const { Client } = require("pg");

const SQL = `
-- ===== tables =====

-- movies table
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    imgURL TEXT,
    descript TEXT,
    year INT,
    imdb_score NUMERIC(3,1),
    length INT
);

-- actors table
CREATE TABLE IF NOT EXISTS actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    imgURL TEXT
);

-- genres table
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- movie_actors mediator table
CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    actor_id INT REFERENCES actors(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, actor_id)
);

-- movie_genres mediator table
CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- ===== sample data =====

-- movies
INSERT INTO movies (title, imgURL, descript, year, imdb_score, length) VALUES
('Inception', 'https://image.tmdb.org/t/p/original/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
 'A thief who enters the dreams of others to steal secrets must pull off one last job.', 2010, 8.8, 148)
ON CONFLICT (title) DO NOTHING;

INSERT INTO movies (title, imgURL, descript, year, imdb_score, length) VALUES
('The Dark Knight', 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
 'Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.', 2008, 9.0, 152)
ON CONFLICT (title) DO NOTHING;

INSERT INTO movies (title, imgURL, descript, year, imdb_score, length) VALUES
('Interstellar', 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
 'A team of explorers travel through a wormhole in space in an attempt to save humanity.', 2014, 8.6, 169)
ON CONFLICT (title) DO NOTHING;

-- actors
INSERT INTO actors (name, imgURL) VALUES
('Leonardo DiCaprio', 'https://image.tmdb.org/t/p/original/aLUFp0zWpLVyIOgY0scIpuuKZLE.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actors (name, imgURL) VALUES
('Joseph Gordon-Levitt', 'https://image.tmdb.org/t/p/original/dhv9f3AaozOjpvjAwVzOWlmmT2V.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actors (name, imgURL) VALUES
('Ellen Page', 'https://image.tmdb.org/t/p/original/eCeFgzS8dYHnMfWQT0oQitCrsSz.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actors (name, imgURL) VALUES
('Christian Bale', 'https://image.tmdb.org/t/p/original/qCpZn2e3dimwbryLnqxZuI88PTi.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actors (name, imgURL) VALUES
('Heath Ledger', 'https://image.tmdb.org/t/p/original/5Y9HnYYa9jF4NunY9lSgJGjSe8E.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actors (name, imgURL) VALUES
('Matthew McConaughey', 'https://image.tmdb.org/t/p/original/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO actors (name, imgURL) VALUES
('Anne Hathaway', 'https://image.tmdb.org/t/p/original/nbccV2pMoyLTCeg5DQip24Eq0Jp.jpg')
ON CONFLICT (name) DO NOTHING;

-- genres
INSERT INTO genres (name) VALUES ('Action') ON CONFLICT (name) DO NOTHING;
INSERT INTO genres (name) VALUES ('Sci-Fi') ON CONFLICT (name) DO NOTHING;
INSERT INTO genres (name) VALUES ('Drama') ON CONFLICT (name) DO NOTHING;
INSERT INTO genres (name) VALUES ('Thriller') ON CONFLICT (name) DO NOTHING;

-- movie_actors relationships
INSERT INTO movie_actors (movie_id, actor_id) VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO movie_actors (movie_id, actor_id) VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO movie_actors (movie_id, actor_id) VALUES (1, 3) ON CONFLICT DO NOTHING;
INSERT INTO movie_actors (movie_id, actor_id) VALUES (2, 4) ON CONFLICT DO NOTHING;
INSERT INTO movie_actors (movie_id, actor_id) VALUES (2, 5) ON CONFLICT DO NOTHING;
INSERT INTO movie_actors (movie_id, actor_id) VALUES (3, 6) ON CONFLICT DO NOTHING;
INSERT INTO movie_actors (movie_id, actor_id) VALUES (3, 7) ON CONFLICT DO NOTHING;

-- movie_genres relationships
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 4) ON CONFLICT DO NOTHING;
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 4) ON CONFLICT DO NOTHING;
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 2) ON CONFLICT DO NOTHING;
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 3) ON CONFLICT DO NOTHING;

-- indexes
CREATE INDEX IF NOT EXISTS idx_movie_actors_movie_id ON movie_actors(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_actors_actor_id ON movie_actors(actor_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_movie_id ON movie_genres(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre_id ON movie_genres(genre_id);
`;


  
async function populateDb() {
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

  // بررسی اینکه جدول movies پر است یا نه
  try {
    const res = await client.query("SELECT COUNT(*) AS count FROM movies");
    if (parseInt(res.rows[0].count) > 0) {
      console.log("DB already populated, skipping.");
      await client.end();
      return;
    }
  } catch (err) {
    // جدول وجود ندارد یا خطا، ادامه به ایجاد جدول‌ها و داده‌ها
    console.log("Movies table not found, populating DB...");
  }

  await client.query(SQL);
  await client.end();
  console.log("DB populated successfully.");
}




module.exports = populateDb;