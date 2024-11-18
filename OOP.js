// Book Class
class Book {
    constructor(title, author, isbn, availableCopies) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.availableCopies = availableCopies;
    }

    borrowBook() {
        if (this.availableCopies > 0) {
            this.availableCopies -= 1;
        } else {
            throw new Error(`No available copies of "${this.title}" to borrow.`);
        }
    }

    returnBook() {
        this.availableCopies += 1;
    }
}

// Abstract User Class
class User {
    constructor(name, userType) {
        if (new.target === User) {
            throw new Error("Cannot instantiate abstract class User directly.");
        }
        this.name = name;
        this.userType = userType;
        this.borrowedBooks = [];
    }

    borrow(book) {
        throw new Error("Abstract method 'borrow' must be implemented in subclasses.");
    }

    return(book) {
        const index = this.borrowedBooks.indexOf(book);
        if (index > -1) {
            this.borrowedBooks.splice(index, 1);
            book.returnBook();
        } else {
            throw new Error(`Book "${book.title}" was not borrowed by ${this.name}.`);
        }
    }
}

// Student Class (inherits from User)
class Student extends User {
    constructor(name) {
        super(name, "Student");
        this.borrowLimit = 3;
    }

    borrow(book) {
        if (this.borrowedBooks.length >= this.borrowLimit) {
            throw new Error(`${this.name} has reached the borrowing limit of ${this.borrowLimit} books.`);
        }
        if (book.availableCopies === 0) {
            throw new Error(`No available copies of "${book.title}" to borrow.`);
        }
        book.borrowBook();
        this.borrowedBooks.push(book);
    }
}

// Teacher Class (inherits from User)
class Teacher extends User {
    constructor(name) {
        super(name, "Teacher");
        this.borrowLimit = 5;
    }

    borrow(book) {
        if (this.borrowedBooks.length >= this.borrowLimit) {
            throw new Error(`${this.name} has reached the borrowing limit of ${this.borrowLimit} books.`);
        }
        if (book.availableCopies === 0) {
            throw new Error(`No available copies of "${book.title}" to borrow.`);
        }
        book.borrowBook();
        this.borrowedBooks.push(book);
    }
}

// Library Class
class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    addUser(user) {
        this.users.push(user);
    }

    borrowBook(user, book) {
        try {
            user.borrow(book);
            console.log(`${user.name} borrowed "${book.title}".`);
        } catch (error) {
            console.error(error.message);
        }
    }

    returnBook(user, book) {
        try {
            user.return(book);
            console.log(`${user.name} returned "${book.title}".`);
        } catch (error) {
            console.error(error.message);
        }
    }

    listAvailableBooks() {
        console.log("Available Books:");
        this.books.forEach(book => {
            if (book.availableCopies > 0) {
                console.log(`${book.title} by ${book.author} - Copies Available: ${book.availableCopies}`);
            }
        });
    }
}

// Example Usage
const library = new Library();

// Add Books
const book1 = new Book("JavaScript: The Good Parts", "Douglas Crockford", "9780596517748", 3);
const book2 = new Book("Eloquent JavaScript", "Marijn Haverbeke", "9781593279509", 2);
library.addBook(book1);
library.addBook(book2);

// Add Users
const student = new Student("Alice");
const teacher = new Teacher("Bob");
library.addUser(student);
library.addUser(teacher);

// Borrowing and Returning Books
library.borrowBook(student, book1); // Successful borrow
library.borrowBook(teacher, book2); // Successful borrow

library.borrowBook(student, book2); // Another borrow by student
library.returnBook(student, book2); // Return by student

library.listAvailableBooks(); // List available books
