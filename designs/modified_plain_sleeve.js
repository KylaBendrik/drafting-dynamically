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
  title: 'Keystone (modified) - Plain Sleeve',
  source: {
    link: 'https://archive.org/details/keystonejacketdr00heck/page/56/mode/2up',
    label: 'The Keystone Jacket and Dress Cutter (pg 56)'
  },
  designer: 'Charles Hecklinger (Edited by Kyla Bendrik)',
}

let measurements = {
  width_armhole: { label: "Armhole", value: 16 },
  length_underarm: { label: "Length of sleeve under arm", value: 16.5 },
  width_elbow: { label: "Width at elbow", value: 12 },
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

      status = registerPoint(status, pointA, 'A');
      return status;
    }
  },
  {
    description: (status) => { return `O to J is 1/2 armhole, ${printNum(status.measurements.width_armhole.value / 2)} left of O` },
    action: (status) => {
      let armhole = inchesToPrecision(status, status.design.measurements.width_armhole.value);
      let pointO = status.pattern.points['O'];
      let pointJ = setPoint(pointO.x - armhole / 2, pointO.y, { d: true });

      status = registerPoint(status, pointJ, 'J');

      return status;
    }
  },
  {
    description: (status) => { return `Point G is at the same height as A, below J`},
    action: (status) => {
      let pointA = status.pattern.points['A'];
      let pointJ = status.pattern.points['J'];
      let pointG = setPoint(pointJ.x, pointA.y,);

      status = registerPoint(status, pointG, 'G');
      return status;
    }
  },
  {
    description: (status) => { return `Point H is in the middle between O and J` },
    action: (status) => {
      let pointO = status.pattern.points['O'];
      let pointJ = status.pattern.points['J'];
      let pointH = setPoint((pointO.x + pointJ.x) / 2, pointO.y);

      status = registerPoint(status, pointH, 'H');
      return status;
    }
  },
  {
    description: (status) => { return `Point I is halfway between H and J` },
    action: (status) => {
      let pointH = status.pattern.points['H'];
      let pointJ = status.pattern.points['J'];
      let pointI = setPoint((pointH.x + pointJ.x) / 2, pointH.y, { d: true });

      status = registerPoint(status, pointI, 'I');
      return status;
    }
  },
  {
    description: (status) => { return `Point K is 1/4 armhole ${printNum(status.measurements.width_armhole.value / 4)} up from G` },
    action: (status) => {
      let armhole = inchesToPrecision(status, status.design.measurements.width_armhole.value);
      let pointG = status.pattern.points['G'];
      let pointK = setPoint(pointG.x, pointG.y - armhole / 4, { r: true });

      status = registerPoint(status, pointK, 'K');
      return status;
    }
  },
  {
    description: (_status) => { return `Point P is the third point in an equilateral triangle with points K and H.` },
    action: (status) => {
      let pointK = status.pattern.points['K'];
      let pointH = status.pattern.points['H'];

      // Calculate the third point of the equilateral triangle
      let pointP = setEquilateralThirdPoint(status, pointK, pointH);

      // Point S is right of P, the same distance as K to H
      let distKtoH = distPointToPoint(pointK, pointH);
      let pointS = setPoint(pointP.x + distKtoH, pointP.y);
      //Point S2 is 6 degrees counterclockwise from S, around point P



      // Register point S
      status = registerPoints(status, { 'P': pointP, 'S': pointS });
      status = setCurve(status, { start: 'K', center: 'P', end: 'S' });

      return status;
    }
  },
  {
    description: (status) => { return `Point R is 1/2 inch up from A` },
    action: (status) => {
      let pointA = status.pattern.points['A'];
      let pointR = setPoint(pointA.x, pointA.y - inchesToPrecision(status, 0.5));

      status = registerPoint(status, pointR, 'R');
      //draw curve from R to S, quarter 3, make touch point
      let pointS = status.pattern.points['S'];
      let pointP = status.pattern.points['P'];

      let radius = distPointToPoint(pointS, pointP);

      //angle from S to S2
      let angleDegrees = 6;
      let angleRadians = (angleDegrees * Math.PI) / 180;
      let newX = pointP.x + radius * Math.cos(angleRadians);
      let newY = pointP.y - radius * Math.sin(angleRadians);
      //pointSR is the new point, 6 degrees counterclockwise from S
      let pointS2 = setPoint(newX, newY, {}, false);

      let pointSR = makeTouchPoint(status, pointS2, pointR, 3, 0.25, false);


      status = registerPoints(status, { 'S2': pointS2, 'SR': pointSR });
      status = setCurve(status, { start: 'R', g: 'SR', end: 'S2' });
      return status;
    }
  },
  {
    description: (_status) => { return `N is right of K, and below I, and L is 2 inches left of A` },
    action: (status) => {
      let pointK = status.pattern.points['K'];
      let pointI = status.pattern.points['I'];
      let pointA = status.pattern.points['A'];

      let pointN = setPoint(pointI.x, pointK.y);
      let pointL = setPoint(pointA.x - inchesToPrecision(status, 2), pointA.y);
      status = registerPoints(status, { 'N': pointN, 'L': pointL });
      return status;
    }
  },
  {
    description: (status) => { return `Shape the under-arm scye from R to the line at L and up to N, curving above and below a straight line from N to L` },
    action: (status) => {
      let pointN = status.pattern.points['N'];
      let pointL = status.pattern.points['L'];

      //set the line from N to L
      status = setLine(status, 'N', 'L', 'dashed');
      //set the curve from R to L
      status = setCurve(status, { start: 'R', end: 'L' }, 2);
      //set the curve from L to N
      let midX = (pointN.x + pointL.x) / 2;
      let midY = (pointN.y + pointL.y) / 2;

      //find g1x, g1y, g2x, g2y
      let g1x = (pointN.x + midX) / 2;
      let g1y = (pointN.y + midY) / 2;
      let g2x = (pointL.x + midX) / 2;
      let g2y = (pointL.y + midY) / 2;

      //amplitude
      let amp = 1;

      let pointNLg1 = setPoint(g1x + amp, g1y - amp, {}, false);
      let pointNLg2 = setPoint(g2x - amp, g2y + amp, {}, false);

      status = registerPoints(status, { 'NLg1': pointNLg1, 'NLg2': pointNLg2 });
      status = setCurve(status, { start: 'N', g1: 'NLg1', g2: 'NLg2', end: 'L' }, [0.25, 0.75]);
      return status;
    }
  },
  {
    description: (status) => { return `Point T is 1/2 elbow right of G` },
    action: (status) => {
      let pointG = status.pattern.points['G'];
      let elbow = inchesToPrecision(status, status.design.measurements.width_elbow.value);
      let pointT = setPoint(pointG.x + elbow / 2, pointG.y, { d: true });

      status = registerPoint(status, pointT, 'T');
      return status;
    }
  },
  {
    description: (status) => { return `Sweep 1/2 sleeve length, starting at A, to find M along the line down from T`},
    action: (status) => {
      let pointA = status.pattern.points['A'];
      let pointT = status.pattern.points['T'];

      let halfSleeve = inchesToPrecision(status, status.design.measurements.length_underarm.value / 2);
      let lengthAT = distPointToPoint(pointA, pointT);
      let distm = Math.sqrt(halfSleeve * halfSleeve - lengthAT * lengthAT);
      let pointM = setPoint(pointT.x, pointT.y + distm);
      status = registerPoint(status, pointM, 'M');
      //draw a line from A to M
      status = setLine(status, 'A', 'M', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return `Point F is below G, left of M` },
    action: (status) => {
      let pointG = status.pattern.points['G'];
      let pointM = status.pattern.points['M'];

      let pointF = setPoint(pointG.x, pointM.y);
      status = registerPoint(status, pointF, 'F');
      //draw a line from F to M
      status = setLine(status, 'F', 'M', 'dashed');
      return status;
    } 
  },
  {
    description: (status) => { return `Point F2 is 1/2 inch left of F, point Q is 1/2 inch right of F` },
    action: (status) => {
      let pointF = status.pattern.points['F'];
      let pointF2 = setPoint(pointF.x - inchesToPrecision(status, 0.5), pointF.y);
      let pointQ = setPoint(pointF.x + inchesToPrecision(status, 0.5), pointF.y);

      status = registerPoints(status, { 'F2': pointF2, 'Q': pointQ });
      return status;
    }
  },
  {
    description: (status) => { return `Point B is below A, at the height of M. Point C is the same distance below B as B is below A` },
    action: (status) => {
      let pointA = status.pattern.points['A'];
      let pointM = status.pattern.points['M'];

      let pointB = setPoint(pointA.x, pointM.y);
      let pointC = setPoint(pointB.x, pointB.y + distPointToPoint(pointB, pointA));

      status = registerPoints(status, { 'B': pointB, 'C': pointC });
      //draw a line from M to C
      status = setLine(status, 'M', 'C', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return `Point D is below C 1 and 3/4 in` },
    action: (status) => {
      let pointC = status.pattern.points['C'];
      let pointD = setPoint(pointC.x, pointC.y + inchesToPrecision(status, 1.75), { l: true });

      status = registerPoint(status, pointD, 'D');
      //draw a line from C to D
      status = setLine(status, 'C', 'D', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return `Find Points E and 9 by taking the wrist measurement, dividing it by 2, add 1/4" to this (for E) and subtract 1/4" from this (for 9). Measure from C down to somewhere along the line left of D.` },
    action: (status) => {
      let wrist = inchesToPrecision(status, status.design.measurements.width_wrist.value);
      let halfWrist = wrist / 2;
      let pointC = status.pattern.points['C'];
      let pointD = status.pattern.points['D'];

      let distCE = halfWrist + inchesToPrecision(status, 0.25);
      let distC9 = halfWrist - inchesToPrecision(status, 0.25);

      let distCD = distPointToPoint(pointC, pointD);

      let distED = Math.sqrt(distCE * distCE - distCD * distCD);
      let dist9D = Math.sqrt(distC9 * distC9 - distCD * distCD);

      let pointE = setPoint(pointD.x - distED, pointD.y);
      let point9 = setPoint(pointD.x - dist9D, pointD.y);

      status = registerPoints(status, { 'E': pointE, '9': point9 });

      
      //draw a line from C to E and from C to 9
      status = setLine(status, 'C', 'E', 'dashed');
      status = setLine(status, 'C', '9', 'dashed');

      //make the two curves from C to E and C to 9
      let pointC9 = makeTouchPoint(status, pointC, point9, 4, 0.15, {}, false);
      let pointCE = makeTouchPoint(status, pointC, pointE, 4, 0.15, {}, false);

      status = registerPoints(status, { 'C9': pointC9, 'CE': pointCE });
      status = setCurve(status, { start: 'C', g: 'C9', end: '9' });
      status = setCurve(status, { start: 'C', g: 'CE', end: 'E' });
      return status;
    }
  },
  {
    description: (status) => { return `Shape the seams K-G-F2-E, N-1-Q-9, and R-A-M-C` },
    action: (status) => {
      //add in point 1, beneath N and to the right of G
      console.log(status.pattern.points);
      let pointN = status.pattern.points['N'];
      let pointG = status.pattern.points['G'];

      let point1 = setPoint(pointN.x, pointG.y);
      status = registerPoint(status, point1, '1');
      //set the curves
      status = setCurve(status, { s: 'K', g1: 'G', g2: 'F2', e: 'E' }, [0.18, 0.58]);
      status = setCurve(status, { s: 'N', g1: '1', g2: 'Q', e: '9' }, [0.16, 0.65]);
      status = setCurve(status, { s: 'A', g: 'M', e: 'C' });

      //set line from R to A
      status = setLine(status, 'R', 'A');

      return status;
    }
  }
]

export const modified_plain_sleeve = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}