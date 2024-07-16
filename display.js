import { designs } from './designs/design_list.js';

console.log(designs);

let design = designs[0];
let measurements = design.measurements;

document.getElementById('designDesigner').textContent = design.design_info.designer;
document.getElementById('designSource').textContent = design.design_info.source.label;
document.getElementById('designSource').href = design.design_info.source.link;

//initialized measurements
for (const measurement in measurements) {
  const li = document.createElement('li');
  const input = document.createElement('input');
  const label = document.createElement('label');
  label.for = measurement;
  label.textContent = measurements[measurement].label;
  input.type = "number";
  input.id = measurement;
  input.value = `${measurements[measurement].value}`;
  input.oninput = updateDesign;
  li.appendChild(label);
  li.appendChild(input);
  measurementsList.appendChild(li);
}


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

  for (const measurement in measurements) {
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
  }

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

function redrawSteps() {
  // get measurements from inputs

  for (let key in measurements) {
    let element = document.getElementById(key.label);
    measurements[key].value = parseFloat(element.value);
    console.log(measurements[key].value);
  }




  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= currentStep; i++) {
    design.steps[i].action(ctx, measurements);
  }
  highlightCurrentStep();
}
// Initial draw
redrawSteps();
