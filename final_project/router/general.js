const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using promise and async-await[TASK 11]
const getBooks = () => {
    return new Promise((resolve, reject) => {
      try {
        resolve(JSON.stringify(books, null, 4));
      } catch (error) {
        reject(error);
      }
    });
  }
  
  public_users.get('/', async function (req, res) {
    try {
      const books = await getBooks();
      res.send(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// public_users.get('/',function (req, res) {
//   //Write your code here
//   //return res.status(300).json({message: "Yet to be implemented"});
//   res.send(JSON.stringify( books, null, 4))
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  res.send(book);
 });
  
// Get book details based on author using promises and async-await[TASK 12]
const getBooksByAuthor = (authorName) => {
    return new Promise((resolve, reject) => {
        try {
            let booksByAuthor = [];
            for(let key in books) {
              if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
                booksByAuthor.push(books[key])
                }   
            }
            resolve(booksByAuthor);

        } catch (error) {
        reject(error);
        }
    });
}

public_users.get('/author/:author', async function (req, res) {
    try {
        const authorName = req.params.author;
        const booksByAuthor = await getBooksByAuthor(authorName);
        res.send(booksByAuthor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
  
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   //return res.status(300).json({message: "Yet to be implemented"});
//   const authorName = req.params.author;

//   for(let key in books) {
//     if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
//       res.send(books[key]);
//     }
//   }
// });

// Get all books based on title using promises and async-await[TASK 13]
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        try {
            let booksByTitle = [];
            for(let key in books) {
              if (books[key].title.toLowerCase() === title.toLowerCase()) {
                    booksByTitle.push(books[key])
                }   
            }
            resolve(booksByTitle);
        } catch (error){
            reject(error);
        }
      });
}

public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksSelected = await getBooksByTitle(title);
        res.send(booksSelected);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   //return res.status(300).json({message: "Yet to be implemented"});
//   const title = req.params.title;

//   for(let key in books) {
//     if (books[key].title.toLowerCase() === title.toLowerCase()) {
//       res.send(books[key]);
//     }
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;

  for(let key in books) {
    if (key === isbn) {
      res.send(books[key].reviews);
    }
  }
});

module.exports.general = public_users;

