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
