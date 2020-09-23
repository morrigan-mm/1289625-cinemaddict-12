import HeaderProfileView from "./view/header-profile.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import StatisticsView from "./view/statistics.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import PageModel from "./model/page.js";
import MainNavigationPresenter from "./presenter/main-navigation.js";
import FilmListPresenter from "./presenter/film-list.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {PageType} from "./constants.js";

const AUTHORIZATION = `Basic er83jd1zb1dw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v01`;
const FILMS_STORE_NAME = `${STORE_PREFIX}-${STORE_VER}-films`;
const COMMENTS_STORE_NAME = `${STORE_PREFIX}-${STORE_VER}-comments`;

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
const main = body.querySelector(`.main`);
const footerStatistics = body.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const filmsStore = new Store(FILMS_STORE_NAME, window.localStorage);
const commentsStore = new Store(COMMENTS_STORE_NAME, window.localStorage);

const apiWithProvider = new Provider(api, filmsStore, commentsStore);

const pageModel = new PageModel();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel({loading: true});

let clearPreviousPage = null;

const renderPage = () => {
  const pageType = pageModel.getPage();

  if (clearPreviousPage) {
    clearPreviousPage();
  }

  switch (pageType) {
    case PageType.FILM_LIST: {
      const page = new FilmListPresenter(apiWithProvider, main, filterModel, filmsModel);

      page.render();
      clearPreviousPage = () => page.destroy();

      break;
    }
    case PageType.STATISTICS: {
      const page = new StatisticsView(filmsModel.getFilms(), filmsModel.getRank());

      render(main, page, RenderPosition.BEFOREEND);
      clearPreviousPage = () => remove(page);

      break;
    }
    default: {
      clearPreviousPage = null;
    }
  }
};

apiWithProvider.getFilms()
  .then((films) => filmsModel.setFilms(films))
  .catch(() => filmsModel.setFilms([]));

const headerView = new HeaderProfileView({rank: filmsModel.getRank()});
render(header, headerView, RenderPosition.BEFOREEND);

const mainNavigationPresenter = new MainNavigationPresenter(main, pageModel, filterModel, filmsModel);
mainNavigationPresenter.render();

renderPage();
pageModel.addObserver(renderPage);

const footerStatisticsView = new FooterStatisticsView({count: filmsModel.getFilms().length});
render(footerStatistics, footerStatisticsView, RenderPosition.BEFOREEND);

filmsModel.addObserver(() => {
  headerView.updateData({rank: filmsModel.getRank()});
  footerStatisticsView.updateData({count: filmsModel.getFilms().length});
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
