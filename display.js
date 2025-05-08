import { designs } from './designs/design_list.js';
import { makePattern } from './pattern.js';
import { drawPattern } from './drawing.js';

const defaultCanvasSize = { x: 500, y: 500 };
const defaultPixelsPerInch = 32;
const defaultCanvasMargin = defaultPixelsPerInch / 2;
//change defaultDesign to whichever design you're working on, but make sure to change it back to the default (0) when you're done
const defaultDesign = designs[3];
const defaultPrecision = 8; //1/8 of an inch

let status = {
  design: defaultDesign,
  measurements: defaultDesign.measurements,
  precision: defaultPrecision, 
  canvasInfo: {
    defaultSize: defaultCanvasSize,
    size: {...defaultCanvasSize},
    margin: defaultCanvasMargin,
    pixelsPerInch: defaultPixelsPerInch,
    drawing: {
      points: [],
      lines: [],
      curves: []
    },
    pointSize: 5,
  },
  pattern: {
    points: {},
    lines: [],
    curves: [],
    steps: []
  }
}

let liMaxWidth = 0;

let measurementsList = document.getElementById('measurementsList');
let stepsList = document.getElementById('stepsList');
let designer = document.getElementById('designDesigner');
let designSource = document.getElementById('designSource');
let designSelect = document.getElementById('designSelect');

designs.forEach((design, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = design.label;
  designSelect.appendChild(option);
});

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

    if (measurements[measurement].step) {
      input.step = measurements[measurement].step;
    }

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
  let currentStep = 1;
  for (const step of steps) {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const instruction = document.createElement('p');
    label.textContent = `Step ${currentStep}.)`;
    instruction.textContent = step;
    li.appendChild(label);
    li.appendChild(instruction);
    stepsList.appendChild(li);
    currentStep++;
  }
}

function updateListLayout() {
  const doc_measurementsList = document.querySelector('#measurementsList');
  const liElements = doc_measurementsList.querySelectorAll('li');

  const listStyle = window.getComputedStyle(doc_measurementsList);
  const listPadding = parseFloat(listStyle.paddingLeft) + parseFloat(listStyle.paddingRight);

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

window.onload = function() {
  var stepsList = document.querySelector('#stepsList');
  stepsList.scrollTop = stepsList.scrollHeight;
}

window.addEventListener('resize', updateListLayout);
updateListLayout();

inputDesign(status.design);
inputMeasurements(status.design.measurements);
status = makePattern(status);
inputSteps(status.pattern.steps);
drawPattern(status);

console.log(status);

function redrawStepsFromMeasure(input, value) {
  stepsList.innerHTML = '';
  status.measurements[input.id].value = parseFloat(value);
  status = makePattern(status);
  inputSteps(status.pattern.steps);
  drawPattern(status);
}

designSelect.addEventListener('change', function() {
  let design = designs[designSelect.value];
  console.log(design);

  status.design = design;
  status.measurements = design.measurements;
  status.pattern = {
    points: {},
    lines: [],
    curves: [],
    steps: []
  }

  measurementsList.innerHTML = '';
  stepsList.innerHTML = '';
  inputDesign(status.design);
  inputMeasurements(status.design.measurements);
  status = makePattern(status);
  console.log('after makePattern', status);
  inputSteps(status.pattern.steps);
  drawPattern(status);
});
