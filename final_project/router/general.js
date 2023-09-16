const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1: Get the list of books available in the shop
public_users.get('/', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const bookList = Object.values(books);
        res.status(200).json(bookList);
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const author = req.params.author;
        const matchingBooks = [];

        for (const isbn in books) {
            if (books[isbn].author === author) {
                matchingBooks.push(books[isbn]);
            }
        }

        if (matchingBooks.length > 0) {
            res.status(200).json(matchingBooks);
        } else {
            res.status(404).json({ message: 'Books by author not found' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const title = req.params.title;
        const matchingBooks = [];

        for (const isbn in books) {
            if (books[isbn].title === title) {
                matchingBooks.push(books[isbn]);
            }
        }

        if (matchingBooks.length > 0) {
            res.status(200).json(matchingBooks);
        } else {
            res.status(404).json({ message: 'Books by title not found' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (book && book.reviews) {
            res.status(200).json(book.reviews);
        } else {
            res.status(404).json({ message: 'Book reviews not found' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 6: Register a new user
public_users.post("/register", function (req, res) {
    const { username, password } = req.body;

    // Check if the username already exists
    if (users.find((user) => user.username === username)) {
        res.status(400).json({ message: 'Username already exists' });
    } else if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
    } else {
        // Add the new user (in a real app, you'd securely store passwords)
        users.push({ username, password });
        res.status(201).json({ message: 'User registered successfully' });
    }
});

// Task 10: Get the list of books available in the shop using Promise callbacks
public_users.get('/async-books', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        // Simulate an asynchronous operation using a Promise
        const getBooksPromise = new Promise((resolve, reject) => {
            // Replace this logic with your actual data retrieval logic
            const bookList = Object.values(books);
            if (bookList) {
                resolve(bookList); // Resolve with the book list
            } else {
                reject({ message: 'Books not found' }); // Reject with an error message
            }
        });

        // Handle the Promise using callbacks
        getBooksPromise
            .then((bookList) => {
                res.status(200).json(bookList); // Respond with the book list
            })
            .catch((error) => {
                res.status(404).json(error); // Respond with an error message
            });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/async-isbn/:isbn', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const isbn = req.params.isbn;

        // Simulate an asynchronous operation using a Promise
        const getBookByIsbnPromise = new Promise((resolve, reject) => {
            // Replace this logic with your actual data retrieval logic
            const book = books[isbn];
            if (book) {
                resolve(book); // Resolve with the book
            } else {
                reject({ message: 'Book not found' }); // Reject with an error message
            }
        });

        // Handle the Promise using callbacks
        getBookByIsbnPromise
            .then((book) => {
                res.status(200).json(book); // Respond with the book
            })
            .catch((error) => {
                res.status(404).json(error); // Respond with an error message
            });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 12: Get book details based on Author using Promise callbacks
public_users.get('/async-author/:author', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const author = req.params.author;

        // Simulate an asynchronous operation using a Promise
        const getBooksByAuthorPromise = new Promise((resolve, reject) => {
            // Replace this logic with your actual data retrieval logic
            const matchingBooks = Object.values(books).filter((book) => book.author === author);
            if (matchingBooks.length > 0) {
                resolve(matchingBooks); // Resolve with matching books
            } else {
                reject({ message: 'Books by author not found' }); // Reject with an error message
            }
        });

        // Handle the Promise using callbacks
        getBooksByAuthorPromise
            .then((matchingBooks) => {
                res.status(200).json(matchingBooks); // Respond with matching books
            })
            .catch((error) => {
                res.status(404).json(error); // Respond with an error message
            });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Task 13: Get book details based on Title using Promise callbacks
public_users.get('/async-title/:title', function (req, res) {
    // Check if the user is valid before proceeding
    if (isValid(req.user)) {
        const title = req.params.title;

        // Simulate an asynchronous operation using a Promise
        const getBooksByTitlePromise = new Promise((resolve, reject) => {
            // Replace this logic with your actual data retrieval logic
            const matchingBooks = Object.values(books).filter((book) => book.title === title);
            if (matchingBooks.length > 0) {
                resolve(matchingBooks); // Resolve with matching books
            } else {
                reject({ message: 'Books by title not found' }); // Reject with an error message
            }
        });

        // Handle the Promise using callbacks
        getBooksByTitlePromise
            .then((matchingBooks) => {
                res.status(200).json(matchingBooks); // Respond with matching books
            })
            .catch((error) => {
                res.status(404).json(error); // Respond with an error message
            });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

module.exports.general = public_users;
