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

// Get a specific book by ID
app.get("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Books.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a book
app.put("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  const updatedBookData = req.body;

  try {
    const updatedBook = await Books.findByIdAndUpdate(
      bookId,
      updatedBookData,
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Books.findByIdAndRemove(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
