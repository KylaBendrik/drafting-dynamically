import {
    inchesToPrecision,
    setPoint,
    setLine,
    setPointLineY,
    setPointLineX,
    setPointAlongLine,
    setPointLineCircle,
    setPointLineLine,
    setCurve,
    distPointToPoint,
    distABC,
    printNum,
    printMeasure,
    perimeterEllipse
  } from '../pattern.js';
  
  const design_info = {
    title: 'Keystone - Waist (Simple Bodice)',
    source: {
      link: 'https://archive.org/details/keystonejacketdr00heck/page/12/mode/2up',
      label: 'The Keystone Jacket and Dress Cutter (pg 12)'
    },
    designer: 'Charles Hecklinger'
  }
  
  let measurements = {
    backLength: { label: "Back Length", value: 15 },
    frontLength: { label: "Front Length", value: 18.25 },
    blade: { label: "Blade", value: 10 },
    heightUnderArm: { label: "Height Under Arm", value: 7.5 },
    breast: { label: "Breast", value: 36 },
    waist: { label: "Waist", value: 25 },
    lengthOfFront: { label: "Length of Front", value: 23 },
    shoulder: { label: "Desired Shoulder Change", value: 1, step: 0.25 },
    neckline: { label: "Neckline", value: 10 }
  };

  //all distances are in inches * precision
// starting point (in this case 'O') is always 0,0. All other points are defined in relation to this point. Negatives are expected

const steps = [
    {
      description: (_status) => { return 'Set point O in upper right of canvas' },
      action: (status) => {
        status.pattern.points['O'] = setPoint(0, 0, { d: true, l: true });
        return status;
      }
    },
    {
      description: (_status) => { return 'Point 1 is 3/4 inch down from O' },
      action: (status) => {
        status.pattern.points['1'] = setPoint(0, inchesToPrecision(status, 3 / 4));
        return status;
      }
    },
    {
      description: (status) => {return `From point 1, go down the back length ${printMeasure(status.design.measurements.backLength)} to define point B`},
      action: (status) => {
          let point1 = status.pattern.points['1'];
          let pointb_y = point1.y + inchesToPrecision(status, parseFloat(status.design.measurements.backLength.value));
          status.pattern.points['B'] = setPoint(0, pointb_y, { l: true });
          return status;
      }
    },
    {
      description: (status) => { return `From point B, go up the height under arm ${printMeasure(status.measurements.heightUnderArm)} to define point A` },
      action: (status) => {
          let pointB = status.pattern.points['B'];
          status.pattern.points['A'] = setPoint(0, pointB.y - inchesToPrecision(status, parseFloat(status.measurements.heightUnderArm.value)), { l: true });
          return status;
      }
    },
    {
      description: (status) => { return `B to C is 1/24 breast ${printMeasure(status.measurements.breast, 1 / 24)} to the left of B` },
      action: (status) => {
          let pointB = status.pattern.points['B'];
          status.pattern.points['C'] = setPoint(pointB.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 24), pointB.y);
          return status;
      }
    },
    {
      description: (_status) => { return 'Draw back line from 1 to C' },
      action: (status) => {
        status = setLine(status, '1', 'C');
        return status;
      }
    },
    {
      description: (_status) => { return 'Point A1 is where the line 1-C crosses line extending left from A' },
      action: (status) => {
        let point1 = status.pattern.points['1'];
        let pointA = status.pattern.points['A'];
        let pointC = status.pattern.points['C'];
        status.pattern.points['A1'] = setPointLineY(status, point1, pointC, pointA.y);
        return status;
      }
    },
    {
      description: (status) => {return `Point G is 1/2 breast measure ${printMeasure(status.measurements.breast, 1 / 2)} left from A1`},
      action: (status) => {
        let pointA1 = status.pattern.points['A1'];
        status.pattern.points['G'] = setPoint(pointA1.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 2), pointA1.y);
        return status;
      }
    }
]

export const keystone_bodice = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}