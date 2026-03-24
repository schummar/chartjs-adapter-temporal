import { _adapters, defaults } from 'chart.js';
import adapter from './';

_adapters._date.override(adapter);

// displayFormats values may be functions or Intl.DateTimeFormatOptions (FormatValue),
// handled by the adapter — not Chart.js scriptable options. Without this,
// Chart.js calls function values with the chart context object instead of
// letting the adapter call them with a numeric timestamp.
// We set _scriptable directly on the defaults object (not via defaults.describe)
// because the resolver reads _scriptable from the scope chain, not from the
// separate _descriptors tree.
defaults.set('scales.time', {
  time: {
    displayFormats: {
      _scriptable: false,
      _indexable: false,
    },
  },
});
