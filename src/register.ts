import { _adapters } from 'chart.js';
import adapter from './';

_adapters._date.override(adapter);
