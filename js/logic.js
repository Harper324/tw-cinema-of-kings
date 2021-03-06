function formatGenresToArray(data) {
    return data.map(ele => {
        ele.genres = ele.genres.split(',');
        return ele;
    })
}

function slideShow() {
    const images = ["http://ww1.sinaimg.cn/large/a85d55ddly1fz3ttvmat8j20g4096gn8.jpg",
        "http://ww1.sinaimg.cn/large/a85d55ddly1fz3tydey73j20rs0goh3e.jpg",
        "http://ww1.sinaimg.cn/large/a85d55ddly1fz3u2l7hl0j21180n7q9z.jpg"];
    let i = 0;
    displayImage(images, i);
}
function displayImage(images, i) {
    document.getElementById('slideShowImg').src = images[i];
    let pageNumber = ['○', '○', '○'];
    pageNumber[i] = '●';
    document.getElementById('imgNumber').innerHTML = pageNumber.join('');
    playImages(images, i);

}

function playImages(images, i) {
    setTimeout(() => {
        i++;
        displayImage(images, i % 3);
    }, 3000);
}


function showMovieSortTable() {
    const sortArr = getSortArr();
    const liTags = sortArr.map(sortName => `<li>${sortName}</li>`);
    document.getElementById('movieSortTable').innerHTML = liTags.join('\n');
}

function getSortArr() {
    const movies = getMoviesFromStorage();
    const movieSorts = movies.reduce((sortArr, movie) => sortArr = sortArr.concat(movie.genres), ['全部']);
    return movieSorts.filter((sort, index, sortArr) => sortArr.indexOf(sort) === index);
}

function showSearchSortTable() {
    const searchSorts = getSearchSort();
    const liTags = searchSorts.map(sortName => `<li>${sortName}</li>`);
    document.getElementById('movieSortTable').innerHTML = liTags.join('\n');
}

function getSearchSort() {
    const searchMovies = getSearchMovies();
    const searchSorts = searchMovies.reduce((sortArr, movie) => sortArr = sortArr.concat(movie.genres), []);
    return searchSorts.filter((sort, index, sortArr) => sortArr.indexOf(sort) === index);

}

function getSearchMovies() {
    const searchContent = getSearchContentFromUrl();
    if (Number(searchContent)) {
        return getIdSearchResult(searchContent);
    } else {
        return getNameSearchResult(searchContent);
    }

}

function getSortName(event) {
    if (event.target.tagName.toLowerCase() === 'li') {
        changeClickedSortColor(event);
        storageSortName(event.target.innerHTML);
        return event.target.innerHTML;
    }
    return
}

function changeClickedSortColor(event) {
    const liTags = document.getElementsByTagName('li');
    for (i = 0; i < liTags.length; i++) {
        liTags[i].style.color = 'black';
    }
    event.target.style.color = '#27a';
}

function toShowMoviesBySort(event) {
    const sortName = getSortName(event);
    const movies = getMoviesFromStorage();
    const sortMovies = getMoviesBySort(sortName, movies);
    storageSortMovies(sortMovies);
    showMoviesBySort(sortMovies, 10);
}

function showMoviesBySearchSort(event) {
    const sortName = getSortName(event);
    const searchMoives = getSearchResult();
    const sortMovies = getMoviesBySort(sortName, searchMoives);
    storageSortMovies(sortMovies);
    showMoviesBySort(sortMovies, 10);
}

function showMoviesBySort(sortMovies, movieNumber) {
    const movieDivs = getMovieDivs(sortMovies);
    if (!movieNumber || movieDivs.length <= movieNumber) {
        document.getElementById('recommend').innerHTML = movieDivs.join('\n');
    }
    else {
        document.getElementById('recommend').innerHTML = movieDivs.slice(0, movieNumber).join('\n')
            + `<p id="moreMovies" onclick = "showMoreMoviesListener()">更多>></p>`;
    }
}

function showMoreMovies() {
    const sortMovies = getSortMoviesInStorage();
    showMoviesBySort(sortMovies);
}

function getMoviesBySort(sortName, movies) {
    if (sortName !== '全部') {
        movies = movies.filter(movie => movie.genres.includes(sortName));
    }
    return movies;
}

function getMovieDivs(displayMovies) {
    return displayMovies.map(movie =>
        `<div>
      <img class="moviePoster" src=${movie.image} />
      <p class="movieName">${movie.title}</p>
      <p class="movieScore">评分：${movie.rating}</p>
      </div>`);
}

function getMovieId(event) {
    if (event.target.tagName.toLowerCase() === 'img') {
        const movies = getMoviesFromStorage();
        const movie = movies.find(movie => movie.image === event.target.src);
        return movie.id;
    }
}

function isToMovieDetailsPage(movieId) {
    if (movieId) {
        window.location = `movie-details.html?id=${movieId}`;
    }
}

function getSearchContent() {
    return document.getElementById('searchBox').value;
}

function isToMovieSearchPage(searchContent) {
    if (!searchContent) {
        return
    }
    let searchUrl = 'search-page.html?search=' + encodeURI(searchContent);
    window.location.href = searchUrl;
}

function getSearchContentFromUrl() {
    const url = window.location.href;
    let searchContent = url.split('search=')[1];
    return decodeURI(searchContent);
}

function getAndShowSearchResult() {
    let searchResult = getSearchResult();
    showSearchResult(searchResult);
}

function getSearchResult() {
    const searchContent = getSearchContentFromUrl();

    if (Number(searchContent)) {
        return getIdSearchResult(searchContent);
    } else {
        return getNameSearchResult(searchContent);
    }

}


function showSearchResult(movies) {
    const showResult = getMovieDivs(movies);
    document.getElementById('recommend').innerHTML = `
    <p>搜索结果：</P>
    ${showResult.join('\n')}`;
}

function getIdSearchResult(movieId) {
    const movies = getMoviesFromStorage();
    return movies.filter(movie => movie.id.includes(movieId));
}

function getNameSearchResult(movieName) {
    const movies = getMoviesFromStorage();
    return movies.filter(movie => movie.title.includes(movieName));
}



function showHighScoreMovies() {
    const highScoreMovies = getMoviesScoreAbove(8.8)
    const randoms = generateRandoms(highScoreMovies.length, 10);
    const randomMovies = randoms.map(random => highScoreMovies[random]);
    const movieDivs = getMovieDivs(randomMovies);
    document.getElementById('recommend').innerHTML = `
    <p>高分电影推荐</p>
    ${movieDivs.join('\n')}`;
}

function getMoviesScoreAbove(number) {
    const movies = getMoviesFromStorage();
    return movies.filter(movie => Number(movie.rating) >= number);
}

function generateRandoms(count, randomsLength) {
    const randoms = [];
    while (randoms.length < randomsLength) {
        const random = parseInt(Math.random() * count);
        if (!randoms.includes(random)) {
            randoms.push(random);
        }
    }
    return randoms;
}

function getIdFromUrl() {
    const url = document.location.toString();
    return url.split('id=')[1];
}

function showMovieDetails() {
    const id = getIdFromUrl();
    const movie = getSelectedMovie(id);
    generateDetails(movie);
    generateComments(movie);
    generateSameMovies(movie);
}
function getSelectedMovie(id) {
    const movies = getMoviesFromStorage();
    return movies.find(movie => movie.id === id);
}

function generateDetails(movie) {
    generateName(movie);
    generateBasic(movie);
}
function generateName(movie) {
    let nameString;
    if (movie.title != movie.original_title) {
        nameString = `${movie.title} — ${movie.original_title}`;
    } else {
        nameString = movie.title;
    }
    document.getElementById('name').innerHTML = nameString;
}
function generateBasic(movie) {
    document.getElementById('poster').src = movie.image;
    document.getElementById('directors').innerHTML = `导演：${movie.directors}`;
    document.getElementById('casts').innerHTML = `主演：${movie.casts}`;
    document.getElementById('genres').innerHTML = `类别：${movie.genres.join(',')}`;
    document.getElementById('year').innerHTML = `上映时间：${movie.year}`;
    document.getElementById('more').href = movie.alt;
}

function generateComments(movie) {
    const url = `https://api.douban.com/v2/movie/subject/${movie.id}/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&count=5&client=&udid=`;
    request('get', url, (data) => {
        showComments(data);
        showOther(data);
        showRatingDetails(data);
    })
}

function showOther(data) {
    document.getElementById('durations').innerHTML = `片长：${data.subject.durations[0]}`;
}

function showRatingDetails(data) {
    document.getElementById('aboutRating').innerHTML =
        `<p id='rating'>${data.subject.rating.average}</p>
    <p>${generateStar(1).join('')} <span>${data.subject.rating.details[1]}</span></p>
    <p>${generateStar(2).join('')} <span>${data.subject.rating.details[2]}</span></p>
    <p>${generateStar(3).join('')} <span>${data.subject.rating.details[3]}</span></p>
    <p>${generateStar(4).join('')} <span>${data.subject.rating.details[4]}</span></p>
    <p>${generateStar(5).join('')} <span>${data.subject.rating.details[5]}</span></p>`
}

function showComments(data) {
    const commentsList = displayComments(data.comments);
    document.getElementById('comments').innerHTML =
        `<p>${data.subject.title}的短评</p>
     ${commentsList.join('<hr>')}`;
}

function displayComments(comments) {
    return comments.map(comment =>
        `<div>   
            <p class='aboutAuthor'>
                <span class='author'>${comment.author.name}</span>  
                <span class='star'>${generateStar(comment.rating.value).join('')}</span>
                ${comment.created_at} 
            </p>
            <p class='comment'>${comment.content}</p>
        </div>`)
}
function generateStar(value) {
    let stars = ['☆', '☆', '☆', '☆', '☆'];
    return stars.map((star, index, arr) => {
        if (index < value) {
            return '★';
        }
        return star;
    })
}
function generateSameMovies(movie) {
    const sameMovies = getSameMovies(movie);
    showSameMovies(sameMovies);
}

function getSameMovies(selectedMovie) {
    const movies = getMoviesFromStorage();
    const sameMovies = movies.filter(movie => movie.genres.some(genre => selectedMovie.genres.includes(genre)
        && movie.id != selectedMovie.id));
    return sameMovies;
}

function showSameMovies(movies) {
    let movieDivs = [];
    if (movies.length <= 10) {
        movieDivs = getMovieDivs(movies);
    } else {
        const randoms = generateRandoms(movies.length, 10);
        const randomMovies = randoms.map(random => movies[random]);
        movieDivs = getMovieDivs(randomMovies);
    }
    document.getElementById('recommend').innerHTML = `
    <p>同类电影推荐</p>
    ${movieDivs.join('\n')}`;
}