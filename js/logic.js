function formatGenresToArray(data) {
    return data.map(ele => {
        ele.genres = ele.genres.split(',');
        return ele;
    })
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

function getSortName(event) {
    if (event.target.tagName.toLowerCase() === 'li') {
        changeClickedSortColor(event);
        return event.target.innerHTML;
    }
}

function changeClickedSortColor(event) {
    const liTags = document.getElementsByTagName('li');
    for (i = 0; i < liTags.length; i++) {
        liTags[i].style.color = 'black';
    }
    event.target.style.color = 'red';
}

function showMoviesBySort(sortName) {
    const diaplayMovies = getDisplayMovies(sortName);
    const movieDivs = getDisplay(diaplayMovies);
    document.getElementById('recommend').innerHTML = movieDivs.join('\n');
}

function getDisplayMovies(sortName) {
    let movies = getMoviesFromStorage();
    if (sortName !== '全部') {
        movies = movies.filter(movie => movie.genres.includes(sortName));
    }
    return movies;
}

function getDisplay(diaplayMovies) {
    return diaplayMovies.map(movie =>
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

function showHighScoreMovies() {
    const highScoreMovies = getMoviesScoreAbove(8.8)
    const randoms = generateRandoms(highScoreMovies.length, 12);
    const randomMovies = randoms.map(random => highScoreMovies[random]);
    const movieDivs = getDisplay(randomMovies);
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
    generateOther(movie);
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
function generateOther(movie) {
    document.getElementById('poster').src = movie.image;
    document.getElementById('directors').innerHTML = `导演：${movie.directors}`;
    document.getElementById('casts').innerHTML = `主演：${movie.casts}`;
    document.getElementById('genres').innerHTML = `类别：${movie.genres.join(',')}`;
    document.getElementById('year').innerHTML = `上映时间：${movie.year}`;
    document.getElementById('rating').innerHTML = `豆瓣评分：${movie.rating}`;
}

function generateComments(movie) {
    const url = `https://api.douban.com/v2/movie/subject/${movie.id}/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&count=5&client=&udid=`;
    request('get', url, (data) => {
        showComments(data);
        console.log(data);
    })
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
    let stars = ['☆','☆','☆','☆','☆'];
    return stars.map((star,index,arr) => {
        if(index <= value-1) {
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
    const movieDivs = getDisplay(movies);
    document.getElementById('recommend').innerHTML = `
    <p>同类电影推荐</p>
    ${movieDivs.join('\n')}`;
}