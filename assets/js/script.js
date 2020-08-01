const searchForm = document.querySelector('#search-form'),
      movies = document.querySelector('#movies'),
      urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(e) {
    e.preventDefault();

    const searchText = document.querySelector('.form-control').value,
          server = 'https://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&language=en&query=' + searchText;

    movies.innerHTML = 'Download';

    fetch(server)
        .then((value) => {
            return value.json();
        })
        .then((output) => {
            let inner = '';

            output.results.forEach((item) => {
                let nameItem = item.name || item.title;

                inner += `<div class="col-12 col-md-4 col-xl-3 item">
                            <img src="${urlPoster + item.poster_path}" alt="${nameItem}">
                            <h5>${nameItem}</h5>
                          </div>`;
            });

            movies.innerHTML = inner;
        })
        .catch((reason) => {
            movies.innerHTML = 'Ooops...something gone wrong';
            console.log('error: ' + reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);
