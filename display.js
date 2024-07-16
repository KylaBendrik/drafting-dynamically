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

inputDesign(design);
inputMeasurements(measurements);
inputSteps(steps);

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
      redrawSteps(input, input.value);
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

function redrawSteps(input, inputVal){
  console.log('redrawing');
  console.log(input, inputVal);
  console.log(input.id);
  measurements[input.id].value = inputVal
  stepsList.innerHTML = '';
  inputSteps(steps);
}
//canvas info
let canvas = document.getElementById('canvas');

//step controls

let currentStep = design.steps.length - 1; // Start at the last step

export function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    redrawSteps();
  }
}

export function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    redrawSteps();
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