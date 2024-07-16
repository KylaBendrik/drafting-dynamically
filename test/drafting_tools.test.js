import assert from 'node:assert';
import test from 'node:test';

import {
  formatLength,
  drawPoint,
  drawGuide,
  drawLine,
  findIntersectionPoint,
  definePoint
} from '../drafting_tools.js';

test('formatLength returns a string of a whole number', t => {
  assert.strictEqual(formatLength(1), '0');
});
