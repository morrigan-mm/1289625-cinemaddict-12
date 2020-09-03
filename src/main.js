import HeaderProfileView from "./view/header-profile.js";
import MainNavigationView from "./view/main-navigation.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import FilmListPresenter from "./presenter/film-list.js";
import FilmsModel from "./model/films.js";

import {FilmCardCount} from "./constants.js";
import {render, RenderPosition} from "./utils/render.js";

import {generateFilmCard} from "./mock/film-card.js";
import {generateFilter} from "./mock/filter.js";

const films = new Array(FilmCardCount.MOCK_COUNT).fill().map(generateFilmCard);
const filters = generateFilter(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, new HeaderProfileView(), RenderPosition.BEFOREEND);

const main = body.querySelector(`.main`);
render(main, new MainNavigationView(filters), RenderPosition.AFTERBEGIN);

const filmList = new FilmListPresenter(main, filmsModel);
filmList.render();

const footerStatistics = body.querySelector(`.footer__statistics`);
render(footerStatistics, new FooterStatisticsView(filters[0].count), RenderPosition.BEFOREEND);

window.model = filmsModel;
