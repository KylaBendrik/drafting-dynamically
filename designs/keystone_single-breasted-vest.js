import {
  inchesToPrecision,
  setPoint,
  setLine,
  setPointLineY,
  setCurve,
  printMeasure
} from '../pattern.js';

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
  shoulder: {label: "Desired Shoulder Width", value: 3},
  neckline: {label: "Neckline", value: 10}
};

//all distances are in inches * precision
// starting point (in this case 'O') is always 0,0. All other points are defined in relation to this point. Negatives are expected

const steps = [
  {
      description: (_status) => {return 'Set point O in upper right of canvas'},
      action: (status) => {
          status.pattern.points['O'] = setPoint(0, 0,{ d: true, l: true });
          return status;
      }
  },
  {
      description: (_status) => {return 'Point 1 is 3/4 inch down from O'},
      action: (status) => {
          status.pattern.points['1'] = setPoint(0, inchesToPrecision(status, 3/4));
          return status;
      }
  },
  {
      description: (status) => {return `From point 1, go down the back length ${printMeasure(status.design.measurements.backLength)} to define point B`},
      action: (status) => {
          status.pattern.points['B'] = setPoint(0, inchesToPrecision(status, parseFloat(status.design.measurements.backLength.value)), { l: true });
          return status;
      }
  },
  {
      description: (status) => {return `From point B, go up the height under arm ${printMeasure(status.measurements.heightUnderArm)} to define point A`},
      action: (status) => {
          let pointB = status.pattern.points['B'];
          status.pattern.points['A'] = setPoint(0, pointB.y - inchesToPrecision(status, parseFloat(status.measurements.heightUnderArm.value)), { l: true });
          return status;
      }
  },
  {
      description: (status) => {return `B to D is 1/12 breast ${printMeasure(status.measurements.breast, 1/12)} to the left of B`},
      action: (status) => {
          let pointB = status.pattern.points['B'];
          status.pattern.points['D'] = setPoint(pointB.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 12), pointB.y);
          return status;
      }
  },
  {
      description: (_status) => {return 'Draw back line from 1 to D'},
      action: (status) => {
          status = setLine(status, '1', 'D');
          return status;
      }
  },
  {
      description: (_status) => {return 'Point A1 is where the line 1-D crosses line extending left from A'},
      action: (status) => {
          let point1 = status.pattern.points['1'];
          let pointA = status.pattern.points['A'];
          let pointD = status.pattern.points['D'];
          status.pattern.points['A1'] = setPointLineY(status, point1, pointD, pointA.y);
          return status;
      }
  },
  {
    description: (status) => {return `Point K is the blade measure ${printMeasure(status.measurements.blade)} left from A1`},
    action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointA1 = status.pattern.points['A1'];
        status.pattern.points['K'] = setPoint(pointA1.x - inchesToPrecision(status, blade), pointA1.y, {u: true, d: true});
        return status;
    }
  },
  {
    description: (status) => {return `Point L is 3/8 of the blade measure ${printMeasure(status.measurements.blade, 3/8)} right of K`},
    action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointK = status.pattern.points['K'];
        status.pattern.points['L'] = setPoint(pointK.x + inchesToPrecision(status, blade * 3/8), pointK.y, {u: true, d: true});
        return status;
    }
  },
  {
    description: (_status) => {return `Point J is at the intersection of the line down from K and the line left from B`},
    action: (status) => {
        const pointK = status.pattern.points['K'];
        const pointB = status.pattern.points['B'];
        status.pattern.points['J'] = setPoint(pointK.x, pointB.y);
        return status;
    }
  },
  {
    description: (status) => {return `Point 2 is 3/16 of the blade measure ${printMeasure(status.measurements.blade, 3/16)} left from O`},
    action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        status.pattern.points['2'] = setPoint(0 - inchesToPrecision(status, blade * 3/16), 0);
        //draw curve from 2 to 1, centered around O
        console.log(status)
        status = setCurve(status, '1', '2', 3);
        return status;
    }
  },
  { 
    description: (_status) => {return `Point G is 1/2 the bust measure ${printMeasure(_status.measurements.breast, 1/2)} to the left of A1`},
    action: (status) => {
        const pointA1 = status.pattern.points['A1'];
        status.pattern.points['G'] = setPoint(pointA1.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 2), pointA1.y);
        return status;
    }
  }
];

export default { design_info, measurements, steps };
