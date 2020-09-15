import HeaderProfileView from "./view/header-profile.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import MainNavigationPresenter from "./presenter/main-navigation.js";
import FilmListPresenter from "./presenter/film-list.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic er883jdzb1dw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();

api.getFilms()
  .then((films) => filmsModel.setFilms(films))
  .catch(() => filmsModel.setFilms([]));

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
render(header, new HeaderProfileView(), RenderPosition.BEFOREEND);

const main = body.querySelector(`.main`);

const mainNavigationPresenter = new MainNavigationPresenter(main, filterModel, filmsModel);
mainNavigationPresenter.render();

const filmListPresenter = new FilmListPresenter(api, main, filterModel, filmsModel);
filmListPresenter.render();

const footerStatistics = body.querySelector(`.footer__statistics`);
const footerStatisticsView = new FooterStatisticsView({count: filmsModel.getFilms().length});
render(footerStatistics, footerStatisticsView, RenderPosition.BEFOREEND);

filmsModel.addObserver(() => {
  footerStatisticsView.updateData({count: filmsModel.getFilms().length});
});
