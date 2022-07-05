CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (
  author,
  url,
  title,
  likes
) VALUES (
  'author1',
  'http://www.author1.com',
  'title1',
  1
);

INSERT INTO blogs (
  url,
  title
) VALUES (
  'http://www.author2.com',
  'title2'
);