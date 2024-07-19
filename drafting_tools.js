export function formatFraction(num) {
  const inches = Math.floor(num);
  const fraction = num - inches;

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

  if (inches === 0) {
    return `${closestFraction.display}`;
  }

  return `${inches} ${closestFraction.display}`;
}

export function formatNum(num, style){
  if (style === "(") {
    return `(${formatFraction(num)} in.)`
  } else {
    return `${formatFraction(num)} in.`
  }
}

export function formatMeasure(measure, style) {
  return formatNum(parseFloat(measure.value), style)
}
export function formatMeasureDiv(measure, divisor, style) {
  return formatNum(parseFloat(measure.value) / divisor, style)
}
export function formatMeasureMul(measure, multiplier, style) {
  return formatNum(parseFloat(measure.value) * multiplier, style)
}

export function formatMeasureAdd(measure, addend, style) {
  return formatNum(parseFloat(measure.value) + addend, style)
}

export function formatMeasureSub(measure, subtrahend, style) {
  return formatNum(parseFloat(measure.value) - subtrahend, style)
}

export function printPoint(point){
  return `(${point.x}, ${point.y})`;
}
export function printLine(line){
  return `${printPoint(line.pointa)} to ${printPoint(line.pointb)}`;
}

//canvas drawing functions

export function drawPoint(ctx, label, point) {
  ctx.fillStyle = 'black';
  ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
  ctx.fillText(label, point.x + 5, point.y - 5);
}

export function drawGuide(ctx, point1, point2) {
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawLine(ctx, point1, point2) {
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}
export function drawQuarterEllipse(ctx, point1, point2, center){
  console.log(`drawQuarterEllipse: point1: ${printPoint(point1)}, point2: ${printPoint(point2)}, center: ${printPoint(center)}`);
  //calculate radii
  const radiusX = Math.abs(center.x - point2.x);
  const radiusY = Math.abs(center.y - point1.y);

  //save context state
  ctx.save();

  //Move to center
  ctx.translate(center.x, center.y);

  if (radiusX > radiusY){
    //horizontal ellipse
    ctx.scale(1, radiusY / radiusX);
    var radius = radiusX
  } else {
    //vertical ellipse
    ctx.scale(radiusX / radiusY, 1);
    var radius = radiusY
  }
  // Determine the start and end angles
  const startAngle = 0.5 * Math.PI; // 180 degrees
  const endAngle = Math.PI; // 270 degrees

  //drawing style
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  // Draw the ellipse
  ctx.beginPath();
  ctx.arc(0, 0, radius, startAngle, endAngle);
  ctx.stroke();

  // Restore the context
  ctx.restore();
}

export function returnGuide(status, point, dirInput){
  console.log(status)
  const size = status.canvasInfo.size;
  const margin = status.canvasInfo.margin;
  const direction = dir(dirInput);
  
  console.log(`returnGuide: point: ${printPoint(point)}, direction: ${printPoint(direction)}`);
  let pointb = {};
  //if direction is l, r, u, or d, return a line from point to the edge of the canvas in that direction
  //if direction is a point, return a line from point to where that point meets the canvas margin
  //as a reminder, the canvas is 0,0 in the upper left corner
  if (direction.x === -1 && direction.y === 0){
    //left: closer to x = 0
    pointb = {x: margin, y: point.y};
  } else if (direction.x === 1 && direction.y === 0){
    //right: closer to x = size.x
    pointb = {x: size.x - margin, y: point.y};
  } else if (direction.x === 0 && direction.y === -1){
    //up: closer to y = 0
    pointb = {x: point.x, y: margin};
  } else if (direction.x === 0 && direction.y === 1){ 
    //down: closer to y = size.y
    console.log(`point: ${printPoint(point)} going down. size.y: ${size.y}, margin: ${margin}`);
    pointb = {x: point.x, y: size.y - margin};
  } else {
    //not a right angle, so figure out the general direction to pick the margin line
    console.log(`Houston we have a problem: ${direction}`);
    pointb = point;
  }

  return {pointa: point, pointb: pointb}
}

function returnLine(point1, point2){
  return {pointa: point1, pointb: point2}
}

//geometry functions

export function fractionBetween(num1, num2, fraction, style, pixelsPerInch){ 
  console.log(`fractionBetween: num1: ${num1}, num2: ${num2}, fraction: ${fraction}, style: ${style}, pixelsPerInch: ${pixelsPerInch}`);
  let distBetween = 0;
  if (num1 > num2){
    distBetween = (num1 - num2) * fraction;
  } else {
    distBetween = (num2 - num1) * fraction;
  }
  if (style === "pix_to_inch"){
    console.log(`fractionBetween: ${distBetween / pixelsPerInch}`)
    return distBetween / pixelsPerInch;
  } else {
    
    console.log(`fractionBetween: ${distBetween}`)
    return distBetween;
  }
  
}

export function dir(direction){
  console.log(`dir:`, direction);
  if (direction === "l"){
    return {x: -1, y: 0};
  } else if (direction === "r"){
    return {x: 1, y: 0};
  } else if (direction === "u"){
    return {x: 0, y: -1};  
  } else if (direction === "d"){
    return {x: 0, y: 1};
  } else {
    return direction;
  }

}

function isLineVertical(line){
  return line.pointa.x === line.pointb.x;
}

function isLineHorizontal(line){
  return line.pointa.y === line.pointb.y;
}

export function findIntersectionPointofGuides(status, point1, direction1, point2, direction2) {
  const guide1 = returnGuide(status, point1, direction1);
  const guide2 = returnGuide(status, point2, direction2);
  console.log(`guide1: ${printLine(guide1)}`);
  console.log(`guide2: ${printLine(guide2)}`);
  return findIntersectionPointofLines(guide1, guide2);

}
function findIntersectionofRightAngles(horizontal, vertical) {
  console.log('find intersection of right angles');
  console.log(`horizontal: ${printLine(horizontal)}`);
  console.log(`vertical: ${printLine(vertical)}`);
  let x = vertical.pointa.x;
  let y = horizontal.pointa.y;
  console.log(`x: ${x}, y: ${y}`);
  return {x: vertical.pointa.x, y: horizontal.pointa.y};
}

export function findIntersectionPointofLines(line1, line2) {
  console.log('find intersection of lines');
  console.log(`line1: ${printLine(line1)}`);
  console.log(`line2: ${printLine(line2)}`);
  if (isLineHorizontal(line1) && isLineVertical(line2)){
    console.log("line 1 horizontal and line 2 vertical");
    return findIntersectionofRightAngles(line1, line2);
  } else if (isLineVertical(line1) && isLineHorizontal(line2)){
    console.log("line 1 vertical and line 2 horizontal");
    return findIntersectionofRightAngles(line2, line1);
  } else {
    findIntersectionPoint(line1.pointa, line1.pointb, line2.pointa, line2.pointb);
  }
}

function findVerticalLineIntersection(verticalLine, line){
  const slope = (line.pointb.y - line.pointa.y) / (line.pointb.x - line.pointa.x);
  const y_intercept = line.pointa.y - slope * line.pointa.x;
  const intersectX = verticalLine.pointa.x;
  const intersectY = slope * intersectX + y_intercept;
  return { x: intersectX, y: intersectY };
}

export function findIntersectionPoint(line1a, line1b, line2a, line2b) {
console.log('findIntersectionPoint');
console.log(line1a);
console.log(line1b);
console.log(line2a);
console.log(line2b);
const line1 = returnLine(line1a, line1b);
  const line2 = returnLine(line2a, line2b);

  if (isLineVertical(line1) && isLineVertical(line2)) {
    console.log("both lines are vertical");
    return { x: null, y: null };
  } else if (isLineVertical(line1)){
    //line 1 is vertical
    console.log("line 1 is vertical");
    return findVerticalLineIntersection(line1, line2);
  } else if (isLineVertical(line2)){
    //line 2 is vertical
    console.log("line 2 is vertical");
    return findVerticalLineIntersection(line2, line1);
  } else {
    //neither line is vertical
    console.log("neither line is vertical");
    const slope1 = (line1b.y - line1a.y) / (line1b.x - line1a.x);
    const y_intercept1 = line1a.y - slope1 * line1a.x;
    const slope2 = (line2b.y - line2a.y) / (line2b.x - line2a.x);
    const y_intercept2 = line2a.y - slope2 * line2a.x;
    const intersectX = (y_intercept2 - y_intercept1) / (slope1 - slope2);
    const intersectY = slope1 * intersectX + y_intercept1;

    console.log(`intersectX: ${intersectX}, intersectY: ${intersectY}`);
    return { x: intersectX, y: intersectY };
  }
}

export function definePoint(status, startPoint, direction, distanceInInches) {
  console.log(distanceInInches);
  console.log(`definePoint: startPoint: ${printPoint(startPoint)}, direction: ${printPoint(direction)}, distanceInInches: ${distanceInInches}`);
  const pixelsPerInch = status.canvasInfo.pixelsPerInch;
  
  const distanceInPixels = distanceInInches * pixelsPerInch;
  const newX = startPoint.x + direction.x * distanceInPixels;
  const newY = startPoint.y + direction.y * distanceInPixels;
  // y gets smaller as you go up the canvas
  

  return { x: Math.round(newX), y: Math.round(newY) };
}

export function findPointAlongLine(status, startPoint, endPoint, distanceInInches) {
  const pixelsPerInch = status.canvasInfo.pixelsPerInch;
  const distanceInPixels = distanceInInches * pixelsPerInch;
  console.log(`findPointAlongLine: startPoint: ${printPoint(startPoint)}, endPoint: ${printPoint(endPoint)}, distanceInInches: ${distanceInInches}`);
  if (isLineVertical({ pointa: startPoint, pointb: endPoint })) {
    if (startPoint.y > endPoint.y) {
      return { x: startPoint.x, y: startPoint.y - distanceInPixels };
    } else {
      return { x: startPoint.x, y: startPoint.y + distanceInPixels };
    }
  } 
  const slope = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
  const angle = Math.atan(slope);
  const newX = startPoint.x + Math.cos(angle) * distanceInPixels;
  const newY = startPoint.y + Math.sin(angle) * distanceInPixels;
  return { x: Math.round(newX), y: Math.round(newY) };
}

export function initPoints(status, pointsList) {
  //returns points object
  let points = {};
  for (let point of pointsList) {
    points[point] = { x: 0, y: 0 };
  }
  console.log("initPoints: ", points)
  status.points = points;
  return status;
}

export default { 
  formatMeasure, 
  drawPoint, 
  drawGuide, 
  drawLine, 
  findIntersectionPoint, 
  definePoint 
};
