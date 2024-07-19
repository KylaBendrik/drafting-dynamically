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
  point = {x: x, y: y, guides: guides};
  console.log(`setPoint(${printPoint(point)} ${guides})`);
  return point;
}

function printPoint(point){
  return `(${point.x}, ${point.y})`;
}

//turn steps_functions into steps strings, populated with the necessary numbers
function writeSteps(status){
  let steps = [];
  status.steps_functions.forEach(step_function => {
    steps.push(step_function(status.measurements));
  });
  status.pattern.steps = steps;
  console.log(`writeSteps(${steps})`);
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
  writeSteps(status);
  createShapes(status); //runs through steps.ations, populating points, lines, and curves

  console.log(`makePattern(${pattern})`);
  return status
}