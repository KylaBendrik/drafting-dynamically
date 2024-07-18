import {
  formatMeasure,
  formatMeasureDiv,
  formatMeasureMul,
  formatMeasureAdd,
  formatMeasureSub,
  drawPoint, 
  drawGuide, 
  drawLine, 
  findIntersectionPoint, 
  definePoint,
  initPoints,
  findIntersectionPointofGuides,
  dir,
  printPoint,
  printLine
} from '../drafting_tools.js';

const design_info = {
  title: 'Keystone - Single Breasted Vest',
  source: {
    link: 'https://archive.org/details/keystonejacketdr00heck/page/66/mode/2up',
    label: 'The Keystone Jacket and Dress Cutter (pg 66)'
  },
  designer: 'Charles Hecklinger'
}

let measurements = {
  backLength: {label: "Back Length", value: 15},
  frontLength: {label: "Front Length", value: 18.25},
  blade: {label: "Blade", value: 10},
  heightUnderArm: {label: "Height Under Arm", value: 7.5},
  breast: {label: "Breast", value: 36},
  waist: {label: "Waist", value: 25},
  lengthOfFront: {label: "Length of Front", value: 23},
  shoulder: {label: "Desired Shoulder Width", value: 4},
  neckline: {label: "Neckline", value: 10}
};

// let points = {
//   'O': { x: 0, y: 0 },
//   '1': { x: 0, y: 0 },
//   'A': { x: 0, y: 0 },
//   'B': { x: 0, y: 0 },
//   'D': { x: 0, y: 0 },
//   // Add more points as needed for your pattern drafting steps
// };

const pointLabels = [
  'O', '1', 'A', 'B', 'D', 'A1', 'K', 'L', 'J',
]

const steps = [
  {
      description: (_status) => {return 'Set point O in upper right of canvas'},
      action: (ctx, status) => {
          //in the first step, always initialize the points
          status = initPoints(status, pointLabels);
          const margin = status.canvasInfo.margin;
          // console.log('step 0 status: ', status);
          status.points['O'] = { x: status.furthestPoint.x, y: margin };
          drawPoint(ctx, 'O', status.points['O']);
          return status;
      }
  },
  {
      description: (_status) => {return 'Create lines down and to the left from O'},
      action: (ctx, status) => {
          // console.log('step 1 status: ', status);
          const margin = status.canvasInfo.margin;
          drawGuide(ctx, status.points['O'], { x: status.canvasInfo.size.x - margin, y: status.canvasInfo.size.y - margin });
          drawGuide(ctx, status.points['O'], { x: margin, y: margin });
          return status;
      }
  },
  {
      description: (_status) => {return 'Point 1 is 3/4 inch down from O'},
      action: (ctx, status) => {
          status.points['1'] = definePoint(status, status.points['O'], { x: 0, y: 1 }, 3/4);
          drawPoint(ctx, '1', status.points['1']);
          return status;
      }
  },
  {
      description: (_status) => {return 'From point 1, go down the back length to define point B'},
      action: (ctx, status) => {
          const backLength = parseFloat(status.measurements.backLength.value);
          const point1 = status.points['1'];
          status.points['B'] = definePoint(status, point1, { x: 0, y: 1 }, backLength);
          drawPoint(ctx, 'B', status.points['B']);
          // console.log('step 3 status: ', status);
          return status;
      }
  },
  {
      description: (status) => {return `From point B, go up the height under arm ${formatMeasure(status.measurements.heightUnderArm)} to define point A`},
      action: (ctx, status) => {
          const heightUnderArm = parseFloat(status.measurements.heightUnderArm.value);
          const pointB = status.points['B'];
          status.points['A'] = definePoint(status, pointB, { x: 0, y: -1 }, heightUnderArm);
          drawPoint(ctx, 'A', status.points['A']);
          return status;
      }
  },
  {
      description: (_status) => {return 'From points A and B, draw lines across'},
      action: (ctx, status) => {
          drawGuide(ctx, status.points['A'], { x: status.canvasInfo.margin, y: status.points['A'].y });
          drawGuide(ctx, status.points['B'], { x: status.canvasInfo.margin, y: status.points['B'].y });
          return status;
      }
  },
  {
      description: (status) => {return `B to D is 1/12 breast ${formatMeasureDiv(status.measurements.breast, 12, "(")}`},
      action: (ctx, status) => {
          const breast = parseFloat(status.measurements.breast.value);
          const pointB = status.points['B'];
          status.points['D'] = definePoint(status, pointB, { x: -1, y: 0 }, breast / 12);
          drawPoint(ctx, 'D', status.points['D']);
          return status;
      }
  },
  {
      description: (_status) => {return 'Draw back line from 1 to D'},
      action: (ctx, status) => {
          drawLine(ctx, status.points['1'], status.points['D']);
          return status;
      }
  },
  {
      description: (_status) => {return 'Point A1 is where the line 1-D crosses line extending left from A'},
      action: (ctx, status) => {
        status.points['A1'] = findIntersectionPoint(status.points['1'], status.points['D'], status.points['A'], { x: status.canvasInfo.margin, y: status.points['A'].y });
          drawPoint(ctx, 'A1', status.points['A1']);
          return status;
      }
  },
  {
    description: (status) => {return `Point K is the blade measure ${formatMeasure(status.measurements.blade, "(")} left from A1`},
    action: (ctx, status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointA1 = status.points['A1'];
        drawPoint(ctx, 'K', status.points['K'] = definePoint(status, pointA1, { x: -1, y: 0 }, blade));
        return status;
    }
  },
  {
    description: (status) => {return `Point L is 3/8 of the blade measure ${formatMeasureMul(status.measurements.blade, 3/8, "(")} right of K`},
    action: (ctx, status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointK = status.points['K'];
        drawPoint(ctx, 'L', status.points['L'] = definePoint(status, pointK, { x: 1, y: 0 }, blade * 3/8));
        return status;
    }
  },
  {
    description: (_status) => {return `Draw guide lines up and down from both K and L`},
    action: (ctx, status) => {
      drawGuide(ctx, { x: status.points['K'].x, y: status.canvasInfo.size.y - status.canvasInfo.margin }, { x: status.points['K'].x, y: status.canvasInfo.margin });
      drawGuide(ctx, { x: status.points['L'].x, y: status.canvasInfo.size.y - status.canvasInfo.margin }, { x: status.points['L'].x, y: status.canvasInfo.margin });
      return status;
    }
  },
  {
    description: (_status) => {return 'Where the line down from K crosses the line left from B is point J'},
    action: (ctx, status) => {
      const pointK = status.points['K'];
      const pointB = status.points['B'];\
      status.points['J'] = findIntersectionPointofGuides(status, pointK, dir("d"), pointB, dir("l"));
      drawPoint(ctx, 'J', status.points['J']);
      return status;
    }
  },
  {
    
  }
];

export default { design_info, measurements, steps };
