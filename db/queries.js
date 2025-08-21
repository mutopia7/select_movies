const pool = require("./pool");

async function getAllMovies() {
    const { rows } = await pool.query("SELECT * FROM movies");
    return rows
}

async function getDetailMovie(id) {
  const { rows } = await pool.query(
    `
    SELECT 
      m.*,

      -- فقط نام بازیگرها در یک آرایه
      COALESCE(
        array_agg(DISTINCT a.name) FILTER (WHERE a.id IS NOT NULL),
        '{}'
      ) AS actors,

      -- فقط نام ژانرها در یک آرایه
      COALESCE(
        array_agg(DISTINCT g.name) FILTER (WHERE g.id IS NOT NULL),
        '{}'
      ) AS genres

    FROM movies m
    LEFT JOIN movie_actors ma ON m.id = ma.movie_id
    LEFT JOIN actors a ON ma.actor_id = a.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.id = $1
    GROUP BY m.id
    `,
    [id]
  );

  return rows[0] || null;
}


async function getAllActors() {
  const { rows } = await pool.query(
    `
    SELECT 
      a.*,

      -- لیست فیلم‌ها با id و title
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', m.id,
            'title', m.title
          )
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS movies

    FROM actors a
    LEFT JOIN movie_actors ma ON a.id = ma.actor_id
    LEFT JOIN movies m ON ma.movie_id = m.id
    GROUP BY a.id
    ORDER BY a.id;
    `
  );

  return rows;
}



async function getAllGenres() {
  const { rows } = await pool.query(
    `
    SELECT 
      g.*,

      -- لیست فیلم‌ها با id و title
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', m.id,
            'title', m.title
          )
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS movies

    FROM genres g
    LEFT JOIN movie_genres mg ON g.id = mg.genre_id
    LEFT JOIN movies m ON mg.movie_id = m.id
    GROUP BY g.id
    ORDER BY g.id;
    `
  );

  return rows;
}


module.exports = {
    getAllMovies,
    getDetailMovie,
    getAllActors,
    getAllGenres
}