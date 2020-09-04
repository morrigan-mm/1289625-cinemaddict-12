import {EMOJIS} from "../constants.js";
import {getRandomInteger, getRandomBoolean} from "../utils/common.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateFilmTitle = () => {
  const filmTitles = [
    `Made for each other`,
    `Popeye meets Sindbad`,
    `Saberbush trail`,
    `Santa Claus conquers the Martians`,
    `The dance of life`,
    `The great flamarion`,
    `The man with the golden arm`
  ];

  const randomIndex = getRandomInteger(0, filmTitles.length - 1);

  return filmTitles[randomIndex];
};

const generateFilmPoster = () => {
  const filmPosters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`
  ];

  const randomIndex = getRandomInteger(0, filmPosters.length - 1);

  return filmPosters[randomIndex];
};

const generateFilmDescription = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const sentenceList = text.split(`. `).map((item) => `${item}.`);

  const amount = getRandomInteger(1, 5);
  const chapter = [];
  for (let i = 0; i < amount; i++) {
    const index = getRandomInteger(0, sentenceList.length - 1);
    const sentence = sentenceList[index];
    chapter.push(sentence);
  }

  return chapter.join(` `);
};

const generateFilmRating = () => {
  const a = getRandomInteger(0, 10);
  const b = getRandomInteger(0, 9);

  return `${a}.${b}`;
};

const generateFilmGenre = () => {
  const genres = [`comedy`, `cartoon`, `drama`, `horror`, `musical`];
  const maxInteger = getRandomInteger(1, genres.length);

  return genres.slice(0, maxInteger);
};

const generateEmoji = () => {
  const randomIndex = getRandomInteger(0, EMOJIS.length - 1);

  return EMOJIS[randomIndex];
};

const generateEmojiText = () => {
  const text = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];
  const randomIndex = getRandomInteger(0, text.length - 1);

  return text[randomIndex];
};

const generateCommentDate = () => {
  const DAY = 1000 * 60 * 60 * 24;
  return new Date(Date.now() - getRandomInteger(0, 12 * DAY));
};

const generateDate = () => {
  const currentDate = new Date();
  currentDate.setFullYear(getRandomInteger(1915, 2020));
  currentDate.setMonth(getRandomInteger(1, 12));
  currentDate.setDate(getRandomInteger(1, 30));

  return currentDate;
};

const generateComment = () => {
  return {
    emoji: generateEmoji(),
    text: generateEmojiText(),
    author: `John Doe`,
    date: generateCommentDate()
  };
};

const generateCommentList = () => {
  const amount = getRandomInteger(0, 5);

  return Array.from({length: amount}).map(generateComment);
};

export const generateFilmCard = () => {
  return {
    id: generateId(),
    title: generateFilmTitle(),
    originalTitle: generateFilmTitle(),
    poster: generateFilmPoster(),
    director: `Anthony Mann`,
    writers: `Anne Wigton, Heinz Herald, Richard Weil`,
    actors: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`,
    releaseDate: generateDate(),
    country: `USA`,
    duration: `1h 32m`,
    genres: generateFilmGenre(),
    description: generateFilmDescription(),
    rating: generateFilmRating(),
    age: `18+`,
    comments: generateCommentList(),
    isAddedToWatchList: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };
};
