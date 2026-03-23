[![npm badge](https://img.shields.io/npm/v/chartjs-adapter-temporal)](https://www.npmjs.com/package/chartjs-adapter-temporal)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/chartjs-adapter-temporal)

Time adapter for Chart.js using the [Temporal API](https://github.com/tc39/proposal-temporal) (Stage 3 proposal) and the [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

# Getting started

## Install

```
npm install chartjs-adapter-temporal
```

## Polyfill

Currently the Temporal API is not yet available in browsers. You can install one of multiple polyfills to use this adapter:

- [@js-temporal/polyfill
  ](https://www.npmjs.com/package/@js-temporal/polyfill)
- [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill)

## Register the adapter

Either explicitly register the adapter:

```ts
import { _adapters } from 'chart.js/auto';
import temporalAdapter from 'chartjs-adapter-temporal';

_adapters._date.override(temporalAdapter);
```

Or use the `register` import:

```ts
import 'chartjs-adapter-temporal/register';
```

## Custom display formats

Chart.js passes `displayFormats` values directly to the adapter's `format()` method. In addition to the built-in string keys (`'datetime'`, `'day'`, `'week'`, etc.), you can use:

### Intl.DateTimeFormatOptions objects

Pass formatting options directly — no need for predefined keys:

```ts
scales: {
  x: {
    type: 'time',
    time: {
      displayFormats: {
        day: { weekday: 'short' },
        month: { month: 'short' },
      },
    },
  },
}
```

### Callback functions

For formatting that Intl can't reliably do (e.g. ISO week numbers), use a callback:

```ts
scales: {
  x: {
    type: 'time',
    time: {
      displayFormats: {
        week: (timestamp, { timeZone }) => {
          const date = Temporal.Instant.fromEpochMilliseconds(timestamp)
            .toZonedDateTimeISO(timeZone)
            .toPlainDate();
          const week = String(date.weekOfYear!).padStart(2, '0');
          return `${date.yearOfWeek}-W${week}`;
        },
      },
    },
  },
}
```

The callback receives `(timestamp: number, context: { locale?: string; timeZone: string })` and should return a string.

> **Note on ISO weeks:** Use `yearOfWeek` (not `year`) when displaying week numbers — ISO week years don't always match the calendar year near New Year (e.g. 2022-01-01 is W52 of week-year 2021).

> **Note on TypeScript:** Chart.js types `displayFormats` values as `string`. Non-string format values work at runtime (Chart.js passes them through to the adapter without validation), but you may need a type assertion in strict TypeScript. See [chartjs/Chart.js#12220](https://github.com/chartjs/Chart.js/issues/12220).
