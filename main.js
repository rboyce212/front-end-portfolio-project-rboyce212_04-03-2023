// Titles: https://omdbapi.com/?s=the_color_purple&page=1&apikey=83f03a21
// details: https://www.omdbapi.com/?i=tt0088939&apikey=83f03a21

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

//from api
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=83f03a21`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add("search-list-item");
    if (movies[i].Poster != "N/A") {
      moviePoster = movies[i].Poster;
    } else {
      moviePoster = "image-not-found.png";
    }
    movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=7f245b75`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="poster">
        <img src="${
          details.Poster != "N/A" ? details.Poster : "image-not-found.png"
        }" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Rating: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><strong>Genre:</strong> ${details.Genre}</p>
        <p class="writer"><strong>Writer:</strong> ${details.Writer}</p>
        <p class="actors"><strong>Actors:</strong> ${details.Actors}</p>
        <p class="plot"><strong>Plot:</strong> ${details.Plot}</p>
        <p class="language"><strong>Language:</strong> ${details.Language}</p>
        <p class="awards"><strong>Awards:</strong> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
