[![npm badge](https://img.shields.io/npm/v/chartjs-adapter-temporal)](https://www.npmjs.com/package/chartjs-adapter-temporal)
[![bundlejs badge](https://deno.bundlejs.com/?badge&q=chartjs-adapter-temporal)](https://bundlejs.com/?q=chartjs-adapter-temporal)

Time adapter for Chart.js using the Temporal API (Stage 3 proposal) and the Intl.DateTimeFormat API.

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

```ts
import { _adapters } from 'chart.js/auto';
import temporalAdapter from 'chartjs-adapter-temporal';

_adapters._date.override(temporalAdapter);
```
