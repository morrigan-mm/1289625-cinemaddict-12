"use strict";

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_COUNT = 2;

const createHeaderProfileTemplate = () => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">Movie Buff</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

const createMainNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

const createFilmCardTemplate = () => {
  return (
    `<article class="film-card">
      <h3 class="film-card__title">Santa Claus Conquers the Martians</h3>
      <p class="film-card__rating">2.3</p>
      <p class="film-card__info">
        <span class="film-card__year">1964</span>
        <span class="film-card__duration">1h 21m</span>
        <span class="film-card__genre">Comedy</span>
      </p>
      <img src="./images/posters/santa-claus-conquers-the-martians.jpg" alt="" class="film-card__poster">
      <p class="film-card__description">The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Marti…</p>
      <a class="film-card__comments">465 comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite film-card__controls-item--active">Mark as favorite</button>
      </form>
    </article>`
  );
};

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

const createContainerTemplate = () => {
  return `<section class="films"></section>`;
};

const createContentLayoutTemplate = (title, options = {}) => {
  const {button, extra, hiddenTitle} = options;

  const className = extra ? `films-list--extra` : `films-list`;
  const titleClassNames = [`films-list__title`];
  if (hiddenTitle) {
    titleClassNames.push(`visually-hidden`);
  }

  return (
    `<section class="${className}">
      <h2 class="${titleClassNames.join(` `)}">${title}</h2>
      <div class="films-list__container">
        ${createFilmCardTemplate().repeat(extra ? FILM_EXTRA_COUNT : FILM_CARD_COUNT)}
      </div>
      ${button ? createShowMoreButtonTemplate() : ``}
    </section>`
  );
};

const createFilmDetaisTemplate = () => {
  return (
    `<div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/the-great-flamarion.jpg" alt="">

        <p class="film-details__age">18+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">The Great Flamarion</h3>
            <p class="film-details__title-original">Original: The Great Flamarion</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">8.9</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">Anthony Mann</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">30 March 1945</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">1h 18m</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">USA</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              <span class="film-details__genre">Drama</span>
              <span class="film-details__genre">Film-Noir</span>
              <span class="film-details__genre">Mystery</span></td>
          </tr>
        </table>

        <p class="film-details__film-description">
          The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion's other assistant. Flamarion falls in love with Connie, the movie's femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.
        </p>
      </div>
    </div>`
  );
};

const createEmojiTemplate = (emoji, size) => {
  return (
    `<img src="./images/emoji/${emoji}.png" width="${size}" height="${size}" alt="emoji-${emoji}">`
  );
};

const createSelectEmojiTemplate = (emoji, active) => {
  return (
    `<input class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${active ? `checked` : ``}
    >
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      ${createEmojiTemplate(emoji, 30)}
    </label>`
  );
};

const createCommentTemplate = (comment) => {
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${createEmojiTemplate(comment.emoji, 55)}
      </span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${comment.day}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createFormCommentsTemplate = () => {
  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

      <ul class="film-details__comments-list">
    ${createCommentTemplate({
      emoji: `smile`,
      text: `Interesting setting and a good cast`,
      author: `Tim Macoveev`,
      day: `2019/12/31 23:59`
    })}
    ${createCommentTemplate({
      emoji: `sleeping`,
      text: `Booooooooooring`,
      author: `John Doe`,
      day: `2 days ago`
    })}
    ${createCommentTemplate({
      emoji: `puke`,
      text: `Very very old. Meh`,
      author: `John Doe`,
      day: `2 days ago`
    })}
    ${createCommentTemplate({
      emoji: `angry`,
      text: `Almost two hours? Seriously?`,
      author: `John Doe`,
      day: `Today`
    })}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          ${createSelectEmojiTemplate(`smile`, false)}
          ${createSelectEmojiTemplate(`sleeping`, false)}
          ${createSelectEmojiTemplate(`puke`, false)}
          ${createSelectEmojiTemplate(`angry`, false)}
        </div>
      </div>
    </section>`
  );
};

const createFilmCardPopupTemplate = () => {
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          ${createFilmDetaisTemplate()}
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          ${createFormCommentsTemplate()}
        </div>
      </form>
    </section>`
  );
};

const createFooterStatisticsTemplate = () => {
  return `<p>130 291 movies inside</p>`;
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, createHeaderProfileTemplate(), `beforeend`);

const main = body.querySelector(`.main`);
render(main, createMainNavigationTemplate(), `beforeend`);
render(main, createSortingTemplate(), `beforeend`);
render(main, createContainerTemplate(), `beforeend`);

const content = main.querySelector(`.films`);

render(content, createContentLayoutTemplate(`All movies. Upcoming`, {button: true, hiddenTitle: true}), `beforeend`);
render(content, createContentLayoutTemplate(`Top rated`, {extra: true}), `beforeend`);
render(content, createContentLayoutTemplate(`Most commented`, {extra: true}), `beforeend`);

const footerStatistics = body.querySelector(`.footer__statistics`);
render(footerStatistics, createFooterStatisticsTemplate(), `beforeend`);

body.classList.add(`hide-overflow`);
render(body, createFilmCardPopupTemplate(), `beforeend`);

