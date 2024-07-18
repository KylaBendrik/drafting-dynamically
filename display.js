import { designs } from './designs/design_list.js';

// export const margin = 30;
// export const pixelsPerInch = 32;

let design = designs[0];
const defaultCanvasSize = { x: 500, y: 500 };
const defaultPixelsPerInch = 32;
const defaultCanvasMargin = defaultPixelsPerInch / 2;
// let measurements = design.measurements;
// let steps = design.steps;

let status = {
  currentStep: design.steps.length - 1,
  measurements: design.measurements,
  steps: design.steps,
  points: {},
  furthestPoint: {x: defaultCanvasSize.x - defaultCanvasMargin, y: defaultCanvasSize.x - defaultCanvasMargin},
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
  status = findFurthestPoint(status);
  console.log(`furthest point x (${status.furthestPoint.x}) > than canvas width (${canvas.width})? `, status.furthestPoint.x > canvas.width);
  console.log(`furthest point y (${status.furthestPoint.y}) > than canvas height (${canvas.height})? `, status.furthestPoint.y > canvas.height);
  console.log(`canvas: `, canvas)
  if (status.furthestPoint.x > canvas.width || status.furthestPoint.y > canvas.height) {
    console.log("resizing canvas");
    status = resizeCanvas(status);
    drawSteps(status);
  } else {
    console.log("not resizing canvas");
  }
  highlightCurrentStep();
}

function findFurthestPoint(status) {
  let points = status.points;
  for (const point in points) {
    if (points[point].x > status.furthestPoint.x) {
      status.furthestPoint.x = points[point].x;
    }
    if (points[point].y > status.furthestPoint.y) {
      status.furthestPoint.y = points[point].y;
    }
  }
  return status;
}

//status functions
function resetStatus(design){
  status.currentStep = design.steps.length - 1;
  status.measurements = design.measurements;
  status.steps = design.steps;
  status.points = design.points;
}

//canvas info
function resizeCanvas(status) {
  const newSize = {x: status.furthestPoint.x + status.canvasInfo.margin, y: status.furthestPoint.y + status.canvasInfo.margin};
  let canvas = document.getElementById('canvas');
  console.log(`canvas: `, canvas)
  canvas.width = newSize.x;
  canvas.height = newSize.y;
  status.canvasInfo.size = newSize;
  console.log("newsize: ", status.canvasInfo.size);
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