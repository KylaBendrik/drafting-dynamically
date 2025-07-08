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
  mirrorPoint,
  mirrorPoints,
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
    description: (status) => { return `Draw the lines and curves to complete the collar. A to B is the center back. Slice shoulder along EF`; },
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
      let heightH = radiusCW(status)
      let pointG = status.pattern.points['G'];
      let pointH = setPoint(pointG.x, pointG.y - heightH);
      status = registerPoint(status, pointH, 'H');
      return status;
    }
  },
  {
    description: (status) => { return `Point I is (neck size / 2pi) x 1.18 ${printNum((status.measurements.neckSize.value / (2 * Math.PI)) * 1.18)} up from point H, and 3/8 left of H`; },
    action: (status) => {
      let heightI = radiusNS(status);
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
      let pointH = status.pattern.points['H'];
      let pointI = status.pattern.points['I'];

      // the radius is the distance from the H to I
      let radius = distPointToPoint(pointH, pointI);

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
    description: (_status) => { return 'Measure the distance from H to I and the distance from H to G. Add these together, add 1/8 inch, and this is your measure. Go this distance right of I to find L.'; },
    action: (status) => {
      let pointI = status.pattern.points['I'];
      let dist = radiusNS(status) + radiusCW(status) + inchesToPrecision(status, 1/8);

      // Find the intersection of the line from point I to point 0
      // and the line from point I to point L
      let pointL = setPoint(pointI.x + dist, pointI.y);
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
      let distIN = radiusNS(status) + radiusCW(status) + inchesToPrecision(status, 3/8);


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
  },
  {
    description: (_status) => { return 'Mirror points I, J, M, L, and N using H and G as the line of symmetry to find point Im.'; },
    action: (status) => {
      let pointH = status.pattern.points['H'];
      let pointG = status.pattern.points['G'];

      status = mirrorPoints(status, ['I', 'J', 'L', 'M', 'N'], pointH, pointG);
      status = setLine(status, 'I', 'Im', 'dashed');

      // draw all the other lines and curves
      status = setLine(status, 'Jm', 'Im', 'dashed');
      status = setLine(status, 'Jm', 'Mm', 'dashed');

      status = setCurve(status, {s: 'H', e: 'Jm', c: 'Im'});
      status = setCurve(status, {s: 'G', g1: 'Nm', g2: 'Lm', e: 'Mm'}, [0.35, 0.82]);
      return status;
    }
  },
  {
    description: (_status) => { return 'Follow a line from Im through K to find point P, using distance of 2.1 x collar width.'; },
    action: (status) => {
      let pointIm = status.pattern.points['Im'];
      let pointK = status.pattern.points['K'];
      let collarWidth = inchesToPrecision(status, status.measurements.collarWidth.value);

      // Calculate the distance from Im to P
      let distanceIK = distPointToPoint(pointIm, pointK);
      let distanceIP = collarWidth * 2 + distanceIK;
      console.log(`Distance from Im to P: ${distanceIP}`);

      // Calculate the angle for point P
      let angleP = Math.atan2(pointK.y - pointIm.y, pointK.x - pointIm.x);

      // Calculate the coordinates of point P
      let pointP = setPoint(
        pointIm.x + distanceIP * Math.cos(angleP),
        pointIm.y + distanceIP * Math.sin(angleP)
      );
      status = registerPoint(status, pointP, 'P');

      // Draw a dashed line from Im to P
      status = setLine(status, 'Im', 'P', 'dashed');

      return status;
    }
  },
  {
    description: (_status) => { return 'Starting from the line K to Im, swing around Im counter-clockwise 56 degrees to find point Q, (1/8" less distance), and only 35 degrees to find point R (same distance as Im to K). 11 degrees around is point T'; },
    action: (status) => {
      let pointIm = status.pattern.points['Im'];
      let pointK = status.pattern.points['K'];
      let distImK = distPointToPoint(pointIm, pointK);

      let distQ = distImK - inchesToPrecision(status, 0.125);


      // Calculate the angle for point K
      let angleK = Math.atan2(pointK.y - pointIm.y, pointIm.x - pointK.x);

      // Calculate the angle for point Q
      let angleQ = angleK + (56 * Math.PI / 180);

      // Calculate the coordinates of point Q
      let pointQ = setPoint(
        pointIm.x - distQ * Math.cos(angleQ),
        pointIm.y + distQ * Math.sin(angleQ)
      );
      status = registerPoint(status, pointQ, 'Q');

      //calculate the angle for point R
      let angleR = angleK + (35 * Math.PI / 180);

      // Calculate the coordinates of point R
      let pointR = setPoint(
        pointIm.x - distQ * Math.cos(angleR),
        pointIm.y + distQ * Math.sin(angleR)
      );
      status = registerPoint(status, pointR, 'R');

      //calculate angle for point T
      let angleT = angleK + (11 * Math.PI / 180);
      // Calculate the coordinates of point T
      let pointT = setPoint(
        pointIm.x - distImK * Math.cos(angleT),
        pointIm.y + distImK * Math.sin(angleT)
      );
      status = registerPoint(status, pointT, 'T');


      // Draw a dashed line from Im to Q
      status = setLine(status, 'Im', 'Q', 'dashed');
      status = setLine(status, 'Lm', 'Q', 'dashed');

      return status;
    }
  },
  {
    description: (_status) => { return 'Point S is collar width x 1.7 + 1/8"  past point R, along the line from Im to R. Point U is collar width x 2 past point T.'; },
    action: (status) => {
      let pointIm = status.pattern.points['Im'];
      let pointR = status.pattern.points['R'];
      let pointT = status.pattern.points['T'];
      let collarWidth = inchesToPrecision(status, status.measurements.collarWidth.value);

      // Calculate the distance from Im to R
      let distanceIR = distPointToPoint(pointIm, pointR);
      let distanceIS = collarWidth * 1.7 + distanceIR + inchesToPrecision(status, 0.125);

      // Calculate the distance from Im to T
      let distanceIT = collarWidth * 2 + distPointToPoint(pointIm, pointT);

      // Calculate the angle for point S
      let angleS = Math.atan2(pointR.y - pointIm.y, pointR.x - pointIm.x);

      // Calculate the coordinates of point S
      let pointS = setPoint(
        pointIm.x + distanceIS * Math.cos(angleS),
        pointIm.y + distanceIS * Math.sin(angleS)
      );
      status = registerPoint(status, pointS, 'S');

      // Calculate the angle for point U
      let angleU = Math.atan2(pointT.y - pointIm.y, pointT.x - pointIm.x);
      // Calculate the coordinates of point U
      let pointU = setPoint(
        pointIm.x + distanceIT * Math.cos(angleU),
        pointIm.y + distanceIT * Math.sin(angleU)
      );
      status = registerPoint(status, pointU, 'U');

      // Draw a dashed line from Im to S
      status = setLine(status, 'Im', 'S', 'dashed');

      return status;
    }
  },
  {
    description: (_status) => { return 'mirror points S, R, Mm, Jm, Lm, and Q using Im to P as the line of symmetry to find points Sm, Rm, Mmm, Jmm, Lmm, and Qm. Double check curves by folding across symmetry lines'; },
    action: (status) => {
      let pointIm = status.pattern.points['Im'];
      let pointP = status.pattern.points['P'];

      // Mirror points S, R, Mm, Jm, Lm, and Q using Im to P as the line of symmetry
      status = mirrorPoints(status, ['S', 'R', 'T', 'U', 'Mm', 'Jm', 'Lm', 'Q'], pointIm, pointP);

      status = setCurve(status, {s: 'Mm', g1: 'S', g2: 'U', e: 'P'}, [0.3, 0.8]);
      status = setCurve(status, {s: 'Jm', g1: 'R', g2: 'T', e: 'K'}, [0.3, 0.8]);

      status = setCurve(status, {s: 'Lmm', g: 'Mmm', e: 'Sm'});
      status = setCurve(status, {s: 'Sm', g: 'Um', e: 'P'}, 0.55);

      //inner curves
      status = setCurve(status, {s: 'K', g: 'Tm', e: 'Rm'});
      status = setCurve(status, {s: 'Rm', g: 'Jmm', e: 'Qm'});

      status = setLine(status, 'Qm', 'Lmm');

      status = setLine(status, 'E', 'F', 'dashed');


      return status;
    }
  }

];

export const alice_collar = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}

function radiusCW(status){
  //to simplify several steps, this is 1.7 * collar width
  return inchesToPrecision(status, status.measurements.collarWidth.value * 1.7);
}

function radiusNS(status){
  //to simplify several steps, this is (neck size / 2pi) * 1.18
  return inchesToPrecision(status, (status.measurements.neckSize.value / (2 * Math.PI)) * 1.18);
}