const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Sample registered users data (you should have your own user database)
let users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
];

const isValid = (username) => {
    // Task 6: Check if the username is valid (exists in the user database)
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Task 7: Check if username and password match the records
    return users.some((user) => user.username === username && user.password === password);
}

    // Task 7: Login as a registered user
regd_users.post("/login", function (req, res) {
    const { username, password } = req.body;

    // Authenticate the user
    const authenticated = authenticatedUser(username, password);

    if (authenticated) {
        // Create a JWT and save it in the session
        const token = jwt.sign({ username }, 'secret-key');
        req.session.token = token;
        req.session.username = username; // Store the username in the session
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});


// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username;

    if (!isbn || !review) {
        res.status(400).json({ message: 'ISBN and review are required' });
    } else {
        if (books[isbn]) {
            // Check if the user has already reviewed this book
            if (books[isbn].reviews && books[isbn].reviews[username]) {
                // Modify the existing review
                books[isbn].reviews[username] = review;
            } else {
                // Add a new review
                if (!books[isbn].reviews) {
                    books[isbn].reviews = {};
                }
                books[isbn].reviews[username] = review;
            }
            res.status(200).json({ message: 'Review added/modified successfully' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!isbn) {
        res.status(400).json({ message: 'ISBN is required' });
    } else if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        // Delete the user's review for this book
        delete books[isbn].reviews[username];
        res.status(200).json({ message: 'Review deleted successfully' });
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
