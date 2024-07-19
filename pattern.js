//turn design into pattern

export function inchesToPrecision(status, inches){
  const precision = status.precision;
  console.log(`inchesToPrecision: ${inches} * ${precision} = ${Math.round(inches * precision)}`);

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

function printPoint(point){
  return `(${point.x}, ${point.y})`;
}

//create shapes for pattern based on steps actions
function createShapes(status){
  console.log(status)
  let stepFuncs = status.design.steps;
  console.log(stepFuncs);

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

  return status
}