const MAX_DESC_LENGTH = 140;

export const createFilmCardTemplate = (film) => {
  const {title, rating, description, poster, releaseDate, duration, genres, comments, isAddedToWatchList, isWatched, isFavorite} = film;
  const [filmGenre] = genres;
  const commentsCount = comments.length;
  const activeClassName = `film-card__controls-item--active`;

  const addToWatchListClassNames = isAddedToWatchList
    ? `film-card__controls-item--add-to-watchlist ${activeClassName}`
    : `film-card__controls-item--add-to-watchlist`;

  const watchedClassNames = isWatched
    ? `film-card__controls-item--mark-as-watched ${activeClassName}`
    : `film-card__controls-item--mark-as-watched`;

  const favoriteClassNames = isFavorite
    ? `film-card__controls-item--favorite ${activeClassName}`
    : `film-card__controls-item--favorite`;

  const descriptionText = description.length >= MAX_DESC_LENGTH
    ? description.slice(0, MAX_DESC_LENGTH).concat(`…`)
    : description;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${filmGenre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionText}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button ${addToWatchListClassNames}">Add to watchlist</button>
        <button class="film-card__controls-item button ${watchedClassNames}">Mark as watched</button>
        <button class="film-card__controls-item button ${favoriteClassNames}">Mark as favorite</button>
      </form>
    </article>`
  );
};
