
//Fetch movie data

//Inside response object will be the data that we will get back from our API, which will be available once the promise has fulfilled.

//With axios you can add a second parameter, an object, which we can append to the http request to edit the address. Object called params and has lower case keys.

const autoCompleteConfig = {
  renderOption(movie) {
    //Add check of image source of 'N/A'...
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
  `
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '4385a40a',
        s: searchTerm
      }
    });
  
    //If no film found then return an empty array. Otherwise later onInput will try and loop through the results, and an error message would be displayed.
    if (response.data.Error) {
      return [];
    }
  
    //Returns a PROMISE
    return response.data.Search;
  }
}

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    let pageElement = document.querySelector('#left-summary');
    onMovieSelect(movie, pageElement, 'left');
  },
  root: document.querySelector('#left-autocomplete'),
})

createAutoComplete({
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    let pageElement = document.querySelector('#right-summary');
    onMovieSelect(movie, pageElement, 'right');
  },
  root: document.querySelector('#right-autocomplete'),
})





//onMovieSelect helper function needs to (1) get ID, (2) make new request (3) display relevant information.

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, pageElement, side) => {
  const movieId = movie.imdbID;

  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '4385a40a',
      i: movieId
    }
  });

  //Select element for our summary and add in HTML. Create another helper function to minimise function size.
  pageElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  //Once both film variables are populated, run the comparison.

  if (leftMovie && rightMovie) {
    runComparison();
  }
  
}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );
 
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
 
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
 
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};


const movieTemplate = ({Poster, Title, Genre, Plot, Awards, BoxOffice, Metascore, imdbRating, imdbVotes}) => {

  let dollars = parseInt(BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  let metascore = parseInt(Metascore);
  //Use parse.Float to keep decimal on IMDB Rating.
  let imdbRatingNumber = parseFloat(imdbRating);
  let imdbVotesNumber = parseInt(imdbVotes.replace(/,/g, ''));
  //Split on empty space. Iterate over array. Return a total of all numbers.
  
  const awards = Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if(isNaN(value)) {
      return prev;
    } else {
      return prev + value
    }

  }, 0)



  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${Title}</h1>
          <h4>${Genre}</h4>
          <p>${Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${Awards}</p>
      <p class="subtitle">Awards and Nominations</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRatingNumber} class="notification is-primary">
      <p class="title">${imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotesNumber} class="notification is-primary">
      <p class="title">${imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}




