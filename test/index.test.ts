import 'temporal-polyfill/global';
import '../src/register';

import { _adapters, type DateAdapter } from 'chart.js';
import { beforeEach, describe, expect, test } from 'vitest';

const defaultAdapter: DateAdapter = new _adapters._date({
  locale: 'de-DE',
  timeZone: 'Europe/Berlin',
});
const formats = defaultAdapter.formats();
let adapter = defaultAdapter;

beforeEach(() => {
  adapter = new _adapters._date({
    locale: 'de-DE',
    timeZone: 'Europe/Berlin',
  });
});

describe('chart.js temporal adapter', () => {
  describe('adapter', () => {
    test('should be defined', () => {
      expect(adapter).toBeDefined();
    });

    test('can be initialized', () => {
      adapter.init({ locale: 'es' });
      expect(adapter.options.locale).toBe('es');
      expect(adapter.format(0, formats.datetime as any)).toBe('1 ene 1970, 1:00:00');
    });

    test('default timeZone', () => {
      const originial = Temporal.Now.timeZoneId;
      try {
        adapter = new _adapters._date({});
        Temporal.Now.timeZoneId = () => 'America/New_York';
        expect(adapter.format(0, formats.datetime as any)).toBe('Dec 31, 1969, 7:00:00 PM');
      } finally {
        Temporal.Now.timeZoneId = originial;
      }
    });
  });

  describe('parse', () => {
    test('should parse utc time correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z');
      expect(timestamp).toBe(1559056227000);
    });

    test('should parse local time correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000');
      expect(timestamp).toBe(1559049027000);
    });

    test('should parse Date object correctly', () => {
      const timestamp = adapter.parse(new Date('2019-05-28T15:10:27.000Z'));
      expect(timestamp).toBe(1559056227000);
    });

    test('should parse number correctly', () => {
      const timestamp = adapter.parse(1559056227000);
      expect(timestamp).toBe(1559056227000);
    });

    test('should throw error for invalid date', () => {
      expect(() => adapter.parse('invalid')).toThrow('Not a date: "invalid"');
    });
  });

  describe('format', () => {
    test('should format year correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.year as any)).toEqual('2019');
    });

    test('should format quarter correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.quarter as any)).toEqual('Q2 - 2019');
    });

    test('should format month correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.month as any)).toEqual('Mai 2019');
    });

    test('should format week correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.week as any)).toEqual('28. Mai');
    });

    test('should format day correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.day as any)).toEqual('28. Mai');
    });

    test('should format hour correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.hour as any)).toEqual('17:10');
    });

    test('should format minute correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.minute as any)).toEqual('17:10');
    });

    test('should format second correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.second as any)).toEqual('17:10:27');
    });

    test('should format millisecond correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.millisecond as any)).toEqual('17:10:27,000');
    });

    test('should format datetime correctly', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.datetime as any)).toEqual('28.05.2019, 17:10:27');
    });

    test('should format datetime correctly with custom locale', () => {
      adapter = new _adapters._date({ locale: 'en-US' });
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      expect(adapter.format(timestamp, formats.datetime as any)).toEqual(
        'May 28, 2019, 5:10:27 PM',
      );
    });

    test('should format datetime correctly with custom timeZone', () => {
      adapter = new _adapters._date({ timeZone: 'America/New_York' });
      const timestamp = adapter.parse('2019-05-28T15:10:27.000')!;
      expect(adapter.format(timestamp, formats.datetime as any)).toEqual(
        'May 28, 2019, 3:10:27 PM',
      );
    });
  });

  describe('add', () => {
    test('add year', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'year');
      expect(new Date(result).toISOString()).toEqual('2020-05-28T15:10:27.000Z');
    });

    test('add quarter', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'quarter');
      expect(new Date(result).toISOString()).toEqual('2019-08-28T15:10:27.000Z');
    });

    test('add month', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'month');
      expect(new Date(result).toISOString()).toEqual('2019-06-28T15:10:27.000Z');
    });

    test('add week', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'week');
      expect(new Date(result).toISOString()).toEqual('2019-06-04T15:10:27.000Z');
    });

    test('add day', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'day');
      expect(new Date(result).toISOString()).toEqual('2019-05-29T15:10:27.000Z');
    });

    test('add hour', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'hour');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T16:10:27.000Z');
    });

    test('add minute', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'minute');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:11:27.000Z');
    });

    test('add second', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'second');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:28.000Z');
    });

    test('add millisecond', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.add(timestamp, 1, 'millisecond');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:27.001Z');
    });
  });

  describe('diff', () => {
    test('diff year', () => {
      const timestamp1 = adapter.parse('2020-05-28T15:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'year');
      expect(result).toEqual(1);
    });

    test('diff quarter', () => {
      const timestamp1 = adapter.parse('2019-08-28T15:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'quarter');
      expect(result).toEqual(1);
    });

    test('diff month', () => {
      const timestamp1 = adapter.parse('2019-06-28T15:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'month');
      expect(result).toEqual(1);
    });

    test('diff week', () => {
      const timestamp1 = adapter.parse('2019-06-04T15:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'week');
      expect(result).toEqual(1);
    });

    test('diff day', () => {
      const timestamp1 = adapter.parse('2019-05-29T15:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'day');
      expect(result).toEqual(1);
    });

    test('diff hour', () => {
      const timestamp1 = adapter.parse('2019-05-28T16:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'hour');
      expect(result).toEqual(1);
    });

    test('diff minute', () => {
      const timestamp1 = adapter.parse('2019-05-28T15:11:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'minute');
      expect(result).toEqual(1);
    });

    test('diff second', () => {
      const timestamp1 = adapter.parse('2019-05-28T15:10:28.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'second');
      expect(result).toEqual(1);
    });

    test('diff millisecond', () => {
      const timestamp1 = adapter.parse('2019-05-28T15:10:27.001Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'millisecond');
      expect(result).toEqual(1);
    });

    test('diff with negative result', () => {
      const timestamp1 = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const timestamp2 = adapter.parse('2019-05-28T15:10:28.000Z')!;
      const result = adapter.diff(timestamp1, timestamp2, 'second');
      expect(result).toEqual(-1);
    });
  });

  describe('startOf', () => {
    test('startOf year', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'year');
      expect(new Date(result).toISOString()).toEqual('2018-12-31T23:00:00.000Z');
    });

    test('startOf quarter', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'quarter');
      expect(new Date(result).toISOString()).toEqual('2019-03-31T22:00:00.000Z');
    });

    test('startOf month', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'month');
      expect(new Date(result).toISOString()).toEqual('2019-04-30T22:00:00.000Z');
    });

    test('startOf week', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'week');
      expect(new Date(result).toISOString()).toEqual('2019-05-26T22:00:00.000Z');
    });

    test('startOf day', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'day');
      expect(new Date(result).toISOString()).toEqual('2019-05-27T22:00:00.000Z');
    });

    test('startOf hour', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'hour');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:00:00.000Z');
    });

    test('startOf minute', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'minute');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:00.000Z');
    });

    test('startOf second', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.startOf(timestamp, 'second');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:27.000Z');
    });

    test('startOf millisecond', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.123Z')!;
      const result = adapter.startOf(timestamp, 'millisecond');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:27.123Z');
    });
  });

  describe('endOf', () => {
    test('endOf year', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'year');
      expect(new Date(result).toISOString()).toEqual('2019-12-31T23:00:00.000Z');
    });

    test('endOf quarter', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'quarter');
      expect(new Date(result).toISOString()).toEqual('2019-06-30T22:00:00.000Z');
    });

    test('endOf month', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'month');
      expect(new Date(result).toISOString()).toEqual('2019-05-31T22:00:00.000Z');
    });

    test('endOf week', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'week');
      expect(new Date(result).toISOString()).toEqual('2019-06-02T22:00:00.000Z');
    });

    test('endOf day', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'day');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T22:00:00.000Z');
    });

    test('endOf hour', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'hour');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T16:00:00.000Z');
    });

    test('endOf minute', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'minute');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:11:00.000Z');
    });

    test('endOf second', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.000Z')!;
      const result = adapter.endOf(timestamp, 'second');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:28.000Z');
    });

    test('endOf millisecond', () => {
      const timestamp = adapter.parse('2019-05-28T15:10:27.123Z')!;
      const result = adapter.endOf(timestamp, 'millisecond');
      expect(new Date(result).toISOString()).toEqual('2019-05-28T15:10:27.124Z');
    });
  });
});
