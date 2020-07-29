const searchForm = document.querySelector('#search-form'),
      movies = document.querySelector('#movies');

function apiSearch(e) {
    e.preventDefault();

    const searchText = document.querySelector('.form-control').value,
          server = 'https://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&language=en&query=' + searchText;

    movies.innerHTML = 'Download';

    requestApi(server)
        .then((result) => {
            const output = JSON.parse(result);
            let inner = '';

            output.results.forEach((item) => {
                let nameItem = item.name || item.title;

                inner += `<div class="col-12 col-md-4 col-xl-3">${nameItem}</div>`;
            });

            movies.innerHTML = inner;
        })
        .catch((reason) => {
            movies.innerHTML = 'Ooops...something gone wrong';
            console.log('error: ' + reason.status);
        })
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open('GET', url);
        request.addEventListener('load', () => {
            if (request.status !== 200) {
                reject({status: request.status});
                return;
            }

            resolve(request.response)
        });

        request.addEventListener('error', () => {
            reject({status: request.status});
        });
        request.send();
    });
}
