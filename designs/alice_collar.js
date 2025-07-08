import {
  inchesToPrecision,
  toInches,
  registerPoints,
  registerPoint,
  registerLabels,
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
  title: 'Alice - Collar',
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
  },
  // Lining is done, now for the outer collar
  {
    description: (_status) => { return 'Now for the outer collar.'; },
    action: (status) => {

      let collarWidth = inchesToPrecision(status, status.measurements.collarWidth.value);
      const distDown0 = (collarWidth * 7.5 ) + inchesToPrecision(status, 1)
      let pointL0 = status.pattern.points['L0'];

      let point0 =  setPoint(pointL0.x, pointL0.y + distDown0);

      status = registerPoint(status, point0, '0');
      return status;
    }
  },
  {
    description: (status) => { return `Point G is 1/3 the neck size ${printMeasure(status.measurements.neckSize, 1 / 3)} left of 0`; },
    action: (status) => {
      let thirdNeckSize = inchesToPrecision(status, status.measurements.neckSize.value / 3);

      let point0 = status.pattern.points['0'];
      let pointG = setPoint(point0.x - thirdNeckSize, point0.y);
      status = registerPoint(status, pointG, 'G');
      return status;
    }
  },
  {
    description: (status) => { return `Point H is 1.7 x collar width ${printNum(status.measurements.collarWidth.value * 1.7)} above point G`;},
    action: (status) => {
      let collarWidth = inchesToPrecision(status, status.measurements.collarWidth.value);
      // 1.7 * collar width = 1.7 * 1.25 = 2.125 inches
      let heightH = collarWidth * 1.7;
      let pointG = status.pattern.points['G'];
      let pointH = setPoint(pointG.x, pointG.y - heightH);
      status = registerPoint(status, pointH, 'H');
      return status;
    }
  },
  {
    description: (status) => { return `Point I is (neck size / 2pi) x 1.18 ${printNum((status.measurements.neckSize.value / (2 * Math.PI)) * 1.18)} up from point H, and 3/8 left of H`; },
    action: (status) => {
      let neckSize = inchesToPrecision(status, status.measurements.neckSize.value);
      let radius = neckSize / (2 * Math.PI);
      let heightI = radius * 1.18;
      // neck size is 12 inches. The radius of the neck is 12 / (2 * Math.PI) = 1.90986 inches.
      // The height of point I is 1.18 * radius = 1.18 * 1.90986 = 2.25 inches.
      let pointH = status.pattern.points['H'];
      let pointI = setPoint(pointH.x - inchesToPrecision(status, 3/8), pointH.y - heightI);
      status = registerPoint(status, pointI, 'I');
      // draw dashed line from point I to point H
      status = setLine(status, 'H', 'I', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return `Arc around point I with radius of (neck size / 2pi) * 1.18 from Point H, counter-clockwise 108 degrees to find J. At 168 degrees, find K.`;},
    action: (status) => {
      let neckSize = inchesToPrecision(status, status.measurements.neckSize.value);
      let pointH = status.pattern.points['H'];
      let pointI = status.pattern.points['I'];

      // the radius is the distance from the H to I
      let radius = distPointToPoint(pointH, pointI);
      let radiusInches = toInches(radius);

      // Find point J, which is 154 degrees clockwise from point H around point I
      //Point H is below and slightly to the left of point I.
      //Point J is 154 degrees clockwise from point H around point I.

      let angleH = Math.atan2(pointH.y - pointI.y, pointI.x - pointH.x);
      let angleJ = angleH + (108 * Math.PI / 180); // Convert degrees to radians
      let angleK = angleH + (168 * Math.PI / 180); // 180 degrees from H

      // Calculate the coordinates of point J
      let pointJ = setPoint(
        pointI.x - radius * Math.cos(angleJ),
        pointI.y + radius * Math.sin(angleJ)
      );
      status = registerPoint(status, pointJ, 'J');

      // Calculate the coordinates of point K
      let pointK = setPoint(
        pointI.x - radius * Math.cos(angleK),
        pointI.y + radius * Math.sin(angleK)
      );
      status = registerPoint(status, pointK, 'K');

      // Draw the arc from H to J
      status = setCurve(status, {s: 'J', e: 'H', c: 'I'});

      // Draw dashed lines from J and K to the center point I
      status = setLine(status, 'I', 'J', 'dashed');
      status = setLine(status, 'I', 'K', 'dashed');

      // Make Labels
      let defaultDirection = 'right';
      let defaultSize = 14;

      let pointC = status.pattern.points['C'];
      let pointG = status.pattern.points['G'];
      let liningLabelPoint = setPoint(pointC.x + 5, pointC.y - 2);
      let outerLabelPoint = setPoint(pointG.x - 15, pointG.y - 6);


      let parts = {
        'lining': {
          point: liningLabelPoint,
          direction: defaultDirection,
          size: defaultSize,
        },
        'outer': {
          point: outerLabelPoint,
          direction: defaultDirection,
          size: defaultSize,
        }
      }

      status = registerLabels(status, parts);
      return status;
    }
  },
  {
    description: (_status) => { return 'L is right of point I, where it meets the line up from 0'; },
    action: (status) => {
      let pointI = status.pattern.points['I'];
      let point0 = status.pattern.points['0'];

      // Find the intersection of the line from point I to point 0
      // and the line from point I to point L
      let pointL = setPoint(point0.x, pointI.y);
      status = registerPoint(status, pointL, 'L');

      return status;
    }
  },
  {
    description: (_status) => { return 'Using the distance from point L to point I, swing around I counter-clockwise 19 degrees to find point M.'; },
    action: (status) => {
      let pointI = status.pattern.points['I'];
      let pointL = status.pattern.points['L'];

      // Calculate the distance from L to I
      let distanceLI = distPointToPoint(pointL, pointI);

      // Calculate the angle for point M
      let angleM = Math.atan2(pointL.y - pointI.y, pointL.x - pointI.x) - (19 * Math.PI / 180);

      // Calculate the coordinates of point M
      let pointM = setPoint(
        pointI.x + distanceLI * Math.cos(angleM),
        pointI.y + distanceLI * Math.sin(angleM)
      );
      status = registerPoint(status, pointM, 'M');

      // draw solid line from J to M
      status = setLine(status, 'J', 'M', 'solid');

      return status;
    }
  },
  {
    description: (status) => { return `From the line from I to H, swing around I counter-clockwise 37 degrees to find point N at (necksize x 1.18) / 2pi + (1.7 x collar width) + 3/8`; },
    action: (status) => {
      let pointI = status.pattern.points['I'];
      let pointH = status.pattern.points['H'];
      let neckSize = status.measurements['neckSize'];
      let collarWidth = status.measurements['collarWidth'];
      let distINInches = (neckSize.value * 1.18) / (2 * Math.PI) + (1.7 * collarWidth.value) + 3/8;
      let distIN = inchesToPrecision(status, distINInches);


      // Calculate the angle for point H
      let angleH = Math.atan2(pointH.y - pointI.y, pointI.x - pointH.x);

      // Calculate the angle for point N
      let angleN = angleH + (37 * Math.PI / 180);

      // Calculate the coordinates of point N
      let pointN = setPoint(
        pointI.x - distIN * Math.cos(angleN),
        pointI.y + distIN * Math.sin(angleN)
      );
      status = registerPoint(status, pointN, 'N');

      // draw quadratic curve from point L to N to G
      status = setCurve(status, {s: 'G', g1: 'N', g2: 'L', e: 'M'}, [0.35, 0.82]);

      return status;
    }
  }
];

export const alice_collar = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}
