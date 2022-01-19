CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
)

INSERT INTO blogs (author, url, title) VALUES ('Giorgi', 'www.fakeblogsite.com', 'Exemplary title');
INSERT INTO blogs (author, url, title) VALUES ('Liam', 'www.myfakeblogs.au', 'Well, yes but actually no');

SELECT * FROM blogs;