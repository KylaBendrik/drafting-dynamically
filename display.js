import { designs } from './designs/design_list.js';
import { makePattern } from './pattern.js';
import { drawPattern } from './drawing.js';

const defaultCanvasSize = { x: 500, y: 500 };
const defaultPixelsPerInch = 32;
const defaultCanvasMargin = defaultPixelsPerInch / 2;
const defaultDesign = designs[0];
const defaultPrecision = 8; //1/8 of an inch

let status = {
  design: defaultDesign,
  measurements: defaultDesign.measurements,
  precision: defaultPrecision, 
  canvasInfo: {
    size: defaultCanvasSize,
    margin: defaultCanvasMargin,
    pixelsPerInch: defaultPixelsPerInch,
    drawing: { //in pixels, written as ctx instructions and moved to consider canvas size and margin
      points: [], //list of ctx instructions to draw points
      lines: [],  //list of ctx instructions to draw lines
      curves: [] //list of ctx instructions to draw curves
    },
    pointSize: 2, //size of points in pixels
  },
  pattern: { //in inches * precision
    points: {}, //'label': {x: 0, y: 0, guides:{u: true or false, d: true or false, l: true or false, r: true or false}}
    lines: [], //{start: 'pointName', end: 'pointName', style: 'solid' or 'dashed', length: 'determined' (default) or 'continuing' (extends beyond end point)}
    curves: [], //{start: 'pointName', end: 'pointName', style: 'solid' or 'dashed', quarter: 1 or 2 or 3 or 4 (counting clockwise from 12)} treated as quarter of ellipse
    steps: [] //strings of written instructions, populated with numbers
  }
}


//new proces
//1. get design
//2. get measurements
//3. send measurements to design, get pattern object. Pattern contains points, lines, and curves. Pattern is in inches * precision (default 1/8s of an inch, or inch * 8)
//4. write steps list
//5. convert pattern to pixels
//6. draw pattern on canvas
//7. check for changed design or measurements
let liMaxWidth = 0;

let measurementsList = document.getElementById('measurementsList');
let stepsList = document.getElementById('stepsList');
let designer = document.getElementById('designDesigner');
let designSource = document.getElementById('designSource');
let designSelect = document.getElementById('designSelect');

//populate design select
designs.forEach((design, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = design.label;
  designSelect.appendChild(option);
});

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
console.log('inputSteps');
console.log(steps);
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
  }
}

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
window.onload = function() {
  var stepsList = document.querySelector('#stepsList');
  stepsList.scrollTop = stepsList.scrollHeight;
}
window.addEventListener('resize', updateListLayout);
updateListLayout();

//start the process, populate the design, measurements, and steps
inputDesign(status.design);
inputMeasurements(status.design.measurements);
status = makePattern(status);
inputSteps(status.pattern.steps); //simply read the steps and put in document
drawPattern(status);
//listen for new measurements
function redrawStepsFromMeasure(input, value) {
  status.measurements[input.id].value = value;
  status = makePattern(status);
  inputSteps(status.pattern.steps); //simply read the steps and put in document
  drawPattern(status);
}
//listen for new design
designSelect.addEventListener('change', function() {
  status.design = designs[designSelect.value];
  status.measurements = status.design.measurements;
  status.steps_functions = status.design.steps;
  measurementsList.innerHTML = '';
  stepsList.innerHTML = '';
  inputDesign(status.design);
  inputMeasurements(status.design.measurements);
  status = makePattern(status);
  inputSteps(status.pattern.steps); //simply read the steps and put in document
  drawPattern(status);
});
