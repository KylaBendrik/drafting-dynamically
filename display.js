import { measurements, steps, pattern, points } from './drafting.js';function highlightCurrentStep() {
  const stepsListItems = document.querySelectorAll('#stepsList li');
  stepsListItems.forEach((item, index) => {
    if (index === currentStep) {
      item.classList.add('current');
    } else {
      item.classList.remove('current');
    }
  });
}

const measurementsList = document.getElementById('measurementsList');
measurements.forEach((measurement, index) => {
  const input = document.createElement('input');
  const label = document.createElement('label');
  label.for = measurement.id;
  label.textContent = measurement.label;
  input.type = "number";
  input.id = measurement.id;
  input.value = `${measurement.value}`;
  input.oninput = updatePattern;
  measurementsList.appendChild(label);
  measurementsList.appendChild(input);
});

// Populate the steps list
const stepsList = document.getElementById('stepsList');
steps.forEach((step, index) => {
  const li = document.createElement('li');
  li.textContent = `${index + 1}. ${step.description}`;
  stepsList.appendChild(li);
});

const patternInfo = document.getElementById('patternInfo');
const title = document.createElement('h2');
const designer = document.createElement('h3');
const source = document.createElement('a');

title.textContent = pattern.title;
designer.textContent = pattern.designer;
source.textContent = pattern.source.label;
source.href = pattern.source.url;

patternInfo.appendChild(title);
patternInfo.appendChild(designer);
patternInfo.appendChild(source);

function updatePattern() {
  const backLength = parseFloat(document.getElementById('backLength').value);
  const frontLength = parseFloat(document.getElementById('frontLength').value);
  const heightUnderArm = parseFloat(document.getElementById('heightUnderArm').value);


  // Adjust canvas drawing based on these values
  redrawSteps(); // Ensure canvas redraws with updated values
}

let canvas = document.getElementById('canvas');

function previousStep() {
  if (currentStep > 0) {
    currentStep--;
    redrawSteps();
  }
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    redrawSteps();
  }
}

function redrawSteps() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= currentStep; i++) {
    steps[i].action(ctx);
  }
  highlightCurrentStep();
}


// Initial draw
redrawSteps();