{
  'use strict';

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    booksCover: {
      images: '.book__image',
    }
  };


  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };


  class Bookslist {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.initActions();
      thisBooksList.determineRatingBgc();
      thisBooksList.renderBooks();
    }

    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;

      thisBooksList.favoriteBooks = [];     //tablica na ulubione książki
      thisBooksList.filters = [];           //tablica na przeflitrowane książki (z ćw. 5)
    }

    getElements() {
      const thisBooksList = this;
      thisBooksList.booksContainer = document.querySelector(select.containerOf.booksList);
      thisBooksList.booksFiltered = document.querySelector(select.containerOf.filters);
    }

    /* ĆW. 2 - DODANIE KSIĄŻEK DO ULUBIONYCH */

    initActions() {
      const thisBooksList = this;

      //utworzenie listenera na event 'click'
      thisBooksList.booksContainer.addEventListener('click', function (event) {
        event.preventDefault();
        const image = event.target.offsetParent;        //z ćw. 4 - zastosowanie właściwości offsetParent
        const idBook = image.getAttribute('data-id');
        console.log('click');

        //pętla dodania klikniętej książki do tablicy favoriteBooks
        if (!thisBooksList.favoriteBooks.includes(idBook)) {
          image.classList.add('favorite');
          thisBooksList.favoriteBooks.push(idBook);
          console.log(idBook);

        /* ĆW. 3 - USUNIĘCIE KSIĄŻEK Z ULUBIONYCH */
        } else {
          image.classList.remove('favorite');
          thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(idBook), 1);
        }
      });


      /* ĆW. 5 - FILTROWANIE KSIĄŻEK PRZY UŻYCIU FORMULARZA */

      thisBooksList.booksFiltered.addEventListener('change', function (event) {
        event.preventDefault();
        const clickedForm = event.target;
        if (clickedForm.type === 'checkbox' && clickedForm.tagName === 'INPUT' && clickedForm.name === 'filter') {
          if (clickedForm.checked == true) {
            thisBooksList.filters.push(clickedForm.value);
          } else {
            thisBooksList.filters.splice(thisBooksList.filters.indexOf(clickedForm.value), 1);
          }
        }
        thisBooksList.filterBooks();
      });
    }

    /* ĆW. 5 - ETAP 2 */

    filterBooks() {
      const thisBooksList = this;

      for (let book of thisBooksList.data) {
        let shouldBeHidden = false;
        for (const filter of thisBooksList.filters) {     //pętla przechodząca po tablicy filters[] - ustala czy dany filtr pasuje do inf o książce
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;                                        //przerwanie działania pętli
          }
        }
        if (shouldBeHidden) {
          const bookCover = document.querySelector('.book__image[data-id="' + book.id + '"]');
          bookCover.classList.add('hidden');
        } else {
          const bookCover = document.querySelector('.book__image[data-id="' + book.id + '"]');
          bookCover.classList.remove('hidden');
        }
      }
    }

    /* ĆW. 6 - KOLOROWY PASEK OCENY KSIĄŻEK */

    determineRatingBgc(rating) {      //ma przyjmować jako argument rating i zwracać odpowiedni background

      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';     //te wartości mają być traktowane jako zwykły string
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }

    renderBooks() {
      const thisBooksList = this;

      for (let book of thisBooksList.data) {
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);  //równa temu co zwróci determineRatingBgc dla rating danej książki
        const ratingWidth = book.rating * 10;                             //ustala długość paska
        const generatedHTML = templates.bookTemplate({
          id: book.id,
          name: book.name,
          price: book.price,
          image: book.image,
          rating: book.rating,
          ratingBgc,          
          ratingWidth,        
        });

      const element = utils.createDOMFromHTML(generatedHTML);

      thisBooksList.booksContainer.appendChild(element);
      }
    }
  }

  const app = new Bookslist();
  app;
}
