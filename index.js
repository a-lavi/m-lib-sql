const path = require('path');
const {patchTable} = require('./controllers/db_operations')
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");
const books = [
  {
    author: "Mark Twain",
    title: "Hukleberry Finn",
    releaseYear: 1884,
  },
  {
    author: "Frank Herbert",
    title: "Dune",
    releaseYear: 1965,
  },
];
const port = process.env.PORT || 8080;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: true,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.render("greeting");
});

app.get('/api/book/new', (req, res)=>{
  res.render("newbook");
});


app.get("/api/book/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * from books WHERE id = $1;", [id])
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.status(400).send({
        error: e.message,
      });
    });
});
app.get("/api/book", (req, res) => {
  pool
  .query(`SELECT books.title, books.id as book_id, author.id as author_id, author.name FROM books
    Left JOIN author on author.id= books.author_id;`)
    .then((data) => {
      
      res.json(data.rows);
      
    })
    .catch((e) => {
      res.status(400).send({
        error: e.message,
      });
    });
});
app.get("/api/author", (req, res) => {
  pool
  .query(`SELECT * from author;`)
    .then((data) => {
      
      res.json(data.rows);
      
    })
    .catch((e) => {
      res.status(400).send({
        error: e.message,
      });
    });
});

app.patch('/api/author/:id', (req, res) => {
  const { id } = req.params
  const fieldMapping = {
      name: 'name',
      birthYear: 'birth_year'
  }
  console.log(Object.keys(req.body) )

  const updates = Object.keys(req.body).map((param) => {
      return {
          field: fieldMapping[param],
          value: req.body[param]
      }
  })
  patchTable(pool, 'author', updates, id)
  .then(() => {
      res.send({status: 'updated'})
  })
})

app.post("/api/book", (req, res) => {
  const {author_id, title,release_year}= req.body;
  console.log(author_id)
  pool
    .query(
      `INSERT INTO  books (author_id,  title, release_year)
     VALUES ($1, $2, $3)
    returning *
    ;`,
      [author_id, title, release_year]
    )
    .then((data) => {
      res.status(201).send(data)
    })
    .catch((e) => {
      res.status(400).send({
        error: e.message
      });
    });
});
console.log(process.env.PG_PORT);
app.listen(port, () => console.log("Connected "));
