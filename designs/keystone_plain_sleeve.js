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
    width_elbow: { label: "width at elbow", value: 12 },
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
        let pointJ = setPoint(pointO.x - armhole / 2, pointO.y, {d: true });

        status = registerPoint(status, pointJ, 'J');

        return status;
      }
    },
    {
      description: (status) => { return `A down to C is the length of sleeve under arm, ${printNum(status.measurements.length_underarm.value)} down from A` },
      action: (status) => {
        let lengthUnderarm = inchesToPrecision(status, status.design.measurements.length_underarm.value);
        let pointA = status.pattern.points['A'];
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

        //new points
        let pointF = setPoint(pointJ.x, pointB.y);
        let pointG = setPoint(pointJ.x, pointA.y);

        status = registerPoints(status, {'F': pointF, 'G': pointG});
        status = setLine(status, 'F', 'E', 'dashed');
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
        status = registerPoints(status, {'P': pointP, 'S': pointS});
        //status = setCurve(status, {start: 'V', touch: 'V_4low', end: '4low'}, 0, 'bezier');
        status = setCurve(status, {start: 'K', center: 'P', end: 'S'}, 0, 'arc');

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
        

        status = registerPoints(status, {'S2': pointS2, 'SR': pointSR});
        status = setCurve(status, {start: 'R', touch: 'SR', end: 'S2'}, 0, 'bezier');
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
        status = registerPoints(status, {'N': pointN, 'L': pointL});
        return status;
      }
    },
    {
      description: (status) => { return `Shape the under-arm scye from R to the line at L and up to N, curving above and below a straight line from N to L`},
      action: (status) => {
        let pointN = status.pattern.points['N'];
        let pointL = status.pattern.points['L'];

        //set the line from N to L
        status = setLine(status, 'N', 'L', 'dashed');
        //set the curve from R to L
        status = setCurve(status, {start: 'R', end: 'L'}, 2, 'ellipse');
        //set the curve from L to N
        let midX = (pointL.x + pointN.x) / 2;
        let midY = (pointL.y + pointN.y) / 2;
        //amplitude
        let amp = 7;

        let pointNLcp1 = setPoint(midX, midY + amp, {}, false);
        let pointNLcp2 = setPoint(midX, midY - amp, {}, false);

        status = registerPoints(status, {'NLcp1': pointNLcp1, 'NLcp2': pointNLcp2});
        status = setCurve(status, {start: 'L', cp1: 'NLcp1', cp2: 'NLcp2', end: 'N'}, 0, 'bezier2');
        return status;
      }
    },
    {
      description: (status) => { return `Point M is 1/2 elbow, ${printNum(status.measurements.width_elbow.value / 2)} right of F` },
      action: (status) => {
        let elbow = inchesToPrecision(status, status.design.measurements.width_elbow.value);
        let pointF = status.pattern.points['F'];
        let pointM = setPoint(pointF.x + elbow / 2, pointF.y);

        status = registerPoint(status, pointM, 'M');

        //make points AM and CM, 1/3 of the way from A to M and C to M
        let pointA = status.pattern.points['A'];
        let pointC = status.pattern.points['C'];
        let pointAM = makeTouchPoint(status, pointM, pointA, 4, 0.25, false);
        let pointCM = makeTouchPoint(status, pointC, pointM, 3, 0.25, false);
        status = registerPoints(status, {'AM': pointAM, 'CM': pointCM});

        status = setCurve(status, {start: 'AM', touch: 'M', end: 'CM'}, 0, 'bezier');
        status = setLine(status, 'A', 'AM');
        status = setLine(status, 'C', 'CM');
        return status;
      }
    },
    {
      description: (status) => { return `Shape from K to G, past F clearing it by 1/2 inch, then curve to E.` },
      action: (status) => {
        let pointK = status.pattern.points['K'];
        let pointG = status.pattern.points['G'];
        let pointF = status.pattern.points['F'];
        let pointE = status.pattern.points['E'];

        //set the line from K to G
        //status = setLine(status, 'K', 'G');
        //set point F2, 1/2 inch left of F
        let pointF2 = setPoint(pointF.x - inchesToPrecision(status, 0.5), pointF.y, {}, false);
        status = registerPoint(status, pointF2, 'F2');
        //Find touch points between F2 and G, and F2 and E
        let pointGF2 = makeTouchPoint(status, pointF2, pointG, 4, 0.3, false);
        let pointF2E = makeTouchPoint(status, pointF2, pointE, 3, 0.075, false);
        status = registerPoints(status, {'GF2': pointGF2, 'F2E': pointF2E, 'F2': pointF2});

        //set the lines from G to F2 and from F2 to E
        status = setLine(status, 'G', 'F2', 'dashed');
        status = setLine(status, 'F2', 'E', 'dashed');
        //status = setCurve(status, {start: 'G', touch: 'GF2', end: 'F2'}, 0, 'bezier');
        status = setCurve(status, {start: 'K', touch: 'G', end: 'GF2'}, 0, 'bezier');
        status = setCurve(status, {start: 'GF2', touch: 'F2', end: 'F2E'}, 0, 'bezier');
        status = setLine(status, 'F2E', 'E');

        return status;
      }
    },
    {
      description: (status) => { return `Curve the cuff from C to E` },
      action: (status) => {
        let pointC = status.pattern.points['C'];
        let pointE = status.pattern.points['E'];

        let pointCE = makeTouchPoint(status, pointC, pointE, 4, 0.15);
        status = registerPoint(status, pointCE, 'CE');

        //set the line from C to E
        status = setLine(status, 'C', 'E', 'dashed');
        //set the curve from C to E
        status = setCurve(status, {start: 'C', touch: 'CE', end: 'E'}, 0, 'bezier');
        return status;
      }
    },
    {
      description: (status) => { return `Point 9 is 1/2 inch right of E` },
      action: (status) => {
        let pointE = status.pattern.points['E'];
        let point9 = setPoint(pointE.x + inchesToPrecision(status, 0.5), pointE.y);

        status = registerPoint(status, point9, '9');
        return status;
      }
    },
    {
      description: (status) => { return `Draw the elbow-seam of the under part from N to 1 straight down` },
      action: (status) => {
        let pointN = status.pattern.points['N'];
        let pointG = status.pattern.points['G'];
        let point1 = setPoint(pointN.x, pointG.y);

        status = registerPoint(status, point1, '1');

        //set the line from N to 1
        status = setLine(status, 'N', '1');
        return status;
      }
    },
    {
      description: (status) => { return `Draw the seam from 1 to Point Q, which is 1/2 right of F` },
      action: (status) => {
        let pointF = status.pattern.points['F'];
        let point1 = status.pattern.points['1'];
        let pointQ = setPoint(pointF.x + inchesToPrecision(status, 0.5), pointF.y);
        let point9 = status.pattern.points['9'];

        let point1Q = makeTouchPoint(status, point1, pointQ, 4, 0.1, false);

        let distX = Math.abs(point9.x - pointQ.x);
        let distY = Math.abs(point9.y - pointQ.y);

        let pointQ2 = setPoint(pointQ.x + distX * 0.1, pointQ.y + distY * 0.2);

        status = registerPoints(status, {'Q': pointQ, '1Q': point1Q,'Q2': pointQ2});


        //set curve from 1 to 9
        status = setCurve(status, {start: '1Q', touch: 'Q2', end: '9'}, 0, 'bezier');

        //make cuff from 9 to C
        let pointC = status.pattern.points['C'];
        let point9C = makeTouchPoint(status, point9, pointC, 4, 0.15);
        status = registerPoint(status, point9C, '9C');
        //set the curve from 9 to C
        status = setCurve(status, {start: '9', touch: '9C', end: 'C'}, 0, 'bezier');
        status = setCurve(status, {start: 'N', touch: '1', end: '1Q'}, 0, 'bezier');
        return status;
      }
    }
]


export const keystone_plain_sleeve = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}