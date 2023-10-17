
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF';
const booksComplete = [];
const STORAGE_KEY_COMPLETE = 'BOOKSHELF_COMPLETED';
const deleteUnreadModal = document.getElementById('deleteReadBook')
const deleteReadModal = document.getElementById('deleteBook')

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    const parsed2 = JSON.stringify(booksComplete);
    localStorage.setItem(STORAGE_KEY, parsed);
    localStorage.setItem(STORAGE_KEY_COMPLETE, parsed2);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    // event.preventDefault();
    addBooks();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const serializedData2 = localStorage.getItem(STORAGE_KEY_COMPLETE);
  let data = JSON.parse(serializedData);
  let data2 = JSON.parse(serializedData2);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  if (data2 !== null) {
    for (const book2 of data2) {
      booksComplete.push(book2);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBooksObject(id, title, author, year, isComplete) {
  return {
    id: id,
    title: title,
    author: author,
    year: Number(year),
    isComplete: isComplete
  }
}

function addBooks() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  var isCompleted = document.getElementById('inputBookIsComplete');

  const generatedID = generateId();
  if (isCompleted.checked == true) {
    bookObject2 = generateBooksObject(generatedID, bookTitle, bookAuthor, bookYear, true);
    booksComplete.push(bookObject2);
  } else {
    bookObject = generateBooksObject(generatedID, bookTitle, bookAuthor, bookYear, false);
    books.push(bookObject);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById('form').reset()
  saveData();
  showData();
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  console.log(localStorage.getItem(STORAGE_KEY_COMPLETE));
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  console.log(booksComplete);
});


function showData() {
  var tableRead = document.getElementById('table-read');
  tableRead.innerHTML = ``;
  bookList = JSON.parse(localStorage.getItem('BOOKSHELF')) ?? [];
  bookList.forEach(function (value, i) {
    tableRead.innerHTML += `
          <tr>
              <td>${i + 1}</td>
              <td>${value.title}</td>
              <td>${value.author}</td>
              <td>${value.year}</td>
              <td><div class="btn-group" role="group">
              <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Actions
              </button>
              <ul class="dropdown-menu">
              <li><a class="dropdown-item" id"mark-read" onclick="markAsRead(${value.id},'${value.title}','${value.author}',${value.year})">Mark As Read</a></li>
                <li><a class="dropdown-item" id"delete-read"  data-bs-toggle="modal" data-bs-target="#deleteReadBook" data-bs-id="${value.id}" data-bs-title="${value.title}">Delete Book</a></li>
              </ul>
            </div></td>
          </tr>`
  });

  var tableCompleted = document.getElementById('table-complete');
  tableCompleted.innerHTML = ``;
  bookList = JSON.parse(localStorage.getItem('BOOKSHELF_COMPLETED')) ?? [];
  bookList.forEach(function (value, i) {
    tableCompleted.innerHTML += `
          <tr>
              <td>${i + 1}</td>
              <td>${value.title}</td>
              <td>${value.author}</td>
              <td>${value.year}</td>
              <td><div class="btn-group" role="group">
              <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Actions
              </button>
              <ul class="dropdown-menu">
              <li><a class="dropdown-item" id"mark-unread" onclick="markUnread(${value.id},'${value.title}','${value.author}',${value.year})">Mark As Unread</a></li>
                <li><a class="dropdown-item" id"delete-complete" data-bs-toggle="modal" data-bs-target="#deleteBook" data-bs-id="${value.id}" data-bs-title="${value.title}">Delete Book</a></li>
              </ul>
            </div></td>
          </tr>`
  });
}

function markAsRead(id1, title1, author1, year1) {
  if (id1) {
    var item = [{
      id: id1,
      title: title1,
      author: author1,
      year: year1,
      isComplete: true,
    }];
    bookList = JSON.parse(localStorage.getItem('BOOKSHELF_COMPLETED')) ?? []
    booksTest = item.concat(bookList);
    var itemString = JSON.stringify(booksTest);
    localStorage.setItem('BOOKSHELF_COMPLETED', itemString);
  }

  bookList4 = JSON.parse(localStorage.getItem('BOOKSHELF')) ?? []
  bookList4 = bookList4.filter(function (value) {
    return value.id != id1;
  });
  localStorage.setItem('BOOKSHELF', JSON.stringify(bookList4))
  showData()
}

function markUnread(id1, title1, author1, year1) {
  if (id1) {
    var item = [{
      id: id1,
      title: title1,
      author: author1,
      year: year1,
      isComplete: false,
    }];
    bookList = JSON.parse(localStorage.getItem('BOOKSHELF')) ?? []
    booksTest = item.concat(bookList);
    var itemString = JSON.stringify(booksTest);
    localStorage.setItem('BOOKSHELF', itemString);
  }

  bookList4 = JSON.parse(localStorage.getItem('BOOKSHELF_COMPLETED')) ?? []
  bookList4 = bookList4.filter(function (value) {
    return value.id != id1;
  });
  localStorage.setItem('BOOKSHELF_COMPLETED', JSON.stringify(bookList4))
  showData()
}

function removeUnread(id) {
  bookList = JSON.parse(localStorage.getItem('BOOKSHELF')) ?? []
  bookList = bookList.filter(function (value) {
    return value.id != id;
  });
  localStorage.setItem('BOOKSHELF', JSON.stringify(bookList))
  showData()
}

if (deleteUnreadModal) {
  deleteUnreadModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget
    const recipient = button.getAttribute('data-bs-title')
    const modalTitle = deleteUnreadModal.querySelector('.modal-title')
    modalTitle.textContent = `Delete ${recipient} ?`
    document.getElementById("yes-delete").addEventListener("click", function () {
      const idBooks = button.getAttribute('data-bs-id')
      removeUnread(idBooks)
    });

  })
}

if (deleteReadModal) {
  deleteReadModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget
    const recipient = button.getAttribute('data-bs-title')
    const modalTitle = deleteReadModal.querySelector('.modal-title')
    modalTitle.textContent = `Delete ${recipient} ?`
    document.getElementById("yes-delete-complete").addEventListener("click", function () {
      const idBooks = button.getAttribute('data-bs-id')
      removeread(idBooks)
    });

  })
}

function removeread(id) {
  bookList = JSON.parse(localStorage.getItem('BOOKSHELF_COMPLETED')) ?? []
  bookList = bookList.filter(function (value) {
    return value.id != id;
  });
  localStorage.setItem('BOOKSHELF_COMPLETED', JSON.stringify(bookList))
  showData()
}
