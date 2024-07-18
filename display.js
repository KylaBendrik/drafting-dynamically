import { designs } from './designs/design_list.js';

let design = designs[0];
let measurements = design.measurements;
let steps = design.steps;

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

//when design is selected, update the display
designSelect.addEventListener('change', () => {
  const selectedDesignIndex = designSelect.value;
  const selectedDesign = designs[selectedDesignIndex];

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
    li.textContent = `${parseInt(step) + 1} ${steps[step].description(measurements)}`;
    stepsList.appendChild(li);
  }
}

//redraw steps when measurement is changed
function redrawStepsFromMeasure(input, inputVal){
  measurements[input.id].value = inputVal
  stepsList.innerHTML = '';
  inputSteps(steps);
  drawSteps(steps);
}
//draw steps and repaint canvas
function drawSteps(steps) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  steps.forEach((step) => {
    step.action(ctx, measurements);
  });
  highlightCurrentStep();
}
//canvas info
let canvas = document.getElementById('canvas');

//step controls

let currentStep = design.steps.length - 1; // Start at the last step

export function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    drawSteps(steps);
  }
}

export function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    drawSteps(steps);
  }
}
function highlightCurrentStep() {
  const stepsListItems = document.querySelectorAll('#stepsList li');
  stepsListItems.forEach((item, index) => {
    if (index === currentStep) {
      item.classList.add('current');
    } else {
      item.classList.remove('current');
    }
  });
}

//initialize
inputDesign(design);
inputMeasurements(measurements);
inputSteps(steps);
drawSteps(steps);

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