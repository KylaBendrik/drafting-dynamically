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
  setEquilateralThirdPoint,
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
  title: 'Alice - Collar pieces',
  source: {
    link: 'https://www.youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y',
    label: 'The Alice Dress - Video Series',
  },
  designer: 'Kyla Bendrik'
}

let measurements = {
  neckSize: { label: "Neck Size", value: 12, step: 0.5 },
  collarWidth: { label: "Collar Height", value: 1.25, step: 0.25},
};

const steps = [
  { description: (_status) => { return 'Starting with the collar lining.'; },
    action: (status) => {
      let pointL0 = setPoint(0, 0, { u: true, l: true });
      status = registerPoint(status, pointL0, 'L0');
      return status;
    }
  },
  { description: (status) => { return `Point 1 is half the neck size ${printMeasure(status.measurements.neckSize, 1 / 2)} left of 0`; },
    action: (status) => {
      let halfNeckSize = inchesToPrecision(status, status.measurements.neckSize.value / 2);

      let pointL0 = status.pattern.points['L0'];
      let point1 = setPoint(pointL0.x - halfNeckSize, pointL0.y);
      status = registerPoint(status, point1, '1');
      return status;
    }
  },
  {
    description: (status) => { return `Point 2 is collar width + 1/2" above point 0, which is ${printMeasure(status.measurements.collarWidth)} + 1/2"`; },
    action: (status) => {
      let collarWidth = inchesToPrecision(status, status.measurements.collarWidth.value + 0.5);
      let pointL0 = status.pattern.points['L0'];
      let point2 = setPoint(pointL0.x, pointL0.y - collarWidth);
      status = registerPoint(status, point2, '2');
      return status;
    }
  },
  {
    description: (status) => { return `Point 3 is above point 1, to the left of point 2`; },
    action: (status) => {
      let point1 = status.pattern.points['1'];
      let point2 = status.pattern.points['2'];
      let point3 = setPoint(point1.x, point2.y);
      status = registerPoint(status, point3, '3');
      return status;
    }
  },
  {
    description: (_status) => { return `Point A is 1/8" above point 0`; },
    action: (status) => {
      let pointL0 = status.pattern.points['L0'];
      let pointA = setPoint(pointL0.x, pointL0.y - inchesToPrecision(status, 0.125));
      status = registerPoint(status, pointA, 'A');
      return status;
    }
  },
  {
    description: (status) => { return `Point B is 3/8" down from point 2`; },
    action: (status) => {
      let point2 = status.pattern.points['2'];
      let pointB = setPoint(point2.x, point2.y + inchesToPrecision(status, 0.375));
      status = registerPoint(status, pointB, 'B');
      return status;
    }
  },
  {
    description: (status) => { return `Point C is 1/4" up from point 1`; },
    action: (status) => {
      let point1 = status.pattern.points['1'];
      let pointC = setPoint(point1.x, point1.y - inchesToPrecision(status, 0.25));
      status = registerPoint(status, pointC, 'C');
      return status;
    }
  },
  {
    description: (status) => { return `Point D is 1/4" right of point 3`; },
    action: (status) => {
      let point3 = status.pattern.points['3'];
      let pointD = setPoint(point3.x + inchesToPrecision(status, 0.25), point3.y);
      status = registerPoint(status, pointD, 'D');
      return status;
    }
  },
  {
    description: (status) => { return `Point E is 1/4 of the neck size left of point B`; },
    action: (status) => {
      let quarterNeckSize = inchesToPrecision(status, status.measurements.neckSize.value / 4);
      let pointB = status.pattern.points['B'];
      let pointE = setPoint(pointB.x - quarterNeckSize, pointB.y);
      status = registerPoint(status, pointE, 'E');
      return status;
    }
  },
  {
    description: (status) => { return `Point F is 1/4 of the neck size + 1/4" left of point 0, at the lowest point of the collar`; },
    action: (status) => {
      let quarterNeckSize = inchesToPrecision(status, (status.measurements.neckSize.value / 4) + 0.25);
      let pointL0 = status.pattern.points['L0'];
      let pointF = setPoint(pointL0.x - quarterNeckSize, pointL0.y);
      status = registerPoint(status, pointF, 'F');
      return status;
    }
  },
  {
    description: (status) => { return `Draw the lines and curves to complete the collar. A to B is the center back. You will need to move things around to place the opening at the shoulder.`; },
    action: (status) => {
      let pointA = status.pattern.points['A'];
      let pointB = status.pattern.points['B'];
      let pointC = status.pattern.points['C'];
      let pointD = status.pattern.points['D'];
      let pointE = status.pattern.points['E'];
      let pointF = status.pattern.points['F'];

      // Draw the lines
      status = setLine(status, 'A', 'B');
      status = setLine(status, 'C', 'D');

      // Draw the curves
      status = setCurve(status, {s:'A', e: 'C', g: 'F'});
      status = setCurve(status, {s:'B', e: 'D', g: 'E'});

      return status;
    }
  }
];

export const alice_collar = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}
