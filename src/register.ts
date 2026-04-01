import adapter from './';
import { _adapters } from 'chart.js';

_adapters._date.override(adapter);
