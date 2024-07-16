import { designs } from './designs/design_list.js';

console.log(designs);

let measurements = [];
let design = designs[0];

//populate design select
const designSelect = document.getElementById('designSelect');
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
  updateDesign(selectedDesign);
});

function updateDesign(design) {
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
    input.oninput = updateDesign;
    measurementsList.appendChild(label);
    measurementsList.appendChild(input);
  });

  // Display steps
  stepsList.innerHTML = '';
  steps.forEach((step, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${step.description(measurements)}`;
    stepsList.appendChild(li);
  });

  // Display design info
  title.textContent = design.title;
  designer.textContent = design.designer;
  source.textContent = design.source.label;
  source.href = design.source.url;

  // Adjust canvas drawing based on these values
  redrawSteps(); // Ensure canvas redraws with updated values
}

let canvas = document.getElementById('canvas');

let currentStep = design.steps.length - 1; // Start at the last step

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

  // get measurements from inputs
  measurements = measurements.map((measurement) => {
    return {
      ...measurement,
      value: parseFloat(document.getElementById(measurement.id).value)
    };
  });




  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= currentStep; i++) {
    design.steps[i].action(ctx, measurements);
  }
  highlightCurrentStep();
}
// Initial draw
redrawSteps();
