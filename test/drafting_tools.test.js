import assert from 'node:assert';
import test from 'node:test';

import {
  formatMeasure,
  formatFraction,
  formatNum,
  drawPoint,
  drawGuide,
  drawLine,
  findIntersectionPoint,
  definePoint
} from '../drafting_tools.js';

test('formatNum returns a string of a number with no parentheses', t => {
  assert.strictEqual(formatNum(1), '1 in.');
})

test('formatNum returns a string of a number with parentheses if asked for in the second argument', t => {
  assert.strictEqual(formatNum(1, "("), '(1 in.)');
})

test('formatNum works with a string as well as a value', t => {
  assert.strictEqual(formatNum('1'), '1 in.');
})

test('formatNum returns a nicely formatted fraction', t => {
  assert.strictEqual(formatNum(1/2), '1/2 in.');
  assert.strictEqual(formatNum(1/4), '1/4 in.');
  assert.strictEqual(formatNum(9/8), '1 1/8 in.');
  assert.strictEqual(formatNum(3), '3 in.');
  assert.strictEqual(formatNum(7.5), '7 1/2 in.');
})

test ('formatFraction returns a string of a fraction and/or a whole number', t => {
  assert.strictEqual(formatFraction(1/2), '1/2');
  assert.strictEqual(formatFraction(1/4), '1/4');
  assert.strictEqual(formatFraction(9/8), '1 1/8');
  assert.strictEqual(formatFraction(3), '3');
  assert.strictEqual(formatFraction(7.5), '7 1/2');
})

test('formatMeasure returns a string of a measurement', t => {
  const measure = { value: 7.5 };
  assert.strictEqual(formatMeasure(measure), '7 1/2 in.');
  assert.strictEqual(formatMeasure(measure, "("), '(7 1/2 in.)');
})

test('formatMeasure returns a string of a measurement, even if the value is a string', t => {
  const measure = { value: '7.5' };
  assert.strictEqual(formatMeasure(measure), '7 1/2 in.');
  assert.strictEqual(formatMeasure(measure, "("), '(7 1/2 in.)');
})



