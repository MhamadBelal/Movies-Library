DROP TABLE IF EXISTS moveDatebase;


CREATE TABLE IF NOT EXISTS moveDatebase (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    popularity VARCHAR(500),
    character VARCHAR(255),
    original_name Date
);