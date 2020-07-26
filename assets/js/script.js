const searchForm = document.querySelector('#search-form'),
      movies = document.querySelector('#movies');

function apiSearch(e) {
    e.preventDefault();

    const searchText = document.querySelector('.form-control').value,
          server = 'https://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&language=en&query=' + searchText;

    requestApi(server);
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.send();
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) {
            movies.innerHTML = 'Download';
            return;
        }

        if (request.status !== 200) {
            movies.innerHTML = 'Ooops...something gone wrong';
            console.log('error: ' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);
        let inner = '';

        output.results.forEach((item) => {
            let nameItem = item.name || item.title;

            inner += `<div class="col-12 col-md-4 col-xl-3">${nameItem}</div>`;
        });

        movies.innerHTML = inner;
        console.log(output);
    })
}
