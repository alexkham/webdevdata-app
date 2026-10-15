// utils/emulators/python/stdlib/statistics/statisticserror.js
//
// Emulator for the StatisticsError demo (_pystatistics.js). getattr() on
// the module: the one-argument functions are emulated, a missing name
// raises AttributeError with CPython's "Did you mean" suggestion (computed
// over dir(statistics) like Python/suggestions.c, via _pymath.suggest).

import * as M from '../math/_pymath.js';
import * as Q from '../fractions/_pyfraction.js';
import * as S from './_pystatistics.js';
import { raise } from '../../../../py-exceptions.js';

const list = (arr) => arr.map((x) => Q.lit(x));

// the public names of dir(statistics) in CPython 3.13
const DIR = ['Counter', 'Decimal', 'Fraction', 'LinearRegression', 'NormalDist', 'StatisticsError', 'acos', 'asin', 'atan',
  'bisect_left', 'bisect_right', 'correlation', 'cos', 'cosh', 'count', 'covariance', 'defaultdict', 'erf', 'exp', 'fabs',
  'fmean', 'fsum', 'geometric_mean', 'groupby', 'harmonic_mean', 'hypot', 'isfinite', 'isinf', 'itemgetter', 'kde',
  'kde_random', 'linear_regression', 'log', 'math', 'mean', 'median', 'median_grouped', 'median_high', 'median_low', 'mode',
  'multimode', 'namedtuple', 'numbers', 'pi', 'pstdev', 'pvariance', 'quantiles', 'random', 'reduce', 'repeat', 'sin',
  'sqrt', 'stdev', 'sumprod', 'sys', 'tan', 'tau', 'variance'];

// geometric_mean's value depends on the platform's log/exp (its own page
// rounds it); its errors do not, so only those are shown here
function geometricMeanErrorsOnly(d) {
  S.geometricMean(d);
  const e = new Error('not emulated: the exact last digit of geometric_mean depends on the C math library of your platform — its own page shows it rounded');
  e.name = 'DemoLimit';
  throw e;
}

const ONE_ARG = {
  mean: S.mean,
  fmean: (d) => S.fmean(d),
  geometric_mean: geometricMeanErrorsOnly,
  harmonic_mean: (d) => S.harmonicMean(d),
  median: S.median,
  median_low: S.medianLow,
  median_high: S.medianHigh,
  median_grouped: (d) => S.medianGrouped(d),
  mode: S.mode,
  multimode: S.multimode,
  pstdev: (d) => S.pstdev(d),
  pvariance: (d) => S.pvariance(d),
  stdev: (d) => S.stdev(d),
  variance: (d) => S.variance(d),
  quantiles: (d) => S.quantiles(d),
};

function getattr(name) {
  if (Object.prototype.hasOwnProperty.call(ONE_ARG, name)) return ONE_ARG[name];
  if (DIR.includes(name) || name.startsWith('_')) {
    const e = new Error(`not emulated: the demo calls the one-argument statistics functions only, not statistics.${name}`);
    e.name = 'DemoLimit';
    throw e;
  }
  const s = M.suggest(name, DIR);
  return raise('AttributeError', `module 'statistics' has no attribute '${name}'${s ? `. Did you mean: '${s}'?` : ''}`);
}

const isStatsError = (e) => e && e.name === 'statistics.StatisticsError';

export default {
  // f = getattr(statistics, fn); f(data)
  trigger: (fn, data) => {
    const f = getattr(fn);
    return Q.out(f(list(data)));
  },

  // try: result = statistics.stdev(data)
  // except statistics.StatisticsError as e: result = f'no stdev: {e}'
  handle: (data) => {
    try {
      return Q.out(S.stdev(list(data)));
    } catch (e) {
      if (!isStatsError(e)) throw e;
      return `no stdev: ${e.message}`;
    }
  },

  // except ValueError as e: caught = (type(e).__name__, isinstance(e, StatisticsError))
  valueerror: (data) => {
    try {
      S.variance(list(data));
    } catch (e) {
      if (isStatsError(e)) return Q.out(Q.T('StatisticsError', true));
      if (e && e.name === 'ValueError') return Q.out(Q.T('ValueError', false));
      throw e;
    }
    return 'no error';
  },
};
