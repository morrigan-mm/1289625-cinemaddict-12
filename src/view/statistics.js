import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import {StatisticsPeriod} from "../constants.js";
import Abstract from "./abstract.js";

const BAR_HEIGHT = 50;
const FORM_CLASSNAME = `statistic__filters`;
const TEXT_LIST_CLASSNAME = `statistic__text-list`;
const CANVAS_CLASSNAME = `statistic__chart`;

const createStatisticsRankTemplate = (rank) => {
  if (!rank) {
    return ``;
  }

  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>`
  );
};

const createYouWatchedTemplate = (watchedCount) => {
  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedCount} <span class="statistic__item-description">movies</span></p>
    </li>`
  );
};

const createTotalDurationTemplate = (watchedDuration) => {
  const watchedHours = Math.floor(watchedDuration / 60);
  const watchedMinutes = watchedDuration - watchedHours * 60;
  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${watchedHours} <span class="statistic__item-description">h</span> ${watchedMinutes} <span class="statistic__item-description">m</span></p>
    </li>`
  );
};

const createTopGenreTemplate = (topGenre) => {
  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre || ``}</p>
    </li>`
  );
};

const createStatisticsControlTemplate = (period, text, checked) => {
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${period}" value="${period}"${checked ? ` checked` : ``}>
    <label for="statistic-${period}" class="statistic__filters-label">${text}</label>`
  );
};

const createStatisticsTemplate = (period, stats, rank) => {
  const {watchedCount, watchedDuration, topGenre} = stats;
  return (
    `<section class="statistic">
      ${createStatisticsRankTemplate(rank)}

      <form action="https://echo.htmlacademy.ru/" method="get" class="${FORM_CLASSNAME}">
        <p class="statistic__filters-description">Show stats:</p>

        ${createStatisticsControlTemplate(StatisticsPeriod.ALL_TIME, `All time`, StatisticsPeriod.ALL_TIME === period)}
        ${createStatisticsControlTemplate(StatisticsPeriod.TODAY, `Today`, StatisticsPeriod.TODAY === period)}
        ${createStatisticsControlTemplate(StatisticsPeriod.WEEK, `Week`, StatisticsPeriod.WEEK === period)}
        ${createStatisticsControlTemplate(StatisticsPeriod.MONTH, `Month`, StatisticsPeriod.MONTH === period)}
        ${createStatisticsControlTemplate(StatisticsPeriod.YEAR, `Year`, StatisticsPeriod.YEAR === period)}
      </form>

      <ul class="${TEXT_LIST_CLASSNAME}">
        ${createYouWatchedTemplate(watchedCount)}
        ${createTotalDurationTemplate(watchedDuration)}
        ${createTopGenreTemplate(topGenre)}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="${CANVAS_CLASSNAME}" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends Abstract {
  constructor(films, rank) {
    super();

    this._films = films;
    this._rank = rank;
    this._period = StatisticsPeriod.ALL_TIME;
    this._stats = this._collectStats(this._films, this._period);

    this._handlePeriodChange = this._handlePeriodChange.bind(this);
  }

  getTemplate() {
    return createStatisticsTemplate(this._period, this._stats, this._rank);
  }

  afterElementCreate() {
    this._form = this.getElement().querySelector(`.${FORM_CLASSNAME}`);
    this._canvas = this.getElement().querySelector(`.${CANVAS_CLASSNAME}`);
    this._chart = this._initChart();

    this._form.addEventListener(`change`, this._handlePeriodChange);
  }

  _handlePeriodChange(evt) {
    this._period = evt.target.value;
    this._stats = this._collectStats(this._films, this._period);
    this._updateTextList();
    this._updateChart();
  }

  _collectStats(films, period) {
    const watched = this._getFilmsByPeriod(films, period);
    const watchedDuration = watched.map(({duration}) => duration).reduce((a, b) => a + b, 0);
    const genreRates = this._collectGenreRates(watched).sort((a, b) => b[1] - a[1]);
    const topGenre = genreRates.length > 0 ? genreRates[0][0] : null;
    return {
      watchedCount: watched.length,
      watchedDuration,
      genreRates,
      topGenre
    };
  }

  _getFilmsByPeriod(films, period) {
    return films.filter(({watchingDate}) => {
      if (watchingDate) {
        switch (period) {
          case StatisticsPeriod.ALL_TIME:
            return true;
          case StatisticsPeriod.TODAY:
            return moment(watchingDate).isSame(moment(), `day`);
          case StatisticsPeriod.WEEK:
            return moment(watchingDate).isSame(moment(), `week`);
          case StatisticsPeriod.MONTH:
            return moment(watchingDate).isSame(moment(), `month`);
          case StatisticsPeriod.YEAR:
            return moment(watchingDate).isSame(moment(), `year`);
        }
      }
      return false;
    });
  }

  _collectGenreRates(films) {
    const genreCountMap = new Map();

    for (const {genres} of films) {
      for (const genre of genres) {
        if (genreCountMap.has(genre)) {
          const count = genreCountMap.get(genre);
          genreCountMap.set(genre, count + 1);
        } else {
          genreCountMap.set(genre, 1);
        }
      }
    }

    return Array.from(genreCountMap.entries());
  }

  _getChartData() {
    const {genreRates} = this._stats;
    return {
      labels: genreRates.map((item) => item[0]),
      datasets: [{
        data: genreRates.map((item) => item[1]),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24
      }]
    };
  }

  _getCanvasHeight() {
    return BAR_HEIGHT * this._stats.genreRates.length;
  }

  _initChart() {
    this._canvas.height = this._getCanvasHeight();

    return new Chart(this._canvas, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: this._getChartData(),
      options: {
        animation: {
          duration: 0
        },
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    }, {
      maintainAspectRatio: false
    });
  }

  _updateTextList() {
    const {watchedCount, watchedDuration, topGenre} = this._stats;

    const container = this.getElement().querySelector(`.${TEXT_LIST_CLASSNAME}`);

    if (container) {
      container.innerHTML = (
        `${createYouWatchedTemplate(watchedCount)}
        ${createTotalDurationTemplate(watchedDuration)}
        ${createTopGenreTemplate(topGenre)}`
      );
    }
  }

  _updateChart() {
    this._canvas.parentElement.style.height = `${this._getCanvasHeight()}px`;
    this._chart.data = this._getChartData();
    this._chart.update();
  }
}
