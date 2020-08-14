const searchForm = document.querySelector('#search-form'),
      movies = document.querySelector('#movies'),
      urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(e) {
    e.preventDefault();

    const searchText = document.querySelector('.form-control').value;

    if (searchText.trim().length === 0) {
        movies.innerHTML = '<h2 class="col-12 text-center text-danger">The search field must not be empty</h2>';
        return;
    }

    movies.innerHTML = '<div class="spinner"></div>';

    fetch('https://api.themoviedb.org/3/search/multi?api_key=ead41c3eaac089640f31601bd088ab4e&language=en-US&query=' + searchText)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then((output) => {
            let inner = '';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">No results were found for your search</h2>';
            }

            output.results.forEach((item) => {
                let nameItem = item.name || item.title;
                const poster = item.poster_path ? urlPoster + item.poster_path : './assets/images/not-found.jpg';
                let dataInfo = '';

                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;

                inner += `<div class="col-6 col-md-4 col-xl-3 item">
                               <img class="poster" src="${poster}" alt="${nameItem}" ${dataInfo}>
                               <h5>${nameItem}</h5>
                          </div>`;
            });

            movies.innerHTML = inner;

            addEventMedia();
        })
        .catch((reason) => {
            movies.innerHTML = 'Ooops...something gone wrong';
            console.log(reason || reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movies.querySelectorAll('img[data-id]');

    media.forEach((elem) => {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    })
}

function showFullInfo() {
    let url = '';

    if (this.dataset.type === 'movie') {
        url = 'http://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=ead41c3eaac089640f31601bd088ab4e&language=en-US';
    } else if (this.dataset.type === 'tv') {
        url = 'http://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=ead41c3eaac089640f31601bd088ab4e&language=en-US';
    } else {
        movies.innerHTML = '<h2 class="col-12 text-center text-danger">An error occured, please try again later</h2>';
    }

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then((output) => {
            movies.innerHTML = `<h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
                                <div class="col-4 text-center">
                                    ${(output.poster_path === null) ?
                                            `<img src="./assets/images/not-found.jpg" alt="${output.name || output.title}">`
                                        :
                                            `<img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">`
                                        }
                                        
                                    ${(output.homepage) ?
                                            `<p class="text-center">
                                                <a href="${output.homepage}" target="_blank">Official page</a>
                                            </p>`
                                        :
                                            ''
                                    }
                                    
                                    ${(output.imdb_id) ?
                                            `<p class="text-center">
                                                <a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Page on IMDB.com</a>
                                            </p>`
                                        :
                                            ''
                                    }
                                </div>
                                <div class="col-8">
                                    <p>Rating: ${output.vote_average}</p>
                                    <p>Status: ${output.status}</p>
                                    <p>Premiere: ${output.first_air_date || output.release_date}</p>
                                    
                                    ${(output.last_episode_to_air) ?
                                            `<p>${output.number_of_seasons} seasons
                                                ${output.last_episode_to_air.episode_number} episodes released
                                            </p>`
                                        :
                                            ''
                                    }
                                    
                                    <p>Description: ${output.overview}</p>
                                    <br/>
                                    <div class="youtube"></div>
                                </div>`;

            getVideo(this.dataset.type, this.dataset.id);
        })
        .catch((reason) => {
            movies.innerHTML = 'Ooops...something gone wrong';
            console.log(reason || reason.status);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=ead41c3eaac089640f31601bd088ab4e')
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then((output) => {
            let inner = '<h4 class="col-12 text-center text-info">Popular this week</h4>';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">No results were found for your search</h2>';
            }

            output.results.forEach((item) => {
                let nameItem = item.name || item.title,
                    mediaType = item.title ? 'movie' : 'tv';
                const poster = item.poster_path ? urlPoster + item.poster_path : './assets/images/not-found.jpg';
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;

                inner += `<div class="col-6 col-md-4 col-xl-3 item">
                               <img class="poster" src="${poster}" alt="${nameItem}" ${dataInfo}>
                               <h5>${nameItem}</h5>
                          </div>`;
            });

            movies.innerHTML = inner;

            addEventMedia();
        })
        .catch((reason) => {
            movies.innerHTML = 'Ooops...something gone wrong';
            console.log(reason || reason.status);
        });
});

function getVideo(type, id) {
    let youtube = movies.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=ead41c3eaac089640f31601bd088ab4e&language=en-US`)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then((output) => {
            let videoFrame = '<h5 class="text-info">Video</h5>';

            if (output.results.length === 0) {
                videoFrame = '<p class="text-danger">Sorry, no video</p>';
            }

            output.results.forEach((item) => {
                videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}"
                                    frameborder="0" allow="accelerometer; autoplay; encrypted-media;gyroscope;
                                    picture-in-picture" allowfullscreen>
                              </frame>`;
            });

            youtube.innerHTML = videoFrame;
        })
        .catch((reason) => {
            youtube.innerHTML = 'Video is missing!';
            console.log(reason || reason.status);
        });
}
