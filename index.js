const express = require("express");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const app = express();

const { initializeDatabase } = require("./db/db.connection");
const { Books } = require("./models/book.model");

app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

// const newBook = {
//   title: "To Kill a Mockingbird",
//   author: "Harper Lee",
//   genre: "Fiction",
// };

// async function createBook(newBook) {
//   try {
//     const book = new Books(newBook);
//     const saveBook = await book.save();
//     console.log("New Book data:", saveBook);
//   } catch (error) {
//     throw error;
//   }
// }

// createBook(newBook);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/books", async (req, res) => {
  try {
    const allbooks = await Books.find();
    res.json(allbooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  const { title, author, genre } = req.body;

  try {
    const bookData = new Books({ title, author, genre });
    await bookData.save();
    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
