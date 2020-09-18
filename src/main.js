import HeaderProfileView from "./view/header-profile.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import MainNavigationPresenter from "./presenter/main-navigation.js";
import FilmListPresenter from "./presenter/film-list.js";
import StatisticsView from "./view/statistics.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";
import PageModel from "./model/page.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import Api from "./api.js";
import {PageType} from "./constants.js";

const AUTHORIZATION = `Basic er883jd1zb1dw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const body = document.querySelector(`body`);
const header = body.querySelector(`.header`);
const main = body.querySelector(`.main`);
const footerStatistics = body.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);

const pageModel = new PageModel();
const filterModel = new FilterModel();
const filmsModel = new FilmsModel({loading: true});

let page;

const renderPage = () => {
  const pageType = pageModel.getPage();

  if (page) {
    if (page.destroy) {
      page.destroy();
    } else {
      remove(page);
    }
  }

  switch (pageType) {
    case PageType.FILM_LIST: {
      page = new FilmListPresenter(api, main, filterModel, filmsModel);
      page.render();
      break;
    }
    case PageType.STATISTICS: {
      page = new StatisticsView(filmsModel.getFilms());
      render(main, page, RenderPosition.BEFOREEND);
      break;
    }
  }
};

api.getFilms()
  .then((films) => filmsModel.setFilms(films))
  .catch(() => filmsModel.setFilms([]));

const headerView = new HeaderProfileView();
render(header, headerView, RenderPosition.BEFOREEND);

const mainNavigationPresenter = new MainNavigationPresenter(main, pageModel, filterModel, filmsModel);
mainNavigationPresenter.render();

renderPage();
pageModel.addObserver(renderPage);

const footerStatisticsView = new FooterStatisticsView({count: filmsModel.getFilms().length});
render(footerStatistics, footerStatisticsView, RenderPosition.BEFOREEND);

filmsModel.addObserver(() => {
  footerStatisticsView.updateData({count: filmsModel.getFilms().length});
});
