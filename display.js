import { designs } from '/patterns/design_list.js';



//populate pattern select
const patternSelect = document.getElementById('patternSelect');
designs.forEach((design, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = design.title;
  patternSelect.appendChild(option);
});

patternSelect.addEventListener('change', () => {
  const selectedPatternIndex = patternSelect.value;
  const selectedPattern = patterns[selectedPatternIndex];
  updatePattern(selectedPattern);
});

function updatePattern(pattern) {
  // Clear existing measurements
  measurementsList.innerHTML = '';

  // Display measurements
  measurements.forEach((measurement) => {
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

  // Display steps
  stepsList.innerHTML = '';
  steps.forEach((step, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${step.description}`;
    stepsList.appendChild(li);
  });

  // Display pattern info
  title.textContent = pattern.title;
  designer.textContent = pattern.designer;
  source.textContent = pattern.source.label;
  source.href = pattern.source.url;

  // Adjust canvas drawing based on these values
  redrawSteps(); // Ensure canvas redraws with updated values
}

// Display measurements
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

//display steps
const stepsList = document.getElementById('stepsList');
steps.forEach((step, index) => {
  const li = document.createElement('li');
  li.textContent = `${index + 1}. ${step.description}`;
  stepsList.appendChild(li);
});

//display pattern info

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

let currentStep = steps.length - 1; // Start at the last step

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
