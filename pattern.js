//turn design into pattern

export function inchesToPrecision(status, inches){
  const precision = status.precision;
  return Math.round(inches * precision);
}

export function registerPoint(status, point, label = undefined) {
  // register point to the pattern
  status.pattern.points[label] = point;

  return status;
}

export function registerPoints(status, points) {
  // use registerPoint to register all points in the object
  // points is an object with keys as labels and values as points
  for (let key in points) {
    status = registerPoint(status, points[key], key);
  }
  return status;
}

export function setPoint(x, y, guides, visible = true){
  let tempGuide = {u: false, d: false, l: false, r: false};
  if (guides === undefined){
    guides = tempGuide;
  } else {
    guides = {...tempGuide, ...guides};
  }
  let point = {x: Math.round(x), y: Math.round(y), guides: guides, visible: visible};
  return point;
}

export function setPointLineY(status, point1, point2, y, guides, visible = true){
  //find x value where line between point1 and point2 crosses y

  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;

  let x = Math.round(x1 + (x2 - x1) * (y - y1) / (y2 - y1));
  let point = setPoint(x, y, guides, visible);

  return point;
}
export function setPointLineX(status, point1, point2, x, guides, visible = true){
  //find x value where line between point1 and point2 crosses y
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;

  let y = Math.round(y1 + (y2 - y1) * (x - x1) / (x2 - x1));
  let point = setPoint(x, y, guides, visible);

  return point;
}

export function setPointAlongLine(status, point1, point2, to3inInches, guides, visible = true){
  //find point distance from point1 along line to point2
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  //distance is expected to be a percentage of the distance between point1 and point2
  let dist1to2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  let distance = (to3inInches * status.precision ) / dist1to2;
  //let distance = to3inInches * status.precision;

  let x = Math.round(x1 + (x2 - x1) * distance);
  let y = Math.round(y1 + (y2 - y1) * distance);
  status = setPoint(x, y, guides, visible);

  return status;
}

export function setPointLineCircle(status, point1, point2, center, radius, visible = true){
  //first, find the slope of the line between point1 and point2
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let m = (y2 - y1) / (x2 - x1);
  //then, find the intercept
  let b = y1 - m * x1;

  //then, find the equation of the circle
  let k = center.x;
  let h = center.y;

  //equation of circle is (x-h)^2 + (y-k)^2 = r^2
  //where h and k are the center of the circle, and r is the radius
  //substitute y = mx + b into the circle equation

  let a = 1 + m * m;
  let b2 = 2 * (m * (b - h) - k);
  let c = k * k + (b - h) * (b - h) - radius * radius;

  //solve for x
  let x = Math.round((-b2 - Math.sqrt(b2 * b2 - 4 * a * c)) / (2 * a));
  let y = Math.round(m * x + b);
  status = setPoint(x, y, undefined, visible);
  //there may be two solutions, but we'll just use the first one for now

  return status;

}

export function setPointLineLine(status, point1, point2, point3, point4, visible = true){
  //find the intersection of two lines, defined by points 1 and 2, and points 3 and 4
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let x3 = point3.x;
  let y3 = point3.y;
  let x4 = point4.x;
  let y4 = point4.y;

  let m1 = (y2 - y1) / (x2 - x1);
  let m2 = (y4 - y3) / (x4 - x3);
  let b1 = y1 - m1 * x1;
  let b2 = y3 - m2 * x3;

  let x = (b2 - b1) / (m1 - m2);
  let y = m1 * x + b1;
  status = setPoint(x, y, {}, visible);

  return status;

}

export function makeTouchPoint(_status, point1, point2, quarter, depth = 0.5, visible = true) {
  //make a point that provides a touch point for a bezier curve. 
  //mid is the halfway point between point1 and point2
  //corner is the outher corner of the curve, if it were a rectangle
  //Depth is a percentage from mid to the corner, so 0.5 is halfway, 1 is all the way to the corner
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  //calculate center from point1, point2, and quarter
  let corner = { x: 0, y: 0 };
  let mid = { x: 0, y: 0 };
  let touch = { x: 0, y: 0 };
  let dist = { x: 0, y: 0 };

  if (quarter == 1) {
    //center is below point1 and left of point2
    corner.x = point1.x;
    corner.y = point2.y;

    //find the halfway point between point1 and point2
    mid.y = (point1.y + point2.y) / 2;
    mid.x = (point1.x + point2.x) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point

    touch.x = mid.x + dist.x * depth;
    touch.y = mid.y - dist.y * depth;

  } else if (quarter == 2) {
    //center is left of point1 and above point2
    corner.x = point2.x;
    corner.y = point1.y;

    //find the halfway point between point1 and point2
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point

    touch.x = mid.x + dist.x * depth;
    touch.y = mid.y + dist.y * depth;
  } else if (quarter == 3) {
    //center is above point1 and right of point2
    corner.x = point1.x;
    corner.y = point2.y;

    //find the halfway point between point1 and point2
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point

    touch.x = mid.x - dist.x * depth;
    touch.y = mid.y + dist.y * depth;
  } else if (quarter == 4) {
    //center is right of point1 and below point2
    corner.x = point2.x;
    corner.y = point1.y;

    //find the halfway point between point1 and point2
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point
    touch.x = mid.x - dist.x * depth;
    touch.y = mid.y - dist.y * depth;
  }


  return setPoint(touch.x, touch.y, {}, visible);
}

export function setLine(status, start, end, style = 'solid', length = 'defined'){
  let line = {
    start: start,
    end: end,
    style: style, //solid, dashed
    length: length //either defined or continued (extending past end point)
  };
  status.pattern.lines.push(line);

  return status;
}

export function setCurve(status, points, quarter, type = 'ellipse', style = 'solid'){
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  let curve = {
    points: points,
    quarter: quarter,
    type: type,
    style: style
  };
  status.pattern.curves.push(curve);
  return status;

}

export function perimeterEllipse(_status, center, point1, point2){
  //calculates 1/4 of the ellipse circumference, based on the quarter
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  //calculate center from start, end, and quarter
  //find semi major and semi minor axes, not sure if point1 or point2 is larger
  let dist1 = Math.abs((center.x - point1.x)) + Math.abs((center.y - point1.y));
  let dist2 = Math.abs((center.x - point2.x)) + Math.abs((center.y - point2.y));
  //a is semi-major, the larger distance
  //b is semi-minor, the smaller distance
  let a = 0;
  let b = 0;
  if (dist1 > dist2){ 
    a = dist1;
    b = dist2;
  } else {
    a = dist2;
    b = dist1;
  }
  //h is the eccentricity
  let h = Math.abs(a - b) * (a - b) / (Math.abs(a + b) * (a + b));
  let perimeter = Math.PI * (a + b) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
  return perimeter;
  //return 10;
}
export function distPointToPoint(point1, point2){
  return Math.round(Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y)));
}

export function distABC(status, pointa, pointb, pointc){
  const a = status.pattern.points[pointa];
  const b = status.pattern.points[pointb];
  const c = status.pattern.points[pointc];


  return Math.abs(distPointToPoint(a, b) + distPointToPoint(b, c));
}
//convert numbers to printable strings

function formatFraction(numInput){
  //num can be a string or a number
  let num = parseFloat(numInput);
  //return a whole number and/or a fraction, using halves, quarters, or eighths
  let whole = Math.floor(num);
  let fraction = num - whole;
  let fractionString = '';
  const fractions = {
    '1/8': 0.125,
    '1/4': 0.25,
    '3/8': 0.375,
    '1/2': 0.5,
    '5/8': 0.625,
    '3/4': 0.75,
    '7/8': 0.875
  }

  if (fraction !== 0){
    let bestFraction = '1/8';
    for (let key in fractions){
      if (Math.abs(fraction - fractions[key]) < Math.abs(fraction - fractions[bestFraction])){
        bestFraction = key;
      }
    }
    fractionString = bestFraction;
  }
  if (whole === 0){
    return fractionString;
  } else if (fractionString === ''){
    return `${whole}`;
  } else {
    return `${whole} ${fractionString}`;
  }
}

export function printMeasure(measure, math = 1){
  return printNum(measure.value, math);
}

export function printNum(num, math = 1){
  return `(${formatFraction(num * math)} in.)`;
}

//create shapes for pattern based on steps actions
function createShapes(status){
  let stepFuncs = status.design.steps;
  console.log('createShapes', status);
  console.log('createShapes stepFuncs', stepFuncs);

  stepFuncs.forEach(step => {
    let action = step.action;
    status = action(status);

    console.log('createShapes after action', status);
  });

  return status;
}

//turn steps_functions into steps strings, populated with the necessary numbers
function writeSteps(status){
  let steps = [];
  status.design.steps.forEach(step => {
    let description = step.description(status);
    steps.push(description);
  });
  status.pattern.steps = steps;
  return status;
}

export function makePattern(status){
  //loop through design's steps functions, passing measurements to each
  //create pattern, with steps, points, lines, and curves
  status.pattern = {
    points: {},
    lines: [],
    curves: [],
    steps: []
  };
  console.log('makePattern', status);
  status = writeSteps(status);
  console.log('makePattern after writeSteps', status);
  status = createShapes(status); //runs through steps.ations, populating points, lines, and curves
  console.log('makePattern after createShapes', status);
  return status;
}


