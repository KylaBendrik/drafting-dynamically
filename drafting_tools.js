import { measurements, steps, pattern, points } from './drafting.js';

const margin = 30;
const pixelsPerInch = 32;

function formatLength(length) {
  const inches = Math.floor(length);
  const fraction = length - inches;

  if (fraction === 0) {
    // whole number
    return `${inches}`;
  }

  let fractions = [
    { value: 1/8, display: '1/8' },
    { value: 1/4, display: '1/4' },
    { value: 3/8, display: '3/8' },
    { value: 1/2, display: '1/2' },
    { value: 5/8, display: '5/8' },
    { value: 3/4, display: '3/4' },
    { value: 7/8, display: '7/8' }
  ];

  let closestFraction = fractions[0];
  let closestDistance = Math.abs(fraction - closestFraction.value);

  for (let frac of fractions) {
    const distance = Math.abs(fraction - frac.value);
    if (distance < closestDistance) {
      closestFraction = frac;
      closestDistance = distance;
    }
  }

  return `${inches} ${closestFraction.display}`;
}

let currentStep = steps.length - 1; // Start at the last step

function drawPoint(ctx, label, point) {
  ctx.fillStyle = 'black';
  ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
  ctx.fillText(label, point.x + 5, point.y - 5);
}

function drawGuide(ctx, point1, point2) {
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLine(ctx, point1, point2) {
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

function findIntersectionPoint(line1a, line1b, line2a, line2b) {
  //line 1
  const slope1 = (line1b.y - line1a.y) / (line1b.x - line1a.x);
  const y_intercept1 = line1a.y - slope1 * line1a.x;

  let intersectX = 0;
  let intersectY = 0;

  //line 2
  if (line2b.x - line2a.x === 0) {
    // line 2 is vertical
    intersectX = line2a.x;
    intersectY = slope1 * intersectX + y_intercept1;
  } else {
    // line 2 is not vertical
    const slope2 = (line2b.y - line2a.y) / (line2b.x - line2a.x);
    const y_intercept2 = line2a.y - slope2 * line2a.x;

    //calculate intersection point
    intersectX = (y_intercept2 - y_intercept1) / (slope1 - slope2);
    intersectY = slope1 * intersectX + y_intercept1;
  }

  return { x: intersectX, y: intersectY };
}

function definePoint(ctx, label, startPoint, direction, distanceInInches) {
  const distanceInPixels = distanceInInches * pixelsPerInch;
  const newX = startPoint.x + direction.x * distanceInPixels;
  const newY = startPoint.y + direction.y * distanceInPixels;
  return { x: newX, y: newY };
}

module.exports = { 
  formatLength, 
  drawPoint, 
  drawGuide, 
  drawLine, 
  findIntersectionPoint, 
  definePoint 
};