const margin = 30;
const pixelsPerInch = 32;

// to make the measurements dynamic instead of hardcoded. 
// some patterns will need different measurements

let measurements = [
  {id: 'backLength', label: "Back Length", value: 15},
  {id: 'frontLength', label: "Front Length", value: 18.25},
  {id: 'blade', label: "Blade", value: 10},
  {id: 'heightUnderArm', label: "Height Under Arm", value: 7.5},
  {id: 'breast', label: "Breast", value: 36},
  {id: 'waist', label: "Waist", value: 25},
  {id: 'lengthOfFront', label: "Length of Front", value: 23},
  {id: 'shoulder', label: "Desired Shoulder Width", value: 4},
  {id: 'neckline', label: "Neckline", value: 10}
];

const measurementsList = document.getElementById('measurementsList');
measurements.forEach((measurement, index) => {
  const input = document.createElement('input');
  const label = document.createElement('label');
  label.for = measurement.id;
  label.textContent = measurement.label;
  input.type = "number";
  input.id = measurement.id;
  input.value= `${measurement.value}`;
  input.oninput = "updatePattern()";
  measurementsList.appendChild(label);
  measurementsList.appendChild(input);
})

let canvas = document.getElementById('canvas');
let points = {
    'O': { x: canvas.width - margin, y: margin },
    '1': { x: canvas.width - margin, y: margin + pixelsPerInch },
    'A': { x: 0, y: 0 },
    'B': { x: 0, y: 0 },
    'D': { x: 0, y: 0 },
    // Add more points as needed for your pattern drafting steps
};

function formatLength(length) {
    const inches = Math.floor(length);
    const fraction = length - inches;

    if (fraction === 0) {
        // whole number
        return `${inches}`;
    }

    let fractions = [
        { value: 1/8, display: '1/8' },
        { value: 1/4, display: '1/4' },
        { value: 3/8, display: '3/8' },
        { value: 1/2, display: '1/2' },
        { value: 5/8, display: '5/8' },
        { value: 3/4, display: '3/4' },
        { value: 7/8, display: '7/8' }
    ];

    let closestFraction = fractions[0];
    let closestDistance = Math.abs(fraction - closestFraction.value);

    for (let frac of fractions) {
        const distance = Math.abs(fraction - frac.value);
        if (distance < closestDistance) {
            closestFraction = frac;
            closestDistance = distance;
        }
    }

    return `${inches} ${closestFraction.display}`;
}

const steps = [
    {
        description: 'Set point O in upper right of canvas',
        action: (ctx) => {
            drawPoint(ctx, 'O', points['O']);
        }
    },
    {
        description: 'Create lines down and to the left from O',
        action: (ctx) => {
            drawGuide(ctx, points['O'], { x: canvas.width - margin, y: canvas.height - margin });
            drawGuide(ctx, points['O'], { x: margin, y: margin });
        }
    },
    {
        description: 'Point 1 is 3/4 inch down from O',
        action: (ctx) => {
            drawPoint(ctx, '1', points['1']);
        }
    },
    {
        description: 'From point 1, go down the back length to define point B',
        action: (ctx) => {
            const backLength = parseFloat(document.getElementById('backLength').value);
            const point1 = points['1'];
            points['B'] = definePoint(ctx, 'B', point1, { x: 0, y: 1 }, backLength);
            drawPoint(ctx, 'B', points['B']);
        }
    },
    {
        description: 'From point B, go up the height under arm to define point A',
        action: (ctx) => {
            const heightUnderArm = parseFloat(document.getElementById('heightUnderArm').value);
            const pointB = points['B'];
            points['A'] = definePoint(ctx, 'A', pointB, { x: 0, y: -1 }, heightUnderArm);
            drawPoint(ctx, 'A', points['A']);
        }
    },
    {
        description: 'From points A and B, draw lines across',
        action: (ctx) => {
            drawGuide(ctx, points['A'], { x: margin, y: points['A'].y });
            drawGuide(ctx, points['B'], { x: margin, y: points['B'].y });
        }
    },
    {
        description: `B to D is 1/12 breast (${formatLength(parseFloat(document.getElementById('breast').value) / 12)} inches)`,
        action: (ctx) => {
            const breast = parseFloat(document.getElementById('breast').value);
            const pointB = points['B'];
            points['D'] = definePoint(ctx, 'D', pointB, { x: -1, y: 0 }, breast / 12);
            drawPoint(ctx, 'D', points['D']);
        }
    },
    {
        description: 'Draw back line from 1 to D',
        action: (ctx) => {
            drawLine(ctx, points['1'], points['D']);
        }
    },
    {
        description: 'Point A1 is where the line 1-D crosses line extending left from A',
        action: (ctx) => {
            points['A1'] = findIntersectionPoint(points['1'], points['D'], points['A'], { x: margin, y: points['A'].y });
            drawPoint(ctx, 'A1', points['A1']);
        }
    },
];

let currentStep = steps.length - 1; // Start at the last step

function drawPoint(ctx, label, point) {
    ctx.fillStyle = 'black';
    ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
    ctx.fillText(label, point.x + 5, point.y - 5);
}

function drawGuide(ctx, point1, point2) {
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawLine(ctx, point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
}

function findIntersectionPoint(line1a, line1b, line2a, line2b) {
    //line 1
    const slope1 = (line1b.y - line1a.y) / (line1b.x - line1a.x);
    const y_intercept1 = line1a.y - slope1 * line1a.x;

    let intersectX = 0;
    let intersectY = 0;

    //line 2
    if (line2b.x - line2a.x === 0) {
        // line 2 is vertical
        intersectX = line2a.x;
        intersectY = slope1 * intersectX + y_intercept1;
    } else {
        // line 2 is not vertical
        const slope2 = (line2b.y - line2a.y) / (line2b.x - line2a.x);
        const y_intercept2 = line2a.y - slope2 * line2a.x;

        //calculate intersection point
        intersectX = (y_intercept2 - y_intercept1) / (slope1 - slope2);
        intersectY = slope1 * intersectX + y_intercept1;
    }

    return { x: intersectX, y: intersectY };
}

function definePoint(ctx, label, startPoint, direction, distanceInInches) {
    const distanceInPixels = distanceInInches * pixelsPerInch;
    const newX = startPoint.x + direction.x * distanceInPixels;
    const newY = startPoint.y + direction.y * distanceInPixels;
    return { x: newX, y: newY };
}

function updatePattern() {
    const backLength = parseFloat(document.getElementById('backLength').value);
    const frontLength = parseFloat(document.getElementById('frontLength').value);
    const heightUnderArm = parseFloat(document.getElementById('heightUnderArm').value);

    console.log('Updated back length:', backLength);
    console.log('Updated front length:', frontLength);
    console.log('Updated height under arm:', heightUnderArm);

    // Adjust canvas drawing based on these values
    redrawSteps(); // Ensure canvas redraws with updated values
}

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

// Populate the steps list
const stepsList = document.getElementById('stepsList');
steps.forEach((step, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${step.description}`;
    stepsList.appendChild(li);
});

// Initial draw
redrawSteps();
