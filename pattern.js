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

//convert numbers to printable strings

function formatFraction(num){
  //num can be a string or a number
  //return a whole number and/or a fraction, using halves, quarters, or eighths
  let whole = Math.floor(num);
  let fraction = num - whole;
  let fractionString = '';
  if (fraction !== 0){
    if (fraction === 0.5){
      fractionString = '1/2';
    } else if (fraction === 0.25){
      fractionString = '1/4';
    } else if (fraction === 0.125){
      fractionString = '1/8';
    } else if (fraction === 0.75){
      fractionString = '3/4';
    } else if (fraction === 0.375){
      fractionString = '3/8';
    } else if (fraction === 0.625){
      fractionString = '5/8';
    } else if (fraction === 0.875){
      fractionString = '7/8';
    }
  }
  if (whole === 0){
    return fractionString;
  } else if (fractionString === ''){
    return `${whole}`;
  } else {
    return `${whole} ${fractionString}`;
  }
}

export function printMeasure(measure){
  return `(${formatFraction(measure.value)} in.)`;
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
