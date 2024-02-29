import { type DateAdapter, type TimeUnit } from 'chart.js';

export interface AdapterOptions {
  locale?: string;
  timeZone?: string;
}

const FORMAT_OPTIONS: Record<
  string,
  Intl.DateTimeFormatOptions & { fractionalSecondDigits?: number }
> = {
  datetime: { dateStyle: 'medium', timeStyle: 'medium' },
  millisecond: {
    fractionalSecondDigits: 3,
    second: 'numeric',
    minute: 'numeric',
    hour: 'numeric',
  },
  second: {
    second: 'numeric',
    minute: 'numeric',
    hour: 'numeric',
  },
  minute: { hour: 'numeric', minute: 'numeric' },
  hour: { hour: 'numeric', minute: 'numeric' },
  day: { day: 'numeric', month: 'short' },
  week: { day: 'numeric', month: 'short' },
  month: { month: 'short', year: 'numeric' },
  year: { year: 'numeric' },
};

const FORMATS = {
  datetime: 'datetime',
  millisecond: 'millisecond',
  second: 'second',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

const units: Temporal.DateTimeUnit[] = [
  'millisecond',
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
];

const cache = new Map<string, Intl.DateTimeFormat>();

function getTimeZone(options: AdapterOptions) {
  return options.timeZone ?? Temporal.Now.timeZoneId();
}

const adapter: DateAdapter<AdapterOptions> = {
  options: {},

  init(chartOptions) {
    if (chartOptions.locale) {
      this.options.locale = chartOptions.locale;
    }
  },

  formats() {
    return FORMATS;
  },

  format(timestamp, format) {
    const timeZone = getTimeZone(this.options);

    if (format === FORMATS.quarter) {
      const q =
        Math.floor(
          Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(timeZone).month / 3,
        ) + 1;
      return `Q${q} - ${this.format(timestamp, FORMATS.year as any)}`;
    }

    const key = `${this.options.locale}:${timeZone}:${format}`;
    let formatter = cache.get(key);

    if (!formatter) {
      formatter = new Intl.DateTimeFormat(this.options.locale, {
        ...FORMAT_OPTIONS[format],
        timeZone,
      });
      cache.set(key, formatter);
    }

    return formatter.format(timestamp);
  },

  parse(value) {
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      try {
        return Temporal.Instant.from(value).epochMilliseconds;
      } catch {
        try {
          return Temporal.PlainDateTime.from(value).toZonedDateTime(getTimeZone(this.options))
            .epochMilliseconds;
        } catch {
          // ignore
        }
      }
    }

    throw new Error(`Not a date: ${JSON.stringify(value)}`);
  },

  add(timestamp, amount, unit) {
    if (unit === 'quarter') {
      amount *= 3;
      unit = 'month';
    }

    const temporalUnit: keyof Temporal.DurationLike = `${unit}s` as const;

    return Temporal.Instant.fromEpochMilliseconds(timestamp)
      .toZonedDateTimeISO(getTimeZone(this.options))
      .add({ [temporalUnit]: amount }).epochMilliseconds;
  },

  diff(a, b, unit) {
    if (unit === 'quarter') {
      return Math.floor(this.diff(a, b, 'month') / 3);
    }

    const temporalUnit = `${unit}s` as const;
    const _a = Temporal.Instant.fromEpochMilliseconds(a).toZonedDateTimeISO(
      getTimeZone(this.options),
    );
    const _b = Temporal.Instant.fromEpochMilliseconds(b).toZonedDateTimeISO(
      getTimeZone(this.options),
    );

    return _a.since(_b, { largestUnit: temporalUnit })[temporalUnit];
  },

  startOf(timestamp, unit) {
    return startOf(timestamp, unit, this.options).epochMilliseconds;
  },

  endOf(timestamp, unit) {
    const start = startOf(timestamp, unit, this.options);

    if (unit === 'isoWeek' || unit === 'week') {
      return start.add({ days: 7 }).epochMilliseconds;
    }

    if (unit === 'quarter') {
      return start.add({ months: 3 }).epochMilliseconds;
    }

    const temporalUnit: keyof Temporal.DurationLike = `${unit}s` as const;
    return start.add({ [temporalUnit]: 1 }).epochMilliseconds;
  },
};

export default adapter;

function startOf(
  _ts: number,
  unit: TimeUnit | 'isoWeek',
  options: AdapterOptions,
): Temporal.ZonedDateTime {
  const ts = Temporal.Instant.fromEpochMilliseconds(_ts).toZonedDateTimeISO(getTimeZone(options));

  if (unit === 'millisecond') {
    return ts;
  }

  if (unit === 'isoWeek' || unit === 'week') {
    const startOfDay = ts.startOfDay();
    return startOfDay.subtract({
      days: startOfDay.dayOfWeek - 1,
    });
  }

  if (unit === 'quarter') {
    const startOfMonth = startOf(_ts, 'month', options);
    const quarter = Math.floor(startOfMonth.month / 3);
    return startOfMonth.with({ month: quarter * 3 + 1 });
  }

  const index = units.indexOf(unit);
  const resetUnits = Object.fromEntries(
    units.slice(0, index).map((u) => [u, u === 'day' || u === 'month' ? 1 : 0]),
  );

  return ts.with(resetUnits);
}
