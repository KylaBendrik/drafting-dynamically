import assert from 'node:assert';
import test from 'node:test';

import {
  formatMeasure,
  formatFraction,
  formatNum,
  findIntersectionPoint,
  returnGuide,
  dir
} from '../pattern.js';

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
  assert.strictEqual(formatNum(1 / 2), '1/2 in.');
  assert.strictEqual(formatNum(1 / 4), '1/4 in.');
  assert.strictEqual(formatNum(9 / 8), '1 1/8 in.');
  assert.strictEqual(formatNum(3), '3 in.');
  assert.strictEqual(formatNum(7.5), '7 1/2 in.');
})

test('formatFraction returns a string of a fraction and/or a whole number', t => {
  assert.strictEqual(formatFraction(1 / 2), '1/2');
  assert.strictEqual(formatFraction(1 / 4), '1/4');
  assert.strictEqual(formatFraction(9 / 8), '1 1/8');
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
test('dir returns a point', t => {
  assert.deepStrictEqual(dir('u'), { x: 0, y: -1 });
  assert.deepStrictEqual(dir('d'), { x: 0, y: 1 });
  assert.deepStrictEqual(dir('l'), { x: -1, y: 0 });
  assert.deepStrictEqual(dir('r'), { x: 1, y: 0 });
  assert.deepStrictEqual(dir({ x: 0, y: 1 }), { x: 0, y: 1 });
}
)
test('returnGuide returns a guide object', t => {
  const status = {
    points: {
      A: { x: 50, y: 50 }
    },
    canvasInfo: { margin: 10, size: { x: 100, y: 100 } }
  };
  const guide = returnGuide(status, status.points['A'], 'd');
  const goal = {
    pointa: { x: 50, y: 50 },
    pointb: { x: 50, y: 90 }
  }
  assert.deepStrictEqual(guide, goal);
}
)

test('findIntersectionPoint returns a point', t => {
  const pointA = { x: 116, y: 280 };
  const pointB = { x: 116, y: 484 };
  const pointC = { x: 484, y: 520 };
  const pointD = { x: 16, y: 520 };
  const intersection = findIntersectionPoint(pointA, pointB, pointC, pointD);
  const goal = { x: 116, y: 520 };
  assert.deepStrictEqual(intersection, goal);
})


