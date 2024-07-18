import { designs } from './designs/design_list.js';

// export const margin = 30;
// export const pixelsPerInch = 32;

let design = designs[0];
const defaultCanvasSize = { x: 500, y: 500 };
const defaultPixelsPerInch = 32;
const defaultCanvasMargin = defaultPixelsPerInch / 2;

function defaultFurthestPoint() {
  return {x: defaultCanvasSize.x - defaultCanvasMargin, y: defaultCanvasSize.y - defaultCanvasMargin};
}

let status = {
  currentStep: design.steps.length - 1,
  measurements: design.measurements,
  steps: design.steps,
  points: {},
  furthestPoint: defaultFurthestPoint(),
  canvasInfo: {
    size: defaultCanvasSize,
    margin: defaultCanvasMargin,
    pixelsPerInch: defaultPixelsPerInch
  }
}

//when is canvas size used vs furthest point?
//canvas size includes margin, furthest point does not. 
//canvas size must be at least as large as furthest point + margin


let liMaxWidth = 0;

let measurementsList = document.getElementById('measurementsList');
let stepsList = document.getElementById('stepsList');
let designer = document.getElementById('designDesigner');
let designSource = document.getElementById('designSource');
let designSelect = document.getElementById('designSelect');

//we need to remake the steps process to use a "status" variable to pass over itself, 
// so we have updated measurements and points to use

//populate design select
designs.forEach((design, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = design.label;
  designSelect.appendChild(option);
});

//when design is selected, update the display
designSelect.addEventListener('change', () => {
  const selectedDesignIndex = designSelect.value;
  const selectedDesign = designs[selectedDesignIndex];

  design = selectedDesign;
  resetStatus(selectedDesign);
  //repopulate design info
  inputDesign(selectedDesign);
  //repopulate measurements
  measurementsList.innerHTML = '';
  inputMeasurements(selectedDesign.measurements);
  //repopulate steps
  stepsList.innerHTML = '';
  inputSteps(selectedDesign.steps);
})

//input design info to document
function inputDesign(design){
  designer.textContent = design.design_info.designer;
  designSource.textContent = design.design_info.source.label;
  designSource.href = design.design_info.source.link;
  designSource.target = "_blank";
}

function inputMeasurements(measurements){
  for (const measurement in measurements) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const label = document.createElement('label');
    label.for = measurement;
    label.textContent = measurements[measurement].label;
    input.type = "number";
    input.id = measurement;
    input.value = `${measurements[measurement].value}`;

    input.addEventListener('input', function() {
      redrawStepsFromMeasure(input, input.value);
    });

    li.appendChild(label);
    li.appendChild(input);
    measurementsList.appendChild(li);
    let liWidth = li.offsetWidth;
    if (liWidth > liMaxWidth) {
      liMaxWidth = liWidth;
    }
  }
}

function inputSteps(steps){
  for (const step in steps) {
    const li = document.createElement('li');
    li.textContent = `${parseInt(step) + 1} ${steps[step].description(status)}`;
    stepsList.appendChild(li);
  }
}

//redraw steps when measurement is changed
function redrawStepsFromMeasure(input, inputVal){
  status.measurements[input.id].value = inputVal
  stepsList.innerHTML = '';
  inputSteps(status.steps);
  drawSteps(status);
}
//draw steps and repaint canvas
function drawSteps(status) {
  
  let canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  //let's see the points. 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= status.currentStep; i++) {
    status = status.steps[i].action(ctx, status);
  }
  console.log("drawSteps status: ", status);

  status = findFurthestPoint(status);
  let defaultFP = defaultFurthestPoint()

  console.log(`dS: status fP ${printPoint(status.furthestPoint)} > canvas size? ${printPoint({x: canvas.width, y: canvas.height})}? `, isPointLarger(status.furthestPoint, {x: canvas.width, y: canvas.height}));
  console.log(`dS: status fP ${printPoint(status.furthestPoint)} < default furthest point ${printPoint(defaultFP)}? `, isPointLarger(defaultFP, status.furthestPoint));
  console.log(`dS: status canvas size == actual canvas size? ${printPoint(status.canvasInfo.size)} == ${printPoint({x: canvas.width, y: canvas.height})}? `, arePointsEqual(status.canvasInfo.size, {x: canvas.width, y: canvas.height}));
  console.log(`dS: status fP ${printPoint(status.furthestPoint)} < canvas size - margin ${printPoint(pointSubMargin({x: canvas.width, y: canvas.height}, status.canvasInfo.margin))}?`, isPointLarger({x: canvas.width - status.canvasInfo.margin, y: canvas.height - status.canvasInfo.margin}, status.furthestPoint));
  console.log(`dS: canvas: `, canvas)
  if (isPointLarger(status.furthestPoint, {x: canvas.width, y: canvas.height})) {
    console.log("dS: resizing canvas: status fP larger than canvas");
    status = resizeCanvas(status);
    drawSteps(status);
  } else if (status.furthestPoint.x < defaultFP.x || status.furthestPoint.y < defaultFP.y ){
    console.log("dS: resizing canvas: status FP smaller than default FP");
    console.log(status)
    //if the furthest point is less than the default furthest point, resize the canvas to the default size on that axis
    if (status.furthestPoint.x < defaultFP.x) {
      console.log(`dS: resizing canvas x to ${defaultCanvasSize.x}`);
      status.canvasInfo.size.x = defaultCanvasSize.x;
      console.log(`dS: status canvas size x set to default: ${printPoint(status.canvasInfo.size)}`);
    }
    if (status.furthestPoint.y < defaultFP.y) {
      console.log(`dS: resizing canvas y to ${defaultCanvasSize.y}`);
      status.canvasInfo.size.y = defaultCanvasSize.y;
      console.log(`dS: status canvas size y set to default: ${printPoint(status.canvasInfo.size)}`);
    }
    //status.furthestPoint = defaultFP;
    //status = resizeCanvas(status);
    if (!arePointsEqual(status.canvasInfo.size, {x: canvas.width, y: canvas.height})) {
      status = resizeCanvas(status);
      drawSteps(status);
    }
    //drawSteps(status);
  } else if (isPointLarger({x: canvas.width - status.canvasInfo.margin, y: canvas.height - status.canvasInfo.margin}, status.furthestPoint)){
    console.log("dS: resizing canvas: status fP smaller than canvas - margin");
    status = resizeCanvas(status);
    drawSteps(status);
  } else {
    console.log("dS: not resizing canvas");
  }
  highlightCurrentStep();
}

function findFurthestPoint(status) {
  console.log("findFP: points: ", status.points);
  let defaultFP = defaultFurthestPoint();
  let points = status.points;
  let currentFurthestPoint = {x: 0, y: 0};
  for (const point in points) {
    if (points[point].x > currentFurthestPoint.x) {
      currentFurthestPoint.x = points[point].x;
      console.log(`findFP: currentFurthestPoint x updated: ${printPoint(currentFurthestPoint)}`);
    }
    if (points[point].y > currentFurthestPoint.y) {
      currentFurthestPoint.y = points[point].y;
      console.log(`findFP: currentFurthestPoint y updated: ${printPoint(currentFurthestPoint)}`);
    }
  }
  
  console.log(`findFP: current furthest point: ${printPoint(currentFurthestPoint)}` );
  console.log(`findFP: default furthest point:  ${printPoint(defaultFP)}`);
  console.log(`findFP: status furthest point: ${printPoint(status.furthestPoint)}`);
  console.log(`findFP: combinedLargestPoint: ${printPoint(returnCombinedLargestPoint(defaultFP, currentFurthestPoint))}`);
  status.furthestPoint = returnCombinedLargestPoint(defaultFP, currentFurthestPoint);
  console.log(`findFP: status furthest point after update: ${printPoint(status.furthestPoint)}`);
  return status;
}

//status functions
function resetStatus(design){
  status.currentStep = design.steps.length - 1;
  status.measurements = design.measurements;
  status.steps = design.steps;
  status.points = design.points;
}

function printPoint(point){
  return `(${point.x}, ${point.y})`;
}
function returnLargestPoint(pointa, pointb) {
  if (isPointLarger(pointa, pointb)) {
    console.log(`returnLargestPoint: A (${printPoint(pointa)} > ${printPoint(pointb)})`);
    return pointa;
  } else {
    console.log(`returnLargestPoint: B (${printPoint(pointa)} < ${printPoint(pointb)})`);
    return pointb;
  }
}
function returnCombinedLargestPoint(pointa, pointb) {
  let newPoint = {x: 0, y: 0};
  newPoint.x = Math.max(pointa.x, pointb.x);
  newPoint.y = Math.max(pointa.y, pointb.y);

  return newPoint;
}
function isPointLarger(pointa, pointb) {
  if (pointa.x > pointb.x) {
    console.log(` - (x is larger: ${pointa.x} > ${pointb.x})`);
    return true;
  } else if (pointa.y > pointb.y){
    console.log(` - (y is larger: ${pointa.y} > ${pointb.y})`);
    return true;
  } else {  
    return false;
  }
}
function arePointsEqual(pointa, pointb) {
  if (pointa.x === pointb.x && pointa.y === pointb.y) {
    return true; 
  } else { 
    return false;
  }
}


function pointAddMargin(point, margin) {
  return {x: point.x + margin, y: point.y + margin};
}
function pointSubMargin(point, margin) {
  return {x: point.x - margin, y: point.y - margin};
}
//canvas info
function resizeCanvas(status) {
  let canvas = document.getElementById('canvas');
  const newSize = returnCombinedLargestPoint({x: status.furthestPoint.x + status.canvasInfo.margin, y: status.furthestPoint.y + status.canvasInfo.margin}, defaultCanvasSize);
  
  //should always be bigger than or equal to default canvas size
  console.log(`resizeCanvas: status canvas size == actual canvas size? ${printPoint(status.canvasInfo.size)} == ${printPoint({x: canvas.width, y: canvas.height})}? `, arePointsEqual(status.canvasInfo.size, {x: canvas.width, y: canvas.height}));
  console.log(`resizeCanvas: new size: ${printPoint(newSize)}`);
  canvas.width = newSize.x;
  canvas.height = newSize.y;
  status.canvasInfo.size = newSize;
  return status;
}
//step controls

export function previousStep() {
  console.log('previous step');
  if (status.currentStep > 0) {
    status.currentStep--;
    drawSteps(status);
  }
}

export function nextStep() {
  if (status.currentStep < status.steps.length - 1) {
    status.currentStep++;
    drawSteps(status);
  }
}
function highlightCurrentStep() {
  const stepsListItems = document.querySelectorAll('#stepsList li');
  stepsListItems.forEach((item, index) => {
    if (index === status.currentStep) {
      item.classList.add('current');
    } else {
      item.classList.remove('current');
    }
  });
}

//initialize
inputDesign(design);
inputMeasurements(status.measurements);
inputSteps(status.steps);
drawSteps(status);

//step controls
let previousStepButton = document.getElementById('previousStep');
let nextStepButton = document.getElementById('nextStep');
previousStepButton.onclick = function() {previousStep()};
nextStepButton.onclick =  function() {nextStep()};
//VISUAL DESIGN
//measurements list layout
function updateListLayout() {
  const doc_measurementsList = document.querySelector('#measurementsList');
  const liElements = doc_measurementsList.querySelectorAll('li');

  //get style of measurementsList
  const listStyle = window.getComputedStyle(doc_measurementsList);
  const listPadding = parseFloat(listStyle.paddingLeft) + parseFloat(listStyle.paddingRight);

  //find the max width of the li elements
  liElements.forEach((li) => {
    const liWidth = li.offsetWidth;
    if (liWidth > liMaxWidth) {
      liMaxWidth = liWidth;
    }
  });
  
  if (doc_measurementsList.offsetWidth < liMaxWidth + listPadding) {
    doc_measurementsList.classList.add('narrow');
  } else {
    doc_measurementsList.classList.remove('narrow');
  }
}
window.addEventListener('resize', updateListLayout);
updateListLayout();