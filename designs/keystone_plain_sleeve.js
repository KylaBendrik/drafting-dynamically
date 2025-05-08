import {
    inchesToPrecision,
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

        status.pattern.points['A'] = pointA;
        return status;
      }
    }
]


export const keystone_plain_sleeve = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}