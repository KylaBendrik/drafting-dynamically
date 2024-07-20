//turn design into pattern

export function inchesToPrecision(status, inches){
  const precision = status.precision;
  return Math.round(inches * precision);
}

export function setPoint(x, y, guides){
  let tempGuide = {u: false, d: false, l: false, r: false};
  if (guides === undefined){
    guides = tempGuide;
  } else {
    guides = {...tempGuide, ...guides};
  }
  let point = {x: x, y: y, guides: guides};
  return point;
}

export function setLine(status, start, end, style = 'solid', length = 'defined'){
  let line = {
    start: start,
    end: end,
    style: style,
    length: length //either defined or continued (extending past end point)
  };
  status.pattern.lines.push(line);
  console.log('setLine');
  console.log(status.pattern.lines);
  console.log(line);

  return status;
}

export function setPointLineY(status, point1, point2, y, guides){
  //find x value where line between point1 and point2 crosses y

  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;

  let x = Math.round(x1 + (x2 - x1) * (y - y1) / (y2 - y1));
  console.log(`x ${x} = where line from ${x1}, ${y1} to ${x2}, ${y2} crosses y ${y}`);
  status = setPoint(x, y, guides);

  return status;
}

export function setCurve(status, startPoint, endPoint, quarter ){
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  let curve = {
    start: startPoint,
    end: endPoint,
    quarter: quarter
  };
  status.pattern.curves.push(curve);
  return status;

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
  return `(${formatFraction(measure.value * math)} in.)`;
}

//create shapes for pattern based on steps actions
function createShapes(status){
  let stepFuncs = status.design.steps;

  stepFuncs.forEach(step => {
    let action = step.action;
    status = action(status);
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
  status = writeSteps(status);
  status = createShapes(status); //runs through steps.ations, populating points, lines, and curves

  return status;
}
