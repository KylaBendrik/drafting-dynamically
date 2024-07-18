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
} from '../drafting_tools.js';

const design_info = {
  title: 'Keystone - Single Breasted Vest',
  source: {
    link: 'https://archive.org/details/keystonejacketdr00heck/page/66/mode/2up',
    label: 'The Keystone Jacket and Dress Cutter'
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
  'O', '1', 'A', 'B', 'D'
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
  // {
  //     description: (_status) => {return 'From points A and B, draw lines across'},
  //     action: (ctx, status) => {
  //         drawGuide(ctx, points['A'], { x: margin, y: points['A'].y });
  //         drawGuide(ctx, points['B'], { x: margin, y: points['B'].y });
  //         return status;
  //     }
  // },
  // {
  //     description: (status) => {return `B to D is 1/12 breast ${formatMeasureDiv(status.measurements.breast, 12, "(")}`},
  //     action: (ctx, status) => {
  //         const breast = parseFloat(status.measurements.breast.value);
  //         const pointB = points['B'];
  //         points['D'] = definePoint(status, pointB, { x: -1, y: 0 }, breast / 12);
  //         drawPoint(ctx, 'D', points['D']);
  //         return status;
  //     }
  // },
  // {
  //     description: (_status) => {return 'Draw back line from 1 to D'},
  //     action: (ctx, status) => {
  //         drawLine(ctx, points['1'], points['D']);
  //         return status;
  //     }
  // },
  // {
  //     description: (_status) => {return 'Point A1 is where the line 1-D crosses line extending left from A'},
  //     action: (ctx, status) => {
  //         points['A1'] = findIntersectionPoint(points['1'], points['D'], points['A'], { x: margin, y: points['A'].y });
  //         drawPoint(ctx, 'A1', points['A1']);
  //         return status;
  //     }
  // },
];

export default { design_info, measurements, steps };
