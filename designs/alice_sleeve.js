import {
  inchesToPrecision,
  toInches,
  registerPoints,
  registerPoint,
  registerLabels,
  seeDist,
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
  title: 'Alice Sleeve',
  source: {
    link: 'https://youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y&si=ZT5c6spRpksh4s8v',
    label: 'The Alice Dress - Sleeve',
  },
  designer: 'Kyla Bendrik',
}

let measurements = {
  width_armhole: { label: "Armhole", value: 14.5 },
  length_underarm: { label: "Length of sleeve under arm", value: 16.5 },
  width_elbow: { label: "Width at elbow", value: 9.5 },
  width_wrist: { label: "Width at wrist", value: 7.5 },
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


      status = registerPoints(status, 
        { 
          'S2': pointS2, 
          'SR': pointSR 
        }
      );
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
    description: (status) => { return `Point F2 is 5/8 inch left of F, point Q is 5/8 inch right of F` },
    action: (status) => {
      let pointF = status.pattern.points['F'];
      let pointF2 = setPoint(pointF.x - inchesToPrecision(status, 0.625), pointF.y);
      let pointQ = setPoint(pointF.x + inchesToPrecision(status, 0.625), pointF.y);

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
    description: (status) => { return `Find Points E and 9 by taking the wrist measurement, dividing it by 2, add 5/8" to this (for E) and subtract 5/8" from this (for 9). Measure from C down to somewhere along the line left of D.` },
    action: (status) => {
      let wrist = inchesToPrecision(status, status.design.measurements.width_wrist.value);
      let halfWrist = wrist / 2;
      let pointC = status.pattern.points['C'];
      let pointD = status.pattern.points['D'];

      let distCE = halfWrist + inchesToPrecision(status, 0.625);
      let distC9 = halfWrist - inchesToPrecision(status, 0.625);

      let distCD = distPointToPoint(pointC, pointD);

      let distED = Math.sqrt(distCE * distCE - distCD * distCD);
      let dist9D = Math.sqrt(distC9 * distC9 - distCD * distCD);

      let pointE = setPoint(pointD.x - distED, pointD.y);
      let point9 = setPoint(pointD.x - dist9D, pointD.y);

      status = registerPoints(status, { 'E': pointE, '9': point9 });

      
      //draw a line from C to E and from C to 9
      status = setLine(status, 'C', 'E', 'dashed');
      status = setLine(status, 'C', '9', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return `Take the distance from E to C, divide by 2.5, and set point EC that distance from E, along the line from E to C. Then, perpendicular from E-C, set point p at 1 5/8"` },
    action: (status) => {
      let pointE = status.pattern.points['E'];
      let pointC = status.pattern.points['C'];
      let distEC = distPointToPoint(pointE, pointC);
      let distE_EC = toInches(status, distEC / 2.5);

      //set point P along the line from E to C
      let point_EC = setPointAlongLine(status, pointE, pointC, distE_EC);

      status = registerPoint(status, point_EC, 'EC');

      //draw a line, perpendicular to the line from E to C, from ec to the final point p
      //find the angle of the line from E to C
      let angleEC = Math.atan2(pointC.y - pointE.y, pointC.x - pointE.x);
      //find the angle of the perpendicular line
      let anglePerpendicular = angleEC + Math.PI / 2;
      //set point P at a distance of 1 5/8 inches from EC, along the perpendicular line
      let distP = inchesToPrecision(status, 1.625);
      let pointp = setPoint(point_EC.x + distP * Math.cos(anglePerpendicular), point_EC.y + distP * Math.sin(anglePerpendicular));

      status = registerPoint(status, pointp, 'p');

      //draw lines from E to p, and p to C
      status = setLine(status, 'E', 'p');
      status = setLine(status, 'p', 'C');

      return status;
    }
  },
  {    description: (status) => { return `Point 9C is 1/2 of the way between 9 and C. Point q is 1 1/8 perpendicular from line 9-C` },
    action: (status) => {
      let point9 = status.pattern.points['9'];
      let pointC = status.pattern.points['C'];

      //find the midpoint between 9 and C
      let point9C = setPoint((point9.x + pointC.x) / 2, (point9.y + pointC.y) / 2);
      status = registerPoint(status, point9C, '9C');

      //find the angle of the line from 9 to C
      let angle9C = Math.atan2(pointC.y - point9.y, pointC.x - point9.x);
      //find the angle of the perpendicular line
      let anglePerpendicular = angle9C + Math.PI / 2;
      //set point Q at a distance of 1 1/8 inches from 9-C, along the perpendicular line
      let distq = inchesToPrecision(status, 1.125);
      let pointq = setPoint(point9C.x + distq * Math.cos(anglePerpendicular), point9C.y + distq * Math.sin(anglePerpendicular));

      status = registerPoint(status, pointq, 'q');

      //draw a line from 9 to q, and from q to C
      status = setLine(status, '9', 'q');
      status = setLine(status, 'q', 'C');

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
      status = setCurve(status, { s: 'K', g1: 'G', g2: 'F2', e: 'E' }, [0.18, 0.62]);
      status = setCurve(status, { s: 'N', g1: '1', g2: 'Q', e: '9' }, [0.16, 0.65]);
      status = setCurve(status, { s: 'A', g: 'M', e: 'C' });

      //set line from R to A
      status = setLine(status, 'R', 'A');

      return status;
    }
  },
  {
    description: (_status) => { return `Start the sleeve puff with point 0` },
    action: (status) => {
      let pointp = status.pattern.points['p'];
      status.pattern.points['0p'] = setPoint(0, pointp.y + 10, { d: true, l: true });

      return status;
    }
  },
  {
    description: (status) => { return `Point1p is 1/2" down from 0p, Point2p is 3/4" down from 0p, Point3p is 1 7/8" down from 0p, Point4p is 4 1/2" down from 0p, Point5p is 10" down from 0p, and Point6p is 13" down from 0p.` },
    action: (status) => {
      let point0p = status.pattern.points['0p'];
      let point1p = setPoint(point0p.x, point0p.y + inchesToPrecision(status, 0.5));
      let point2p = setPoint(point0p.x, point0p.y + inchesToPrecision(status, 0.75));
      let point3p = setPoint(point0p.x, point0p.y + inchesToPrecision(status, 1.875));
      let point4p = setPoint(point0p.x, point0p.y + inchesToPrecision(status, 4.5));
      let point5p = setPoint(point0p.x, point0p.y + inchesToPrecision(status, 10));
      let point6p = setPoint(point0p.x, point0p.y + inchesToPrecision(status, 13));

      status = registerPoints(status, { '1p': point1p, '2p': point2p, '3p': point3p, '4p': point4p, '5p': point5p, '6p': point6p });

      return status;
    }
  },
  {
    description: (status) => { return `To find most of the puff points, we will need a ratio based on the original Alice dress and your custom measurements. Alice's armhole measurement was 14.5. Yours is ${status.design.measurements.width_armhole.value}. The ratio is ${printNum(armholeRatio(status))}. Point Ap is 13 x ratio = ${printNum(armholeRatio(status))} left of 0p.` },
    action: (status) => {
      let point0p = status.pattern.points['0p'];
      let ratio = armholeRatio(status);
      let pointAp = setPoint(point0p.x - inchesToPrecision(status, 13 * ratio), point0p.y, { d: true });

      status = registerPoints(status, { 'Ap': pointAp });
      return status;
    }
  }, 
  {
    description: (status) => { return `Point Bp is ratio x 10 ${printNum(10 * armholeRatio(status))} left of 0p. Point Cp is ratio x 7 1/4" ${printNum(7.25 * armholeRatio(status))} left of 1p.` },
    action: (status) => {
      let point0p = status.pattern.points['0p'];
      let ratio = armholeRatio(status);
      let pointBp = setPoint(point0p.x - inchesToPrecision(status, 10 * ratio), point0p.y);

      let point1p = status.pattern.points['1p'];
      let pointCp = setPoint(point1p.x - inchesToPrecision(status, 7.25 * ratio), point1p.y);

      status = registerPoints(status, { 'Bp': pointBp, 'Cp': pointCp });
      return status;
    }
  },
  {
    description: (status) => { return `Point Dp does not use the ratio. Dp is 1" left of 2p. Draw a line from Dp to 4p. This is the underarm seam.` },
    action: (status) => {
      let point2p = status.pattern.points['2p'];
      let pointDp = setPoint(point2p.x - inchesToPrecision(status, 1), point2p.y);

      status = registerPoints(status, { 'Dp': pointDp });

      //draw a line from Dp to 4p
      status = setLine(status, 'Dp', '4p'); 

      return status;
    }
  },
  {
    description: (status) => { return `Point Ep is 3" x ratio ${printNum(3 * armholeRatio(status))} left of 3p. Draw the shoulder seam from Ap, through Bp, Cp, Ep, ending at Dp.` },
    action: (status) => {
      let point3p = status.pattern.points['3p'];
      let pointEp = setPoint(point3p.x - inchesToPrecision(status, 3 * armholeRatio(status)), point3p.y);

      status = registerPoints(status, { 'Ep': pointEp });

      //draw the shoulder seam from Ap to Cp, through Bp, Dp, and Ep

      status = setLine(status, 'Ap', 'Bp');
      status = setCurve(status, {s: 'Bp', g1: 'Cp', g2: 'Ep', e: 'Dp'}, [0.2, 0.75]);

      return status;
    }
  },
  {
    description: (status) => { return `Point Fp is 7" x ratio ${printNum(7 * armholeRatio(status))} left of 5p.` },
    action: (status) => {
      let point5p = status.pattern.points['5p'];
      let pointFp = setPoint(point5p.x - inchesToPrecision(status, 7 * armholeRatio(status)), point5p.y);

      status = registerPoints(status, { 'Fp': pointFp });

      return status;
    }
  },
  {
    description: (status) => { return `Point Gp is left of 6p and directly under Ap. Draw curve from 4p through Fp to Gp.` },
    action: (status) => {
      let point6p = status.pattern.points['6p'];
      let pointAp = status.pattern.points['Ap'];
      let pointGp = setPoint(pointAp.x, point6p.y);

      status = registerPoints(status, { 'Gp': pointGp });

      //draw a curve from 4p through Fp to Gp
      status = setCurve(status, { s: '4p', g: 'Fp', e: 'Gp' }, 0.5);
      status = setLine(status, 'Ap', 'Gp');

      //add labels
      //add labels for slim sleeve and puff sleeve
        let point4p = status.pattern.points['4p'];
        pointAp = status.pattern.points['Ap'];

        let pointP = status.pattern.points['P'];
        let pointQ = status.pattern.points['Q'];

        let slimsleevePoint = setPoint(pointP.x, pointQ.y);
        let puffPoint = setPoint(pointAp.x + 10, point4p.y);

      //default size for labels
        let defaultSize = 18; 
        let parts = {
          'slim sleeve': {
            point: slimsleevePoint,
            size: defaultSize,
            direction: 'up',
          },
          'sleeve puff': {
            point: puffPoint,
            size: defaultSize,
            direction: 'right',
          }
        } 
        status = registerLabels(status, parts);

      return status;
    }
  }
]

function armholeRatio(status) {
  return status.design.measurements.width_armhole.value / 14.5;
}

export const alice_sleeve = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}