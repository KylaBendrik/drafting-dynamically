import {
    inchesToPrecision,
    registerPoints,
    registerPoint,
    setPoint,
    setLine,
    setPointLineY,
    setPointLineX,
    setPointAlongLine,
    setPointLineCircle,
    setPointLineLine,
    makeTouchPoint,
    setCurve,
    distPointToPoint,
    distABC,
    printNum,
    printMeasure,
    perimeterEllipse
  } from '../pattern.js';
  
  const design_info = {
    title: 'Keystone - Plain Sleeve',
    source: {
      link: 'https://archive.org/details/keystonejacketdr00heck/page/56/mode/2up',
      label: 'The Keystone Jacket and Dress Cutter (pg 56)'
    },
    designer: 'Charles Hecklinger'
  }
  
  let measurements = {
    width_armhole: { label: "Armhole", value: 16 },
    length_underarm: { label: "Length of sleeve under arm", value: 16.5 },
    width_wrist: { label: "width at elbow", value: 12 },
    width_wrist: { label: "Width at wrist", value: 10 },
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
      description: (status) => { return `Point A is 1/3 armhole, ${printNum(status.measurements.width_armhole.value / 3)} down from O` },
      action: (status) => {
        let armhole = inchesToPrecision(status, status.design.measurements.width_armhole.value);
        let pointO = status.pattern.points['O'];
        let pointA = setPoint(pointO.x, pointO.y + armhole / 3, { l: true });
        console.log('defining point A', pointA);
        console.log(status.pattern.points);

        status = registerPoint(status, pointA, 'A');
        return status;
      }
    },
    {
      description: (status) => { return `O to J is 1/2 armhole, ${printNum(status.measurements.width_armhole.value / 2)} left of O` },
      action: (status) => {
        let armhole = inchesToPrecision(status, status.design.measurements.width_armhole.value);
        let pointO = status.pattern.points['O'];
        let pointJ = setPoint(pointO.x - armhole / 2, pointO.y, { l: true });

        status = registerPoint(status, pointJ, 'J');

        return status;
      }
    },
    {
      description: (status) => { return `A down to C is the length of sleeve under arm, ${printNum(status.measurements.length_underarm.value)} down from A` },
      action: (status) => {
        let lengthUnderarm = inchesToPrecision(status, status.design.measurements.length_underarm.value);
        let pointA = status.pattern.points['A'];
        console.log('pointA', pointA);
        let pointC = setPoint(pointA.x, pointA.y + lengthUnderarm, { l: true });

        status = registerPoint(status, pointC, 'C');
        return status;
      }
    },
    {
      description: (_status) => { return `B is in the middle of A and C` },
      action: (status) => {
        let pointA = status.pattern.points['A'];
        let pointC = status.pattern.points['C'];
        let pointB = setPoint(pointA.x, (pointA.y + pointC.y) / 2, { l: true });

        status = registerPoint(status, pointB, 'B');
        return status;
      }
    },
    {
      description: (status) => { return `Point D is left of C 1/2 wrist size + 1/2 inch, ${printNum(status.measurements.width_wrist.value / 2 + 0.5)}` },
      action: (status) => {
        let wrist = inchesToPrecision(status, status.design.measurements.width_wrist.value);
        let pointC = status.pattern.points['C'];
        let pointD = setPoint(pointC.x - (wrist / 2 + 0.5), pointC.y, { d: true });

        status = registerPoint(status, pointD, 'D');
        return status;
      }
    },
    {
      description: (_status) => { return `E is 1 3/4 inches down from D` },
      action: (status) => {
        let pointD = status.pattern.points['D'];
        let pointE = setPoint(pointD.x, pointD.y + inchesToPrecision(status, 1.75));

        status = registerPoint(status, pointE, 'E');
        return status;
      }
    },
    {
      description: (_status) => { return `Point F is left of B and G is left of A, both where the lines left cross the line down from J` },
      action: (status) => {
        let pointA = status.pattern.points['A'];
        let pointB = status.pattern.points['B'];
        let pointJ = status.pattern.points['J'];

        let pointF = setPoint(pointJ.x, pointB.y);
        let pointG = setPoint(pointJ.x, pointA.y);

        status = registerPoints(status, {'F': pointF, 'G': pointG});
        // status.pattern.points['F'] = pointF;
        // status.pattern.points['G'] = pointG;

        return status;
      }
    }
]

export const keystone_plain_sleeve = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}