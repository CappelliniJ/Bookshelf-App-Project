 // A class representing a book
 class Book {
  // constructor to create a new Book instance
    constructor(title, author, subject) {
      this.title = title;
      this.author = author;
      this.subject = subject;
      this.comments = [];
  // method to allow comments to persist through a refresh or going to another link.
      const storedComments = JSON.parse(localStorage.getItem(`bookComments-${this.title}-${this.author}`));
      if (storedComments) {
        this.comments = storedComments;
      }
    }
  // method to add a comment to the book
    addComment(user, text) {
      const comment = {
        user,
        text: text.slice(0, 280),
        timestamp: new Date()
      };
      this.comments.push(comment);
  // Save comments for this book to local storage
      localStorage.setItem(`bookComments-${this.title}-${this.author}`, JSON.stringify(this.comments));
    }
  // method to remove a comment from the book
    removeComment(index) {
      this.comments.splice(index, 1);
    }
  // method to render the book as an HTML element
    render() {
  // create a new list item element for the book
      const bookElement = document.createElement("li");
  // set the inner HTML of the book element using template literals
      bookElement.innerHTML = `
        <h3>${this.title}</h3>
        <p>Author: ${this.author}</p>
        <p>Subject: ${this.subject}</p>
        <p>Language: ${this.language || 'English'}</p>
        <ul class="comments">
          ${this.comments.map(comment => `
            <li>
              <strong>${comment.user}:</strong> ${comment.text}
              <button class="remove-comment" data-index="${this.comments.indexOf(comment)}">Remove</button>
            </li>
          `).join('')}
        </ul>
        <button class="add-comment">Add Comment</button>
        <div class="comment-form" style="display: none;">
          <input type="text" class="comment-input" placeholder="Leave a comment...">
          <button class="send-comment">Send</button>
        </div>
      `;
  // book element references 
      const addCommentButton = bookElement.querySelector('.add-comment');
      const commentForm = bookElement.querySelector('.comment-form');
      const commentInput = bookElement.querySelector('.comment-input');
      const sendCommentButton = bookElement.querySelector('.send-comment');
      const removeCommentButtons = bookElement.querySelectorAll('.remove-comment');
  // add event listener to the add comment button
      addCommentButton.addEventListener('click', () => {
        addCommentButton.style.display = 'none';
        commentForm.style.display = 'block';
      });
  // add event listener to the send comment button
      sendCommentButton.addEventListener('click', () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
          this.addComment('User', commentText);
          commentInput.value = '';
          commentForm.style.display = 'none';
          addCommentButton.style.display = 'block';
          bookElement.innerHTML = '';
          bookElement.appendChild(this.render());
        }
      });
  // add event listeners to the remove comment button
      removeCommentButtons.forEach(button => {
        button.removeEventListener('click', () => {});
        button.addEventListener('click', () => {
          const index = button.getAttribute('data-index');
          this.removeComment(index);
          bookElement.innerHTML = '';
          bookElement.appendChild(this.render());
        });
      });
  // return the book element
      return bookElement;
    }
  }
  // a class representing Bookshelf
  class Bookshelf {
  // constructor to create a new Bookshelf instance
    constructor() {
      this.books = [];
    }
  // method to add a book to the bookshelf
    addBook(book) {
      this.books.push(book);
    }
  // method to render the bookshelf as an HTML element
    render() {
  // create a new unordered list element for the bookshelf
      const bookshelfElement = document.createElement("ul");
  // loop through each book in the bookshelf and render it as a list item element
      this.books.forEach(book => {
        const bookElement = book.render();
        bookshelfElement.appendChild(bookElement);
      });
  // return the bookshelf element
      return bookshelfElement;
    }
  
    }
    // create a new Bookshelf instance
    const bookshelf = new Bookshelf();
    // loop through the book data and create a new Book instance for each book
    bookData.forEach(data => {
      const book = new Book(data.title, data.author, data.subject);
      if (data.language) {
        book.language = data.language;
      }
      bookshelf.addBook(book);
    });
    // create a new div element to hold the bookshelf
    const bookshelfElement = document.createElement('div');
    // append the bookshelf to the div element and add the div element to the document body
    bookshelfElement.appendChild(bookshelf.render());
    document.body.appendChild(bookshelfElement);
    // get a reference to the add book form and add an event listener to it
    const addBookForm = document.getElementById('add-book-form');
    addBookForm.addEventListener('submit', (event) => {
      event.preventDefault();
    // get references to the input fields in the form
      const titleInput = document.getElementById('title-input');
      const authorInput = document.getElementById('author-input');
      const subjectInput = document.getElementById('subject-input');
      const languageInput = document.getElementById('language-input');
    // create a new Book instance with the form data
      const newBook = new Book(titleInput.value, authorInput.value, subjectInput.value);
      if (languageInput.value) {
        newBook.language = languageInput.value;
      }
    // add the new book to the bookshelf
      bookshelf.addBook(newBook);
    // clear existing bookshelf rendering and render updated bookshelf
      bookshelfElement.innerHTML = '';
      bookshelfElement.appendChild(bookshelf.render());
      addBookForm.reset();
    });