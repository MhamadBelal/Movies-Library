DROP TABLE IF EXISTS moveDatebase;


CREATE TABLE IF NOT EXISTS moveDatebase (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    summary VARCHAR(255),
    mins VARCHAR(255)
);