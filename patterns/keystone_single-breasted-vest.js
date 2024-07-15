const pattern = {
  title: 'Single Breasted Vest',
  source: {
    link: 'https://archive.org/details/keystonejacketdr00heck/page/66/mode/2up',
    label: 'The Keystone Jacket and Dress Cutter'
  }
  ,
  designer: 'Charles Hecklinger'
}

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

let points = {
  'O': { x: canvas.width - margin, y: margin },
  '1': { x: canvas.width - margin, y: margin + pixelsPerInch },
  'A': { x: 0, y: 0 },
  'B': { x: 0, y: 0 },
  'D': { x: 0, y: 0 },
  // Add more points as needed for your pattern drafting steps
};

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

export { pattern, measurements, points, steps };
