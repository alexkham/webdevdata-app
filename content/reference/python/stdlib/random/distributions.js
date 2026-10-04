// content/reference/python/stdlib/random/distributions.js
// expovariate, triangular, lognormvariate, paretovariate, weibullvariate,
// vonmisesvariate

export const meta = {
  slug:        'distributions',
  name:        'random distributions: expovariate, triangular, …',
  signature:   'random.expovariate(lambd=1.0) / triangular(low=0.0, high=1.0, mode=None) / lognormvariate(mu, sigma) / paretovariate(alpha) / weibullvariate(alpha, beta) / vonmisesvariate(mu, kappa)',
  blurb:       'Six continuous distributions: exponential waiting times, triangular estimates, log-normal sizes, Pareto tails, Weibull lifetimes and von Mises angles.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python 3 versions (expovariate default lambd=1.0 since 3.12)',
  searchTerms: 'random.expovariate random.triangular random.lognormvariate random.paretovariate random.weibullvariate random.vonmisesvariate expovariate triangular lognormvariate paretovariate weibullvariate vonmisesvariate exponential distribution poisson process lognormal pareto weibull von mises circular python random distribution Random.expovariate Random.triangular Random.lognormvariate Random.paretovariate Random.weibullvariate Random.vonmisesvariate',
};

export const method = {
  slug:      'distributions',
  name:      'random distributions: expovariate, triangular, …',
  signature: 'random.expovariate(lambd=1.0) / triangular(low=0.0, high=1.0, mode=None) / lognormvariate(mu, sigma) / paretovariate(alpha) / weibullvariate(alpha, beta) / vonmisesvariate(mu, kappa)',
  returns:   { type: 'float', desc: 'One draw from the distribution.' },

  category:    'random functions',
  version:     'All Python 3 versions (expovariate default lambd=1.0 since 3.12)',
  hasLiveDemo: true,

  subtitle: 'Each is a few lines of Python on top of random(): an inverse transform (expovariate, paretovariate, weibullvariate, triangular) or a rejection loop (vonmisesvariate). Watch the parameter conventions: expovariate takes a RATE, triangular takes (low, high, mode).',

  covers: [
    'expovariate', 'triangular', 'lognormvariate', 'paretovariate', 'weibullvariate', 'vonmisesvariate',
    'Random.expovariate', 'Random.triangular', 'Random.lognormvariate', 'Random.paretovariate', 'Random.weibullvariate', 'Random.vonmisesvariate',
  ],

  cheat: {
    commonCall: 'random.expovariate(1 / 5)',
    returns:    'float',
    replaces:   'Hand-written inverse-CDF formulas',
    watchOut:   'expovariate(5) has mean 0.2, not 5',
  },

  parameters: [
    { name: 'lambd',  type: 'float', required: false, default: '1.0', desc: 'expovariate: the rate, 1 / desired mean; nonzero (a negative rate gives values <= 0). Default since 3.12.' },
    { name: 'low, high, mode', type: 'float', required: false, default: '0.0, 1.0, None', desc: 'triangular: the bounds and the peak; mode=None means the midpoint.' },
    { name: 'mu, sigma', type: 'float', required: true, default: null, desc: 'lognormvariate: mean and standard deviation of the underlying normal (of log(X)); sigma > 0.' },
    { name: 'alpha',  type: 'float', required: true, default: null, desc: 'paretovariate: shape. weibullvariate: scale.' },
    { name: 'beta',   type: 'float', required: true, default: null, desc: 'weibullvariate: shape.' },
    { name: 'mu, kappa', type: 'float', required: true, default: null, desc: 'vonmisesvariate: mean angle in radians and concentration >= 0; kappa <= 1e-6 gives a uniform angle in [0, 2*pi).' },
  ],

  modes: [
    {
      id: 'expo',
      label: 'expovariate',
      blurb: 'Waiting times with rate lambd: the mean is 1 / lambd.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'lambd', type: 'float',     hint: 'rate = 1 / mean',    input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.expovariate({$lambd}), 4) for _ in range(5)]',
      cases: [
        { id: 'one',  label: 'rate 1',    values: { seed: '42', lambd: '1' } },
        { id: 'slow', label: 'rate 0.2',  values: { seed: '42', lambd: '0.2' } },
        { id: 'neg',  label: 'rate -1',   values: { seed: '42', lambd: '-1' } },
        { id: 'zero', label: 'rate 0',    values: { seed: '42', lambd: '0' } },
      ],
    },
    {
      id: 'triangular',
      label: 'triangular',
      blurb: 'Between low and high, most likely near mode: a quick estimate of min / max / most likely.',
      params: [
        { name: 'seed', type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'low',  type: 'float',     hint: 'low',                input: 'float' },
        { name: 'high', type: 'float',     hint: 'high',               input: 'float' },
        { name: 'mode', type: 'float',     hint: 'most likely',        input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.triangular({$low}, {$high}, {$mode}), 4) for _ in range(5)]',
      cases: [
        { id: 'skew', label: '0, 10, peak 2', values: { seed: '42', low: '0', high: '10', mode: '2' } },
        { id: 'same', label: 'low == high',   values: { seed: '42', low: '1', high: '1', mode: '1' } },
      ],
    },
    {
      id: 'lognorm',
      label: 'lognormvariate',
      blurb: 'Always positive and right-skewed; log() of the result is normal(mu, sigma).',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'mu',    type: 'float',     hint: 'mu of log(X)',       input: 'float' },
        { name: 'sigma', type: 'float',     hint: 'sigma of log(X)',    input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.lognormvariate({$mu}, {$sigma}), 4) for _ in range(5)]',
      cases: [
        { id: 'half', label: 'mu 0, sigma 0.5',   values: { seed: '42', mu: '0', sigma: '0.5' } },
        { id: 'huge', label: 'mu 1000 overflows', values: { seed: '42', mu: '1000', sigma: '1' } },
      ],
    },
    {
      id: 'pareto',
      label: 'paretovariate',
      blurb: 'Heavy tail starting at 1.0: small alpha means more extreme values.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'alpha', type: 'float',     hint: 'shape',              input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.paretovariate({$alpha}), 4) for _ in range(5)]',
      cases: [
        { id: 'three', label: 'alpha 3', values: { seed: '42', alpha: '3' } },
        { id: 'one',   label: 'alpha 1', values: { seed: '42', alpha: '1' } },
        { id: 'zero',  label: 'alpha 0', values: { seed: '42', alpha: '0' } },
      ],
    },
    {
      id: 'weibull',
      label: 'weibullvariate',
      blurb: 'Lifetimes and failure times: alpha is the scale, beta the shape.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'alpha', type: 'float',     hint: 'scale',              input: 'float' },
        { name: 'beta',  type: 'float',     hint: 'shape',              input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.weibullvariate({$alpha}, {$beta}), 4) for _ in range(5)]',
      cases: [
        { id: 'wear', label: 'scale 1, shape 1.5', values: { seed: '42', alpha: '1', beta: '1.5' } },
        { id: 'expo', label: 'shape 1 = exponential', values: { seed: '42', alpha: '1', beta: '1' } },
      ],
    },
    {
      id: 'vonmises',
      label: 'vonmisesvariate',
      blurb: 'Angles in radians, 0 to 2*pi, clustered around mu; kappa is the concentration.',
      params: [
        { name: 'seed',  type: 'int | str', hint: 'an int or a string', input: 'auto' },
        { name: 'mu',    type: 'float',     hint: 'mean angle',         input: 'float' },
        { name: 'kappa', type: 'float',     hint: 'concentration',      input: 'float' },
      ],
      template: 'import random\nrandom.seed({$seed})\n[round(random.vonmisesvariate({$mu}, {$kappa}), 4) for _ in range(5)]',
      cases: [
        { id: 'tight',   label: 'mu 0, kappa 4',   values: { seed: '42', mu: '0', kappa: '4' } },
        { id: 'uniform', label: 'kappa 0',         values: { seed: '42', mu: '3.14', kappa: '0' } },
      ],
    },
  ],
  demoExplainer: 'expovariate(1.0) and expovariate(0.2) use the same random() values, so the second list is (up to rounding) the first times 5. A negative rate mirrors them below zero, and rate 0 divides by zero. Around mu = 0 the von Mises angles wrap: values near 2*pi (about 6.2832) are close to 0. weibullvariate with shape 1 is the exponential distribution. Results are rounded because log, exp, cos, acos and ** come from the platform C library and can differ in the last digit.',

  patterns: [
    {
      name: 'Arrival times of a Poisson process',
      desc: 'Exponential gaps with mean 5.6 (the queue simulation from the random docs).',
      code: 'import random\narrival = 0.0\nfor _ in range(1000):\n    arrival += random.expovariate(1.0 / 5.6)',
    },
    {
      name: 'Three-point estimate',
      desc: 'Optimistic, pessimistic and most likely duration of a task.',
      code: 'import random\ndays = random.triangular(3, 15, 5)  # low, high, mode',
    },
    {
      name: 'Positive, skewed sizes',
      desc: 'File sizes, incomes, response times: log-normal.',
      code: 'import random\nsize_kb = random.lognormvariate(4.0, 1.2)',
    },
    {
      name: 'Random wind direction',
      desc: 'Mostly from the west (pi radians), with spread controlled by kappa.',
      code: 'import math\nimport random\ndirection = random.vonmisesvariate(math.pi, 2.0)',
    },
  ],

  examples: [
    { title: 'expovariate: default rate 1.0 (3.12+)', code: 'import random\nrandom.seed(42)\nrandom.expovariate()',                    returns: '1.020060287274801' },
    { title: 'Rate, not mean: mean 1 / lambd',        code: 'import random\nrandom.seed(42)\nround(sum(random.expovariate(0.5) for _ in range(10000)) / 10000, 1)', returns: '2.0' },
    { title: 'triangular(low, high, mode)',           code: 'import random\nrandom.seed(42)\nrandom.triangular(0, 10, 2)',            returns: '4.6291661612586354' },
    { title: 'triangular defaults: 0, 1, midpoint',   code: 'import random\nrandom.seed(42)\nrandom.triangular()',                    returns: '0.5753983033817951' },
    { title: 'lognormvariate',                        code: 'import random\nrandom.seed(42)\nrandom.lognormvariate(0, 0.5)',          returns: '1.1305035702580866' },
    { title: 'paretovariate: never below 1.0',        code: 'import random\nrandom.seed(42)\nrandom.paretovariate(3)',                returns: '1.4049758243344401' },
    { title: 'weibullvariate',                        code: 'import random\nrandom.seed(42)\nrandom.weibullvariate(1, 1.5)',          returns: '1.0133292060998442' },
    { title: 'vonmisesvariate: an angle in radians',  code: 'import random\nrandom.seed(42)\nrandom.vonmisesvariate(0, 4)',           returns: '5.535325158587151' },
  ],

  pitfalls: [
    {
      name: 'Passing the mean to expovariate',
      desc: 'The parameter is the rate lambda = 1 / mean. For waits that average 5 seconds pass 1 / 5, not 5.',
      wrong: { label: 'expovariate(5)',     code: 'import random\nrandom.seed(42)\nround(sum(random.expovariate(5) for _ in range(10000)) / 10000, 1)',     output: '0.2' },
      fix:   { label: 'expovariate(1 / 5)', code: 'import random\nrandom.seed(42)\nround(sum(random.expovariate(1 / 5) for _ in range(10000)) / 10000, 1)', output: '5.0' },
    },
    {
      name: 'triangular(low, mode, high)',
      desc: 'The order is (low, high, mode). With the peak passed second, mode lies outside the bounds and the results leave the range.',
      wrong: { label: 'triangular(0, 2, 10)', code: 'import random\nrandom.seed(42)\nmax(random.triangular(0, 2, 10) for _ in range(1000)) > 2',   output: 'True' },
      fix:   { label: 'triangular(0, 10, 2)', code: 'import random\nrandom.seed(42)\nmax(random.triangular(0, 10, 2) for _ in range(1000)) <= 10', output: 'True' },
    },
    {
      name: 'lognormvariate mu is not the mean of the result',
      desc: 'mu and sigma describe log(X). Large mu overflows math.exp.',
      wrong: { label: 'mu=1000', code: 'import random\nrandom.seed(42)\nrandom.lognormvariate(1000, 1)', output: 'OverflowError: math range error' },
      fix:   { label: 'mu=log(1000)', code: 'import math\nimport random\nrandom.seed(42)\nround(random.lognormvariate(math.log(1000), 0.5))', output: '1131' },
    },
  ],

  when: {
    use: [
      'Simulation inputs: arrivals (expovariate), task durations (triangular), sizes (lognormvariate)',
      'Reliability and lifetimes: weibullvariate; wealth and popularity tails: paretovariate',
      'Directions and times of day on a circle: vonmisesvariate',
    ],
    avoid: [
      'Normal noise → gauss / normalvariate',
      'Proportions between 0 and 1 → betavariate; positive skewed with a shape → gammavariate',
      'Counts of successes → binomialvariate',
    ],
  },

  notes: {
    cpython: 'Lib/random.py: expovariate = -log(1.0 - random()) / lambd; triangular inverts the CDF with one sqrt; lognormvariate = exp(normalvariate(mu, sigma)); paretovariate = (1.0 - random()) ** (-1.0 / alpha); weibullvariate = alpha * (-log(1.0 - random())) ** (1.0 / beta); vonmisesvariate is a rejection loop after N. I. Fisher (Statistical Analysis of Circular Data) using cos, exp and acos',
    'Platforms': 'triangular uses only + - * / and sqrt, so it is exact everywhere. The others call log, exp, cos, acos or pow from the C library, whose last digit can differ between Windows, Linux and macOS for a small fraction of inputs; the full-precision examples on this page were verified on Windows and Linux CPython',
    'Errors': "ZeroDivisionError: float division by zero for expovariate(0), paretovariate(0) and weibullvariate(alpha, 0). OverflowError when a result exceeds the float range: math range error from exp (lognormvariate); from ** (paretovariate or weibullvariate with tiny parameters) the text is platform-dependent, (34, 'Result too large') on Windows and (34, 'Numerical result out of range') on Linux",
  },

  related: [
    { name: 'gauss / normalvariate',      slug: 'gauss-normalvariate',      when: 'The normal distribution' },
    { name: 'gammavariate / betavariate', slug: 'gammavariate-betavariate', when: 'Gamma and beta shapes' },
    { name: 'binomialvariate',            slug: 'binomialvariate',          when: 'A discrete count' },
    { name: 'random.uniform',             slug: 'uniform',                  when: 'Flat between two bounds' },
    { name: 'ZeroDivisionError',          slug: 'zerodivisionerror',        when: 'expovariate(0) and friends', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What is lambd in random.expovariate?',
      a: 'The rate of the exponential distribution, 1 divided by the desired mean (the name avoids the keyword lambda). expovariate(0.5) has mean 2; since Python 3.12 the default is 1.0.',
    },
    {
      q: 'What is the order of arguments in random.triangular?',
      a: 'triangular(low, high, mode): the bounds first, then the peak. All three are optional: the defaults are 0.0, 1.0 and the midpoint.',
    },
    {
      q: 'How do I simulate Poisson arrivals in Python?',
      a: 'Add exponential gaps: t += random.expovariate(rate). The number of arrivals per unit of time is then Poisson distributed with mean rate.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/random.html#real-valued-distributions',
    meta:  'random — real-valued distributions',
  },
};
