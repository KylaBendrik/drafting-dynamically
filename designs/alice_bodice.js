import {
  inchesToPrecision,
  seeDist,
  registerPoints,
  registerPoint,
  registerLabel,
  registerTwoPartLabel,
  registerLabels,
  setPoint,
  setLine,
  setPointLineY,
  setPointLineX,
  setPointAlongLine,
  setPointLineCircle,
  setPointCircleCircle,
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
    title: 'Alice Bodice',
    source: {
      link: 'https://youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y&si=ZT5c6spRpksh4s8v',
      label: 'The Alice Bodice'
    },
    designer: 'Kyla Bendrik'
  }
  
  let measurements = {
    backLength: { label: "Back Length", value: 14 },
    frontLength: { label: "Front Length", value: 16.75 },
    blade: { label: "Blade", value: 7.25 },
    heightUnderArm: { label: "Height Under Arm", value: 6.75 },
    breast: { label: "Breast", value: 26 },
    waist: { label: "Waist", value: 22 },
    necksize: { label: "Neck Size", value: 12 }, //May want to use this to redefine the neckline in the lining?
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
      description: (_status) => { return 'Point 1 is 3/4 inch down from O and 2 is 3/16 of the blade left of O' },
      action: (status) => {
        status.pattern.points['1'] = setPoint(0, inchesToPrecision(status, 3 / 4));
        status.pattern.points['2'] = setPoint(inchesToPrecision(status, -3 / 16 * parseFloat(status.measurements.blade.value)), 0);

        status = setCurve(status, {start: '1', end: '2'}, 3);
        return status;
      }
    },
    {
      description: (status) => {return `From point 1, go down the back length ${printMeasure(status.measurements.backLength)} to define point B`},
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
      description: (_status) => { return 'Draw back line from 1 to B' },
      action: (status) => {
        status = setLine(status, '1', 'B');
        return status;
      }
    },
    {
      description: (status) => {return `Point G is 1/2 breast measure ${printMeasure(status.measurements.breast, 1 / 2)} left from A`},
      action: (status) => {
        let pointA = status.pattern.points['A'];
        status.pattern.points['G'] = setPoint(pointA.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 2), pointA.y);
        return status;
      }
    },
    {
      description: (status => {return `Point K is the Blade (or "front of arm") ${printMeasure(status.measurements.blade)} left of A.`}),
      action : (status) => {
        let pointA = status.pattern.points['A'];

        let pointK = setPoint(pointA.x - inchesToPrecision(status, parseFloat(status.measurements.blade.value)), pointA.y);

        status = registerPoints(status, {'K': pointK});

        return status;
      }
    },
    {
      description: (status) => { return `Point L is 3/8 of the blade measure ${printMeasure(status.measurements.blade, 3 / 8)} right of K` },
      action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointK = status.pattern.points['K'];
        status.pattern.points['L'] = setPoint(pointK.x + inchesToPrecision(status, blade * 3 / 8), pointK.y);
        return status;
      }
    },
    {
      description: (status) => { return `Point P is halfway between G and K` },
      action: (status) => {
        const pointG = status.pattern.points['G'];
        const pointK = status.pattern.points['K'];
        const newX = (pointG.x + pointK.x) / 2;
        status.pattern.points['P'] = setPoint(newX, pointG.y);
        return status;
      }
    },
    {
      description: (status) => { return `Points E, I, and V are ${printNum(calculateA1Dist(status))} left of P, K and L, at the height of O` },
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let pointK = status.pattern.points['K'];
        let pointP = status.pattern.points['P'];

        let pointO = status.pattern.points['O'];

        let a1dist = calculateA1Dist(status);

        let pointE = setPoint(pointP.x - a1dist, pointO.y);
        let pointI = setPoint(pointK.x - a1dist, pointO.y);
        let pointV = setPoint(pointL.x - a1dist, pointO.y, { d: true });

        status = registerPoints(status, {'E': pointE, 'I': pointI, 'V': pointV});

        status = setLine(status, 'P', 'E', 'dashed');
        status = setLine(status, 'K', 'I', 'dashed');
        return status;
      }
    },
    {
      description: (_status) => { return 'Point Z is halfway between the height of Point L and Point V, directly below V'},
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let pointV = status.pattern.points['V'];
        let newY = (pointL.y + pointV.y) / 2
        status.pattern.points['Z'] = setPoint(pointV.x, newY)
        return status
      }
    },
    {
      description: (_status) => { return 'Point ZV is halfway between Point Z and Point V'},
      action: (status) => {
        let pointZ = status.pattern.points['Z'];
        let pointV = status.pattern.points['V'];
        let newY = (pointZ.y + pointV.y) / 2
        status.pattern.points['ZV'] = setPoint(pointZ.x, newY)

        return status
      }
    },
    {
      description: (_status) => { return 'Point 3 is halfway between Point Z and Point ZV'},
      action: (status) => {
        let pointZ = status.pattern.points['Z'];
        let pointZV = status.pattern.points['ZV'];
        let newY = (pointZ.y + pointZV.y) / 2
        status.pattern.points['3'] = setPoint(pointZ.x, newY)

        status = setLine(status, '2', '3', 'dashed');
        return status
      }
    },
    {
      description: (status) => { return `Point 9 is 1/6 of the breast ${printMeasure(status.measurements.breast, 1 / 6)} left of O` },
      action: (status) => {
        let breast = parseFloat(status.measurements.breast.value);
        let pointO = status.pattern.points['O'];
        status.pattern.points['9'] = setPoint(0 - inchesToPrecision(status, breast * 1 / 6), pointO.y);


        return status;
      }
    },
    {
      description: (_status) => { return `Point X is where the line down from 9 meets the line from 3 to 2.` },
      action: (status) => {
        let point9 = status.pattern.points['9'];
        let point2 = status.pattern.points['2'];
        let point3 = status.pattern.points['3'];
        let pointZV = status.pattern.points['ZV'];


        let pointX = setPointLineX(status, point2, point3, point9.x)

        status.pattern.points['X'] = pointX;
        return status;
      }
    },
    {
      description: (_status) => { return `Point 8 is where the line down from 9 meets the line right from Z` },
      action: (status) => {
        let point9 = status.pattern.points['9'];
        let pointZ = status.pattern.points['Z'];
        status.pattern.points['8'] = setPoint(point9.x, pointZ.y);
        status = setLine(status, 'Z', '8', 'dashed');
        status = setLine(status, '9', '8', 'dashed');
        
        return status;
      }
    },
    {
      description: (_status) => { return `Point D is 1 1/8 inch left from B. Draw a guide line from B to X. 11 is where this guide line crosses the line from A` },
      action: (status) => {
        let pointB = status.pattern.points['B'];
        let pointX = status.pattern.points['X'];
        let pointA = status.pattern.points['A'];

        let pointD = setPoint(pointB.x - inchesToPrecision(status, 1.125), pointB.y);
        let point11 = setPointLineY(status, pointB, pointX, pointA.y)

        status = registerPoints(status, {'D': pointD, '11': point11});

        status = setLine(status, 'B', 'X', 'dashed');
        status = setLine(status, 'B', 'D');
        status = setCurve(status, {s: '8', g: '11', e: 'D'});
        return status;
      }
    },
    {
      description: (_status) => {
        return `Point E is found by going up the front length - the width of top of back from 1 inch to the left of J up to meet the line down from E. E may be above or below the top line.`
      },
      action: (status) => {
        const pointB = status.pattern.points['B'];
        const pointK = status.pattern.points['K'];
        const pointJ = setPoint(pointK.x, pointB.y);
        const pointP = status.pattern.points['P'];
        let pointE = status.pattern.points['E']
        let calculatedE = findPointE(status, pointJ, pointE);

        pointE = calculatedE

        status = registerPoints(status, {
          'E': pointE});

        return status;
      }
    },
    {
      description: (status) => { return `Point F is 1/12 of the breast measure ${printMeasure(status.measurements.breast, 1 / 12)} left of E.` },
      action: (status) => {
        
        let breast = parseFloat(status.measurements.breast.value);
        let pointE = status.pattern.points['E'];
        status.pattern.points['F'] = setPoint(pointE.x - inchesToPrecision(status, breast * 1 / 12), pointE.y);
        
        status = setLine(status, 'E', 'F', 'dashed');
        return status;
      }
    },
    {
      description: (_status) => { return `Draw line from F through G, extending below the waist line. Where it crosses the waist line is point H` },
      action: (status) => {
        status = setLine(status, 'F', 'G', 'dashed', 'continued');
        const pointF = status.pattern.points['F'];
        const pointG = status.pattern.points['G'];
        const pointB = status.pattern.points['B'];
        status.pattern.points['H'] = setPointLineY(status, pointF, pointG, pointB.y);

        console.log(`distance from H to B: ${distPointToPoint(status.pattern.points['H'], pointB) / status.precision} inches`);
        return status;
      }
    },
    {
      description: (status) => { return `Point N is on this line from F to G, 1/12 of the breast ${printMeasure(status.measurements.breast, 1 / 12)} down from F` },
      action: (status) => {
        const pointF = status.pattern.points['F'];
        const pointG = status.pattern.points['G'];
        const dist = parseFloat(status.measurements.breast.value) / 12;
        status.pattern.points['N'] = setPointAlongLine(status, pointF, pointG, dist);
        
        status = setCurve(status, {start: 'E', end: 'N'}, 2);
        
        return status;
      }
    },
    {
      description: (_status) => { return `Point 13 is along E-ZV, using the same distance as 2-X` },
      action: (status) => {
        const pointE = status.pattern.points['E'];
        const pointZV = status.pattern.points['ZV'];
        const point2 = status.pattern.points['2'];
        const pointX = status.pattern.points['X'];
        
        const a = Math.abs(pointX.x - point2.x);
        const b = Math.abs(pointX.y - point2.y);
        const c = a * a + b * b;
        const distance = Math.sqrt(c);


        status.pattern.points['13'] = setPointAlongLine(status, pointE, pointZV, distance / status.precision);
        status = setLine(status, '13', 'E');
        status = setLine(status, '2', 'X');
        return status;
      }
    },
    {
      description: (_status) => { return `The height of Point 00 is 2/5 of the distance down from Z to L, and is set 1" left of the line from K to I.` },
      action: (status) => {
        let pointK = status.pattern.points['K'];
        let pointI = status.pattern.points['I'];

        let pointZ = status.pattern.points['Z'];
        let pointL = status.pattern.points['L'];

        let oneInchPrecision = inchesToPrecision(status, 1);

        let distX = oneInchPrecision;
        let distY = Math.abs(pointZ.y - pointL.y) * 2/5;

        //find the point on the line from K to I at the desired height
        let point00 = setPointLineY(status, pointK, pointI, pointZ.y + distY);
        //then move it left by 1 inch
        status.pattern.points['00'] = setPoint(point00.x - distX, point00.y);
        return status;
      }
    },
    {
      description: (_status) => { return `Go in from 8 to top of side body 1/4 inch, curve the side-seam from 11 up.` },
      action: (status) => {
        let point8 = status.pattern.points['8'];
        let distX = inchesToPrecision(status, 1/4);

        status.pattern.points['8z'] = setPoint(point8.x - distX, point8.y, [], false);

        

        return status;
      }
    },
    {
      description: (_status) => { return `Point 16 is 1/4" left of D` },
      action: (status) => {
        let pointD = status.pattern.points['D'];
        let distX = inchesToPrecision(status, 1/4);

        status.pattern.points['16'] = setPoint(pointD.x - distX, pointD.y);

        status = setCurve(status, {s: '8z', g: '11', e: '16'}, 0.45);
        

        return status;
      }
    },
    {
      description: (_status) => { return `The outer edge of the center front (Gx)is 1/2 inch left of G. Shape the front from N, touching Gx, ending at H` },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let distX = inchesToPrecision(status, 1/2);
        status.pattern.points['Gx'] = setPoint(pointG.x - distX, pointG.y);
        let pointGx = status.pattern.points['Gx'];
        let pointN = status.pattern.points['N'];
        let pointH = status.pattern.points['H'];
        status = setCurve(status, {s: 'N', g: 'Gx', e: 'H'});

        return status;
      }
    },
    {
      description: (status) => { return `Divide the distance G - K into 3 parts ${printNum(((status.measurements.breast.value / 2) - status.measurements.blade.value)/3)}, which gives points S and T` },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let pointK = status.pattern.points['K'];
        let distX = Math.abs(pointG.x - pointK.x) / 3;

        status.pattern.points['S'] = setPoint(pointG.x + distX, pointG.y);
        status.pattern.points['T'] = setPoint(pointG.x + (distX * 2), pointG.y);

        return status;
      }
    },
    {
      description: (_status) => { return `Point U is 1/4 inch right of S` },
      action: (status) => {
        let pointS = status.pattern.points['S'];
        let distX = inchesToPrecision(status, 1/4);
        status.pattern.points['U'] = setPoint(pointS.x + distX, pointS.y);
        return status;
      }
    },
    {
      description: (_status) => { return `Take the distance from H to J, divide this in thirds. Subtract 3/8" to get from H to Q. From the original third, add 1/2" to get from J to R` },
      action: (status) => {
        let pointH = status.pattern.points['H'];
        let pointK = status.pattern.points['K'];
        let pointJ = setPoint(pointK.x, pointH.y);
        status.pattern.points['J'] = pointJ;
        let distHJ = Math.abs(pointH.x - pointJ.x);
        let distThird = distHJ / 3;

        let pointQ = setPoint(pointH.x + (distThird - inchesToPrecision(status, 3/8)), pointH.y);
        let pointR = setPoint(pointJ.x - (distThird + inchesToPrecision(status, 1/2)), pointJ.y);

        status = registerPoints(status, {'Q': pointQ, 'R': pointR});

        return status;
      }
    },
    {
      description: (status) => { return `Measure from B to D, and from 16 to H. Subtract from this, 1/2 the waist measure ${printMeasure(status.measurements.waist, 1 / 2)}, to get the amount of space to give the darts.` },
      action: (status) => {
        let pointB = status.pattern.points['B'];
        let pointD = status.pattern.points['D'];
        let point16 = status.pattern.points['16'];
        let pointH = status.pattern.points['H'];

        let distBD = distPointToPoint(pointB, pointD);
        let dist16H = distPointToPoint(point16, pointH);
        let waist = parseFloat(status.measurements.waist.value) / 2 * status.precision;
        let space = ((distBD + dist16H) - waist);
        let dist = space / 4; //half the space, to place points 6 and 7
        
        //place 4 and 5 on either side of Q
        let pointQ = status.pattern.points['Q'];
        let point4 = setPoint(pointQ.x - dist, pointQ.y);
        let point5 = setPoint(pointQ.x + dist, pointQ.y);

        //place 6 and 7 on either side of R
        let pointR = status.pattern.points['R'];
        let point6 = setPoint(pointR.x - dist, pointR.y);
        let point7 = setPoint(pointR.x + dist, pointR.y);

        //if 6 is left of 5, just swap them
        if (point6.x < point5.x) {
          [point5, point6] = [point6, point5];
        }

        status = registerPoints(status, {
          '4': point4,
          '5': point5,
          '6': point6,
          '7': point7
        });

        return status;
      }
    },
    {
      description: (_status) => { return `Point V is 1" of the way from U to Q` },
      action: (status) => {
        let pointU = status.pattern.points['U'];
        let pointQ = status.pattern.points['Q'];
        let dist = 1; // 1 inch


        status.pattern.points['V'] = setPointAlongLine(status, pointU, pointQ, dist);

        return status;
      }
    },
    {
      description: (status) => { return `Point W is on the line from T to R, 1/2 an inch higher than point V is` },
      action: (status) => {
        let pointT = status.pattern.points['T'];
        let pointR = status.pattern.points['R'];
        let pointV = status.pattern.points['V'];

        let dist = inchesToPrecision(status, 1/2);

        //make two points, one 1/2 higher than V, and another several inches to the right, both invisible
        let pointV2 = setPoint(pointV.x, pointV.y - dist, {}, false);
        let pointV3 = setPoint(pointV.x + inchesToPrecision(status, 5), pointV.y - dist, {}, false);

        //find the intersection of the line from T to R, and the line from V2 to V3
        status.pattern.points['W'] = setPointLineLine(status, pointT, pointR, pointV2, pointV3);

        status = setLine(status, 'Q', 'U', 'dashed');
        status = setLine(status, 'R', 'T', 'dashed');


        return status;
      }
    },
    {
      description: (_status) => { return `To make the darts, make parallel lines along QV, from 4 and 5, and along RW, from 6 and 7. 1/2 of the way up each of these lines are g4, g5, g6, and g7. Curve from 4, through g4, to V. Do the same for the other lines.` },
      action: (status) => {
        let pointQ = status.pattern.points['Q'];
        let pointV = status.pattern.points['V'];
        let pointR = status.pattern.points['R'];
        let pointW = status.pattern.points['W'];

        let point4 = status.pattern.points['4'];
        let point5 = status.pattern.points['5'];
        let point6 = status.pattern.points['6'];
        let point7 = status.pattern.points['7'];

        //length of qv and rw
        let distQV = distPointToPoint(pointQ, pointV) / status.precision;
        let distRW = distPointToPoint(pointR, pointW) / status.precision;

        // //find the points g4, g5, g6, and g7
        let qv = setPointAlongLine(status, pointQ, pointV, distQV * 1/2);
        let rw = setPointAlongLine(status, pointR, pointW, distRW * 1/2);

        let dist4Q = distPointToPoint(point4, pointQ);
        let dist5Q = distPointToPoint(point5, pointQ);
        let dist6R = distPointToPoint(point6, pointR);
        let dist7R = distPointToPoint(point7, pointR);

        //find the points g4, g5, g6, and g7
        let g4 = setPoint(qv.x - dist4Q, qv.y, {}, false);
        let g5 = setPoint(qv.x + dist5Q, qv.y, {}, false);
        let g6 = setPoint(rw.x - dist6R, rw.y, {}, false);
        let g7 = setPoint(rw.x + dist7R, rw.y, {}, false);

        status = registerPoints(status, 
          {'g4': g4, 'g5': g5, 'g6': g6, 'g7': g7});

        //draw the curves
        status = setCurve(status, {s: '4', g: 'g4', e: 'V'});
        status = setCurve(status, {s: '5', g: 'g5', e: 'V'});
        status = setCurve(status, {s: '6', g: 'g6', e: 'W'});
        status = setCurve(status, {s: '7', g: 'g7', e: 'W'});

        return status;
      }
    },
    {
      description: (_status) => { return `Take the distance from 7 to 16, and divide it into 9 parts. From 16, place 2/9ths to find to find 17. From 17, place 3/9ths to find 15. The other 4/9ths should be between 15 and 7` },
      action: (status) => { 
        let point7 = status.pattern.points['7'];
        let point16 = status.pattern.points['16'];
        let oneNinth = Math.abs(point7.x - point16.x) / 9;

        let point17 = setPoint(point16.x - oneNinth * 2, point16.y);
        let point15 = setPoint(point17.x - oneNinth * 3, point17.y);

        status = registerPoints(status, {'15': point15, '17': point17});


        return status;
      }
    },
    {
      description: (_status) => { return `Point 14 is 1/3 of the way from K to L`},
      action: (status) => {
        let pointK = status.pattern.points['K'];
        let pointL = status.pattern.points['L'];
        let distX = Math.abs(pointK.x - pointL.x) / 3;
        status.pattern.points['14'] = setPoint(pointK.x + distX, pointK.y);
        //make the armhole fromm 14 to 13, touching 00
        status = setCurve(status, {start: '14', touch: '00', end: '13'}, 0.55);
        return status;
      }
    },
    {
      description: (_status) => { return `Using point 14 and 8z, find point 12, which is 1/3 of the way from 14 to 8z, and 1/2" out from that line.`},
      action: (status) => {
        let point14 = status.pattern.points['14'];
        let pointL = status.pattern.points['L'];
        let point8z = status.pattern.points['8z'];

        let distAlong = 1/3;
        let distOut = 1/2;

        let dist148z = distPointToPoint(point14, point8z) / status.precision;

        let point12x = setPointAlongLine(status, point14, point8z, distAlong * dist148z, {}, false);

        //perpendicular from line 14 to 8z, 1/2" inch out (down and right)
        // this is a right triangle, so we can use the Pythagorean theorem to find the distance
        let distto12 = inchesToPrecision(status, distOut);

        status = setLine(status, '14', '8z', 'dashed');

        let angle148z = Math.atan2(point8z.y - point14.y, point8z.x - point14.x);
        let distX = distto12 * Math.sin(angle148z);
        let distY = distto12 * Math.cos(angle148z);
        let point12 = setPoint(point12x.x - distX, point12x.y + distY);
        let point12r = setPoint(point12.x + inchesToPrecision(status, 1/4), point12.y, {}, false);

        status = registerPoints(status, {'12': point12, '12r': point12r, '12x': point12x});

        status = setLine(status, '12', '12x', 'dashed');
        
        //make touch points for between 12 and 14, and 12r and 8z
        let point14_12 = makeTouchPoint(status, point14, point12, 2, 0.25);
        let point12r_8z = makeTouchPoint(status, point12r, point8z, 2, 0.25);

        status = registerPoints(status, {'14_12': point14_12, '12r_8z': point12r_8z});

        status = setCurve(status, {s: '14', g: '14_12', e: '12'});
        status = setCurve(status, {s: '12r', g: '12r_8z', e: '8z'});

        //set the two touch points as invisible
        status.pattern.points['14_12'].visible = false;
        status.pattern.points['12r_8z'].visible = false;

        //also add the curve from X to 8
        let pointX = status.pattern.points['X'];
        let point8 = status.pattern.points['8'];
        let distX8 = inchesToPrecision(status, 1/8);
        let pointX8 = setPoint(pointX.x + distX8, (point8.y + pointX.y) / 2, {}, false);
        status.pattern.points['X8'] = pointX8;

        status = setCurve(status, {s: 'X', g: 'X8', e: '8'});
        return status;
      }
    },
    {
      description: (_status) => { return `Create the underarm and side back seam from 12 and 12r to 17, touching L`},
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let point17 = status.pattern.points['17'];
        let point12 = status.pattern.points['12'];
        let point12r = status.pattern.points['12r'];

        status = setCurve(status, {s: '12', g: 'L', e: '17'}, 0.3);
        status = setCurve(status, {s: '12r', g: 'L', e: '17'}, 0.3);

        //conned 17 to 16
        status = setLine(status, '17', '16');

        return status;
      }
    },
    {
      description: (_status) => { return `On the seam 14 to 15, take out 1/4 inch a bit above 15`},
      action: (status) => {
        let point14 = status.pattern.points['14'];
        let point15 = status.pattern.points['15'];
        let distX2 = inchesToPrecision(status, 1/8);

        //make touch points, about 1/3 up from 15 to 14, 1/8 inch wider than 15r and 15l
        let point14_15r = setPoint(point15.x + distX2, point14.y + (point15.y - point14.y) * 2/3, {}, false);
        let point14_15l = setPoint(point15.x - distX2, point14.y + (point15.y - point14.y) * 2/3, {}, false);
        status.pattern.points['14_15r'] = point14_15r;
        status.pattern.points['14_15l'] = point14_15l;

        //draw curves from 14 to 15r and 15l, touching the new points
        status = setCurve(status, {start: '14', touch: '14_15r', end: '15'});
        status = setCurve(status, {start: '14', touch: '14_15l', end: '15'});

        return status;
      }
    },
    {
      description: (_status) => { return `Finish off the bottom of the bodice.`},
      action: (status) => {
        let point15 = status.pattern.points['15'];
        let point17 = status.pattern.points['17'];

        status = setLine(status, 'H', '4');
        status = setLine(status, '5', '6');
        status = setLine(status, '7', '15');
        status = setLine(status, '15', '17');

        //let's try adding a label
        let pointP = status.pattern.points['P'];
        let frontLabelPoint = setPoint(pointP.x - 15, pointP.y + 15);

        // //side
        //let point15 = status.pattern.points['15'];
        let sideLabelPoint = setPoint(point15.x + 10, point15.y - 5);
        // //side back
        let sideBackLabelPoint = setPoint(point17.x + 5, point17.y - 5);

        let point11 = status.pattern.points['11'];
        let backLabelPoint = setPoint(point11.x + 10, point11.y + 20);
        //default size for labels
        let defaultSize = 14;

        let parts = {
          'front': {
            point: frontLabelPoint,
            size: defaultSize,
            direction: 'up',
          },
          'side': {
            point: sideLabelPoint,
            size: defaultSize,
            direction: 'up',
          },
          'side back': {
            point: sideBackLabelPoint,
            size: defaultSize,
            direction: 'up',
          },
          'back': {
            point: backLabelPoint,
            size: defaultSize,
            direction: 'up',
          }
        }

        status = registerLabels(status, parts);


        return status;
      }
    },
    {
      description: (_status) => { return `Start the outer bodice piece by copying points 00, 8, 13, 14. Points are suffixed with 'b' for 'bodice'`},
      action: (status) => {
        //copy the points 00, 8, 13, 14, 15, X, and 2 to the outer bodice piece
        const outerBodicePoints = ['00', '8', '13', '14'];
        for (const point of outerBodicePoints) {
          status.pattern.points[`${point}b`] = setPoint(status.pattern.points[point].x, status.pattern.points[point].y);
        }
        return status;
      }
    },
    {
      description: (_status) => { return `Move 00b 1" left, and move 8b 1/2" right`},
      action: (status) => {
        const point00b = status.pattern.points['00b'];
        const point8b = status.pattern.points['8b'];
        const dist00b = inchesToPrecision(status, 1);
        const dist8b = inchesToPrecision(status, 1/2);

        status.pattern.points['00b'].x =  point00b.x - dist00b;
        status.pattern.points['8b'].x =  point8b.x + dist8b;

        return status;
      }
    },
    {
      description: (_status) => { return `The bodice back shoulder seam is on a line parallel to the line 2-X, 3/4" above this line.`},
      action: (status) => {
        const point2 = status.pattern.points['2'];
        const pointX = status.pattern.points['X'];
        //make new points 2b and Xb, which are 3/4" above the line from 2 to X
        const distX_Xb = inchesToPrecision(status, 3/4);

        //the angle from 2-X to X-Xb is a right angle. Move from X to distX_Xb to find Xb
        //calculate the angle from 2 to X
        const angle2X = Math.atan2(pointX.y - point2.y, pointX.x - point2.x);
        //calculate the distance to move in x and y
        const distXbX = distX_Xb * Math.cos(angle2X);
        const distYbX = distX_Xb * Math.sin(angle2X);
        let pointXb = setPoint(pointX.x + distXbX, pointX.y - distYbX);
        let point2b = setPoint(point2.x + distXbX, point2.y - distYbX);
        status.pattern.points['Xb'] = pointXb;
        status.pattern.points['2b'] = point2b;

        status = setLine(status, '2b', 'Xb', 'dashed');
        return status;
      }
    },
    {
      description: (_status) => { return `Along this line from Xb, go 1" to find point X1b. This is the shoulder line from Xb to X1b`},
      action: (status) => {
        const pointXb = status.pattern.points['Xb'];
        const distX1b = 1; // 1 inch
        //find the point X1b, which is 1" along the line from Xb to 2b
        status.pattern.points['X1b'] = setPointAlongLine(status, pointXb, status.pattern.points['2b'], distX1b);

        status = setLine(status, 'Xb', 'X1b',);
        return status;
      }
    },
    {
      description: (_status) => { return `Shape the armhole from 13b to 14b, touching 00b, and from 14b to Xb, touching 8b`},
      action: (status) => {
        const point13b = status.pattern.points['13b'];
        const point14b = status.pattern.points['14b'];
        const point00b = status.pattern.points['00b'];
        const point8b = status.pattern.points['8b'];
        //create the lines for the armhole
        status = setCurve(status, {s: '13b', g: '00b', e: '14b'});
        status = setCurve(status, {s: '14b', g: '8b', e: 'Xb'}, 0.65);
        return status;
      }
    },
    {
      description: (_status) => { return `To form the under arm seams of these pieces, make 15fb 1/2" left and 1/8" down from 15, and 15bb 7/8" left and 1/2" down from 15`},
      action: (status) => {
        const point15 = status.pattern.points['15'];
        const dist15fbX = inchesToPrecision(status, 1/2);
        const dist15fbY = inchesToPrecision(status, 1/8);
        const dist15bbX = inchesToPrecision(status, 7/8);
        const dist15bbY = inchesToPrecision(status, 1/2);

        //find the points 15fb and 15bb
        status.pattern.points['15fb'] = setPoint(point15.x - dist15fbX, point15.y + dist15fbY);
        status.pattern.points['15bb'] = setPoint(point15.x + dist15bbX, point15.y + dist15bbY);

        //draw the lines from 14b to 15fb and 14b to 15bb
        status = setLine(status, '14b', '15fb');
        status = setLine(status, '14b', '15bb');

        return status;
      }
    },
    {
      description: (_status) => { return `To form the bottom of the back bodice, add up distance from 15 to 16 and from D to B, and multiply this by 1.67. Going from 15bb at 96 degrees, draw a line this distance to find point Bb.`},
      action: (status) => {
        const point15bb = status.pattern.points['15bb'];
        const point14b = status.pattern.points['14b'];
        const point16 = status.pattern.points['16'];
        const pointD = status.pattern.points['D'];
        const pointB = status.pattern.points['B'];

        const dist15to16 = point16.x - point15bb.x;
        const distDtoB = pointB.x - pointD.x;
        const totalDist = dist15to16 + distDtoB;

        const dist15bbtoBb = totalDist * 1.67; //multiply by 1.67 to get extra length for gathers.

        const angle = 96 * Math.PI / 180; //convert to radians
        //find the angle from 14b to 15bb
        const angle15bb = Math.atan2(point14b.x - point15bb.x, point14b.y - point15bb.y);
        //calculate the angle from 15bb to Bb
        //angle + angle15bb puts it on the left, it should be on the right
        //so we add the angle15bb to the angle
        //const angle15bbToBb = angle - angle15bb;
        const angle15bbToBb = angle15bb - angle;
        //calculate the distance to move in x and y
        const distX = dist15bbtoBb * Math.sin(angle15bbToBb);
        const distY = dist15bbtoBb * Math.cos(angle15bbToBb);
        const pointBb = setPoint(point15bb.x + distX, point15bb.y + distY);
        status.pattern.points['Bb'] = pointBb;

        status = setLine(status, '15bb', 'Bb');
        return status;
      }
    },
    {
      description: (_status) => { return `The center back of the bodice is found by taking the distance 1 to B and multiplying by 7/9. Next, go up from Bb at a right angle from the line 15bb-Bb this distance to find 1b.`; },
      action: (status) => {
        const point1 = status.pattern.points['1'];
        const pointB = status.pattern.points['B'];
        const pointBb = status.pattern.points['Bb'];
        const point15bb = status.pattern.points['15bb'];

        const dist1toB = distPointToPoint(point1, pointB);

        const angle15bbToBb = Math.atan2(pointBb.y - point15bb.y, pointBb.x - point15bb.x);
        const dist1b = dist1toB * 7 / 9;
        //calculate the distance to move in x and y
        const distX = dist1b * Math.sin(angle15bbToBb);
        const distY = dist1b * Math.cos(angle15bbToBb);
        const point1b = setPoint(pointBb.x + distX, pointBb.y - distY);
        status.pattern.points['1b'] = point1b;
        status = setLine(status, 'Bb', '1b');
        status = setLine(status, '1b', 'X1b', 'dashed');
        //make a curve from 1b to X1b, slightly curved
        let point1bX1b = makeTouchPoint(status, point1b, status.pattern.points['X1b'], 3, 0.25, false);
        status = registerPoints(status, {'1bX1b': point1bX1b});
        status = setCurve(status, {s: '1b', g: '1bX1b', e: 'X1b'}, 0.5);
        return status;
      } 
    },
    {
      description: (_status) => { return `To make the bottom of the bodice front, start from 15fb. From the line from this lower corner to 14b, go counter-clockwise 116 degrees, and draw a line 1.86 times the distance from H to 4, 5 to 6, and 7 to 15. This is the distance from 15fb to Hb.`; },
      action: (status) => {
        const point15fb = status.pattern.points['15fb'];
        const point14b = status.pattern.points['14b'];
        const pointH = status.pattern.points['H'];
        const point4 = status.pattern.points['4'];
        const point5 = status.pattern.points['5'];
        const point6 = status.pattern.points['6'];
        const point7 = status.pattern.points['7'];
        const point15 = status.pattern.points['15'];

        //calculate the distances
        const distHto4 = distPointToPoint(pointH, point4);
        const dist5to6 = distPointToPoint(point5, point6);
        const dist7to15 = distPointToPoint(point7, point15);

        const distTotal = distHto4 + dist5to6 + dist7to15;

        //calculate the angle
        const angle = 113 * Math.PI / 180;

        //calculate the angle from 15fb to 14b
        const angle15fbTo14b = Math.atan2(point14b.x - point15fb.x, point14b.y - point15fb.y);
        //calculate the angle from 15fb to Hb
        //we want to go counter-clockwise, so we subtract the angle from 15fb to 14b from the angle
        const angle15fbToHb = angle - angle15fbTo14b;

        //calculate the distance from 15fb to Hb
        const dist15fbtoHb = distTotal * 1.86;

        //calculate the new point
        const newPoint = setPoint(point15fb.x + dist15fbtoHb * Math.sin(angle15fbToHb), point15fb.y + dist15fbtoHb * Math.cos(angle15fbToHb));
        status.pattern.points['Hb'] = newPoint;

        status = setLine(status, '15fb', 'Hb');
        return status;
      }
    },
    {
      description: (_status) => { return `The center front of the bodice is found by taking the distance H to N and multiplying by 3/4. Next, go up from Hb at a right angle from the line 15fb-Hb (counter-clockwise) this distance to find Nb.`; },
      action: (status) => {
        const pointH = status.pattern.points['H'];
        const pointN = status.pattern.points['N'];
        const pointHb = status.pattern.points['Hb'];
        const point15fb = status.pattern.points['15fb'];

        const distHtoN = distPointToPoint(pointH, pointN);
        //calculate the angle from 15fb to Hb
        const angle = Math.PI / 2; //90 degrees in radians, since we want to go up from Hb
        const angle15fbToHb = Math.atan2(pointHb.y - point15fb.y, pointHb.x - point15fb.x);
        //calculate the distance from Hb to Nb
        //we want to go counter-clockwise, so we subtract the angle from 15fb to Hb from the angle
        const angleHbToNb = angle15fbToHb - angle;  
        const distNb = distHtoN * 3 / 4;
        //calculate the distance to move in x and y
        const distX = distNb * Math.cos(angleHbToNb);
        const distY = distNb * Math.sin(angleHbToNb);
        const pointNb = setPoint(pointHb.x - distX, pointHb.y - distY);

        status.pattern.points['Nb'] = pointNb;
        status = setLine(status, 'Hb', 'Nb');
        return status;
      }
    },
    {
      description: (_status) => { return `The shoulder point of 13b1 is somewhere 1 inch away from 13b. It is also the breast measure * 0.58 away from Nb. Use a compass to find the exact location.`; },
      action: (status) => {
        const point13b = status.pattern.points['13b'];
        const pointNb = status.pattern.points['Nb'];
        const breast = parseFloat(status.measurements.breast.value) * status.precision;
        const dist13b = inchesToPrecision(status, 1);
        const distNb = breast * 0.58;
        //find the point 13b1, which is 1 inch away from 13b, and breast * 0.58 away from Nb
        //we can use the compass to find the point, by drawing a circle around 13b with radius dist13b, and a circle around Nb with radius distNb, and finding the intersection of the two circles
        const point13b1 = setPointCircleCircle(status, point13b, dist13b, pointNb, distNb, true);
        status.pattern.points['13b1'] = point13b1;

        //draw the lines from 13b to 13b1
        status = setLine(status, '13b', '13b1');
        //draw the line from 13b1 to Nb
        status = setLine(status, '13b1', 'Nb');

        //now, we need to move all the points down. 
        //first, let's find the distance from E to 5
        const point5 = status.pattern.points['5'];
        const pointE = status.pattern.points['E'];
        const distEto5 = distPointToPoint(pointE, point5);

        const margin = inchesToPrecision(status, 3/4);

        const distDown = distEto5 + margin;

        let pointList = ['00b', '1b', '2b', '8b', '13b', '13b1','1bX1b', '14b', '15fb', '15bb', 'Bb', 'Hb', 'Nb', 'X1b', 'Xb'];
        //console.log the point list in alphabetical order
        pointList.sort();
        console.log('Moving points down:', pointList);
        for (const point of pointList) {
          const p = status.pattern.points[point];
          //move the point down by distDown
          status.pattern.points[point] = setPoint(p.x, p.y + distDown);
        }

        //make labels
        let pointHb = status.pattern.points['Hb'];
        let frontLabelPoint = setPoint(pointHb.x, pointHb.y - 40);

        let point15bb = status.pattern.points['15bb'];
        let backLabelPoint = setPoint(point15bb.x, point15bb.y - 40);
        //default size for labels
        let defaultSize = 14;

        let parts = {
          'front outer': {
            point: frontLabelPoint,
            size: defaultSize,
            direction: 'right',
          },
          'back outer': {
            point: backLabelPoint,
            size: defaultSize,
            direction: 'right',
          }
        }

        status = registerLabels(status, parts);

        return status;
      }
    },
    {
      description: (_status) => { return `To make the back yoke, start with point Oy. Point Ay is 1/2" below point Oy.`; },
      action: (status) => {
        const pointO = status.pattern.points['O'];
        const pointGx = status.pattern.points['Gx'];
        const margin = inchesToPrecision(status, 1);

        //place Oy at the level of O, and 1" (margin) to the left of Gx
        const pointOy = setPoint(pointGx.x - margin, pointO.y);
        const pointAy = setPoint(pointOy.x, pointOy.y + inchesToPrecision(status, 1/2));

        status = registerPoints(status, {'Oy': pointOy, 'Ay': pointAy});
        status = setLine(status, 'Oy', 'Ay', 'dashed');

        return status;
      }
    },
    {
      description: (_status) => { return `Take the (neck size / 2 pi) x 2.1. This is the radiusNS (which will be used several times). Point By is left of A this distance, and Point Cy is below A this distance`; },
      action: (status) => {
        const radius = radiusNS(status); //get the radius in precision units
        console.log(`radiusNS: ${radius} precision units, ${radius / status.precision} inches`);

        const pointAy = status.pattern.points['Ay'];
        const pointBy = setPoint(pointAy.x - radius, pointAy.y);
        const pointCy = setPoint(pointAy.x, pointAy.y + radius);

        status = registerPoints(status, {'By': pointBy, 'Cy': pointCy});
        status = setLine(status, 'Ay', 'By', 'dashed');
        status = setLine(status, 'Ay', 'Cy', 'dashed');

        return status;
      }
    },
    {
      description: (_status) => { return `To find point Ey, take the distance from 2 to X, subtract the distance from Xb to X1b, then sweep this distance from B to find the location on the line left of Oy.` },
      action: (status) => {
        const point2 = status.pattern.points['2'];
        const pointX = status.pattern.points['X'];
        const pointXb = status.pattern.points['Xb'];
        const pointOy = status.pattern.points['Oy'];
        const pointBy = status.pattern.points['By'];

        //find the distance from 2 to X
        const dist2toX = distPointToPoint(point2, pointX);
        //find the distance from Xb to X1b
        const distXbtoX1b = distPointToPoint(pointXb, status.pattern.points['X1b']);
        //subtract the two distances
        const distEy = dist2toX - distXbtoX1b;

        const pointOyX = setPoint(  pointOy.x - 50, pointOy.y, {}, false);

        //now, we can find the point Ey, which is left of Oy, at this distance
        const pointEy = setPointLineCircle(status, pointOy, pointOyX, pointBy, distEy, true);

        status = registerPoints(status, {'Ey': pointEy});
        status = setLine(status, 'By', 'Ey');

        return status;
      } 
    },
    {
      description: (_status) => { return `To find point Gy, take the distance from 1 to B and divide by 3.39. This is the distance from Cy down to Gy.`; },
      action: (status) => {
        const point1 = status.pattern.points['1'];
        const pointB = status.pattern.points['B'];
        //calculate the distance from 1 to B
        const dist1toB = distPointToPoint(point1, pointB);
        const distGy = dist1toB / 3.39; //divide by 3.39 to get the distance from Cy down to Gy

        const pointCy = status.pattern.points['Cy'];

        status = registerPoints(status, {'Gy': setPoint(pointCy.x, pointCy.y + distGy)});

        status = setLine(status, 'Cy', 'Gy');

        return status;
      }
    },
    {
      description: (_status) => { return `Points Dy and Fy are at 45 degrees from point Ay, to define the inner and outer curves. Dy is radiusNS / 1.21 along this line, and Fy is (Oy to Gy) / 1.3 along this line.`; },
      action: (status) => {
        const pointAy = status.pattern.points['Ay'];

        //45 degrees, down and left from Ay
        const angleADF = Math.PI / 4; //45 degrees in radians

        //find dist Oy to Gy
        const pointOy = status.pattern.points['Oy'];
        const pointGy = status.pattern.points['Gy'];
        const distOyGy = distPointToPoint(pointOy, pointGy);

        seeDist(status, distOyGy, 'Oy to Gy');

        //calculate the distance from Ay to Dy and Fy
        const radius = radiusNS(status); //get the radius in precision units

        const distDy = radius / 1.21; //1 3/4" for Dy
        const distFy = distOyGy / 1.3; //5 1/8" for Fy

        //find the points Dy and Fy
        const pointDy = setPoint(pointAy.x - distDy * Math.sin(angleADF), pointAy.y + distDy * Math.cos(angleADF));
        const pointFy = setPoint(pointAy.x - distFy * Math.sin(angleADF), pointAy.y + distFy * Math.cos(angleADF));

        status = registerPoints(status, {'Dy': pointDy, 'Fy': pointFy});
        status = setLine(status, 'Ay', 'Dy', 'dashed');
        status = setLine(status, 'Ay', 'Fy', 'dashed');

        status = setCurve(status, {s: 'By', g: 'Dy', e: 'Cy'}, 0.5);
        status = setCurve(status, {s: 'Ey', g: 'Fy', e: 'Gy'}, 0.5);


        // add label for the back yoke
        // let backYokeLabelPoint = setPoint(pointFy.x - 5, pointFy.y - 10);
        // let parts = {
        //   'back yoke': {
        //     point: backYokeLabelPoint,
        //     size: 10,
        //     direction: 'right',
        //   }
        // };
        // status = registerLabels(status, parts);

        return status;
      }
    },
    {
      description: (_status) => { return `To make the front yoke, start with point 0y. Point 1y is neck size / 3 down from 0y.`; },
      action: (status) => {
        //place 0y below the back yoke Gy 1"
        const pointGy = status.pattern.points['Gy'];
        const point0y = setPoint(pointGy.x, pointGy.y + inchesToPrecision(status, 1));

        //calculate the distance from 0y to 1y, which is neck size / 3
        const neckSize = parseFloat(status.measurements.necksize.value) * status.precision; //convert to precision units
        const dist1y = neckSize / 3; //convert to precision units

        const point1y = setPoint(point0y.x, point0y.y + dist1y);

        status = registerPoints(status, {'0y': point0y, '1y': point1y});
        status = setLine(status, '0y', '1y', 'dashed');

        return status;
      }
    },
    {
      description: (_status) => { return `Point 2y is radiusNS to the left of 1. Point 3y is radiusNS down from 1.`; },
      action: (status) => {
        const point1y = status.pattern.points['1y'];
        const radius = radiusNS(status); //get the radius in precision units

        //find point 2y, which is radiusNS to the left of 1y
        const point2y = setPoint(point1y.x - radius, point1y.y);
        //find point 3, which is radiusNS down from 1y
        const point3y = setPoint(point1y.x, point1y.y + radius);

        status = registerPoints(status, {'2y': point2y, '3y': point3y});
        status = setLine(status, '1y', '2y', 'dashed');
        status = setLine(status, '1y', '3y', 'dashed');

        return status;
      }
    },
    {
      description: (_status) => { return `Point4y is radiusNS + 3/8" to the left of 0y.`; },
      action: (status) => {
        const point0y = status.pattern.points['0y'];
        const radius = radiusNS(status); //get the radius in precision units
        const dist4y = radius + inchesToPrecision(status, 3/8); //3/8" to the left of 0y
        const point4y = setPoint(point0y.x - dist4y, point0y.y);

        status = registerPoints(status, {'4y': point4y});
        status = setLine(status, '0y', '4y', 'dashed');

        return status;
      }
    },
    {
      description: (_status) => { return `To find point 5y, take the distance from E to 13, subtract the distance from 13b to 13b1, and sweep this distance from 4y to find the location on a line straight up and down, 1/2" left of 0y.`; },
      action: (status) => {
        const pointE = status.pattern.points['E'];
        const point13 = status.pattern.points['13'];
        const point4y = status.pattern.points['4y'];
        const point3y = status.pattern.points['3y'];
        const point0y = status.pattern.points['0y'];
        const point13b1 = status.pattern.points['13b1'];
        const point13b = status.pattern.points['13b'];

        //find the distance from E to 13
        const distEto13 = distPointToPoint(pointE, point13);
        //find the distance from 13b to 13b1
        const dist13bto13b1 = distPointToPoint(point13b, point13b1);
        //subtract the two distances
        const dist5y = distEto13 - dist13bto13b1;

        //find the point 5y, which is 1/2" left of 0y, and straight up and down from 4y
        let distLine = inchesToPrecision(status, 1/2); //1/2" left of 0y
        let newlineA = setPoint(point0y.x - distLine, point0y.y, {}, false);
        let newlineB = setPoint(point0y.x - distLine, point3y.y, {}, false);
        //find the point 5y, which is on the line from newlineA to newlineB, at the distance dist5y from 4y
        let point5y = setPointLineCircle(status, newlineA, newlineB, point4y, dist5y, true, false);

        console.log(point5y);
        console.log(newlineA);
        console.log(newlineB);

        status = registerPoints(status, {'5y': point5y});
        status = setLine(status, '4y', '5y');

        return status;
      }
    }, 
    {
      description: (_status) => { return `To find point 7y, take the distance from N to H, divide by 3.51, and go down from 3y this distance.`; },
      action: (status) => {
        const pointN = status.pattern.points['N'];
        const pointH = status.pattern.points['H'];
        const point3y = status.pattern.points['3y'];

        //find the distance from N to H
        const distNtoH = distPointToPoint(pointN, pointH);
        seeDist(status, distNtoH, 'N to H');
        //divide by 3.51 to get the distance from 3y to 7y
        const dist7y = distNtoH / 3.51;
        seeDist(status, dist7y, '3y to 7y');

        //find the point 7y, which is down from 3y this distance
        const point7y = setPoint(point3y.x, point3y.y + dist7y);

        status = registerPoints(status, {'7y': point7y});
        status = setLine(status, '3y', '7y');

        return status;
      } 
    },
    {
      description: (_status) => { return `To find point 6y, take the distance from 1y to 4y, divide by 2.1, and go left from 2y this distance.`; },
      action: (status) => {
        const point1y = status.pattern.points['1y'];
        const point4y = status.pattern.points['4y'];
        const point2y = status.pattern.points['2y'];

        //find the distance from 1y to 4y
        const dist1yto4y = distPointToPoint(point1y, point4y);
        seeDist(status, dist1yto4y, '1y to 4y');
        //divide by 2.1 to get the distance from 2y to 6y
        const dist6y = dist1yto4y / 2.1;
        seeDist(status, dist6y, '2y to 6y');

        //find the point 6y, which is left from 2y this distance
        const point6y = setPoint(point2y.x - dist6y, point2y.y);

        status = registerPoints(status, {'6y': point6y});
        status = setLine(status, '2y', '6y');

        return status;
      }
    },
    {
      description: (_status) => { return `Point 8y and 9y are 45 degrees from 1y. Point 8 is radiusNS, point 9 is radiusNS / 0.7 down from 1y.`; },
      action: (status) => {
        const point1y = status.pattern.points['1y'];
        const radius = radiusNS(status); //get the radius in precision units

        //45 degrees, down and left from 1y
        const angleAD = Math.PI / 4; //45 degrees in radians

        //find point 8, which is radiusNS to the left of 1y
        const point8y = setPoint(point1y.x - radius * Math.sin(angleAD), point1y.y + radius * Math.cos(angleAD));
        //find point 9, which is radiusNS / 0.7 along the line from 1y to 8y
        const dist9 = radius / 0.7;
        const point9y = setPoint(point8y.x - dist9 * Math.sin(angleAD), point8y.y + dist9 * Math.cos(angleAD));

        status = registerPoints(status, {'8y': point8y, '9y': point9y});
        status = setLine(status, '1y', '8y', 'dashed');
        status = setLine(status, '1y', '9y', 'dashed');

        status = setCurve(status, {s: '5y', g1: '2y', g2: '8y', e: '3y'}, [0.3, 0.6]);
        status = setCurve(status, {s: '4y', g1: '6y', g2: '9y', e: '7y'}, [0.35, 0.66]);

        //add labels for front and back yokes
        let pointFy = status.pattern.points['Fy'];
        let frontYokeLabelPoint = setPoint(point9y.x - 4, point9y.y - 7);
        let backYokeLabelPoint = setPoint(pointFy.x - 4, pointFy.y - 7);
        //default size for labels
        let defaultSize = 9; 
        let parts = {
          'front yoke': {
            point: frontYokeLabelPoint,
            size: defaultSize,
            direction: 'right',
          },
          'back yoke': {
            point: backYokeLabelPoint,
            size: defaultSize,
            direction: 'right',
          }
        } 
        status = registerLabels(status, parts);

        return status;
      }
    }
]

function radiusNS(status, precision = true) {
  //returns the radiusNS, which is (neck size / 2 pi) x 2.1
  const neckSize = parseFloat(status.measurements.necksize.value);
  const radius = (neckSize / (2 * Math.PI)); //convert to precision units
  //if precision is false, return the radius in inches
  if (!precision) {
    return radius * 1.11; //convert to inches
  } else {
    return radius * 1.11 * status.precision; //convert to precision units
  }
}

function widthTopBack(status){
  //returns the width of the top of the back, the quarter ellipse 1-2 around O
  const point1 = status.pattern.points['1'];

  //const point1 = {x: 20, y: 0};
  const point2 = status.pattern.points['2'];
  const center = status.pattern.points['O'];
  const p = perimeterEllipse(status, center, point1, point2);
  return p / 4;
}

function findPointE(status, pointJ, pointP) {
  const pointj = setPoint(pointJ.x - (1 * status.precision), pointJ.y);
  const frontLength = parseFloat(status.design.measurements.frontLength.value) * status.precision;

  //the "width of top back" not clear in the instructions. But it seems that 1/12 of the breast value gets the right result
  //I did try from O to 2, as well as finding the circumference of the ellipse, but neither seemed to work.
  //const wtb = Math.abs(parseFloat(status.design.measurements.breast.value) / 12 * status.precision);
  
  //o-2 is the width of the top back
  const wtb = widthTopBack(status);
  
  
  //we need to find the y for point E
  //we have a triangle, with lines a, b, and c.
  //a is along x, from pointj to pointP
  const a = Math.abs(pointP.x - pointj.x);
  const c = frontLength - wtb;

  //b is along y, on x of point P.
  //a^2 + b^2 = c^2
  //b = sqrt(c^2 - a^2)
  const b = Math.round(Math.sqrt(c * c - a * a));
  const ey = Math.round(pointJ.y - b);
  return setPoint(pointP.x, ey, { l: true });
}

function calculateA1Dist(status) {
  //A1 is the point on the line from O to 2, that is 1/12 of the breast measure down from O
  const breast = parseFloat(status.measurements.breast.value);
  const backLength = parseFloat(status.measurements.backLength.value);
  const underarmLength = parseFloat(status.measurements.heightUnderArm.value);
  //using interpolation
  //keystone says 1/24 of breast measure, but here we aren't moving C over.
  const keyCB = breast / 24
  //t is underarm length / back length. In otherwords, t is the interpolation from 1 to B of the underarm length
  let t = underarmLength / backLength;
  //we can use this same t to find the distance from A to A1 in the original keystone pattern
  const a1Dist = keyCB * t;

  return a1Dist * status.precision; //return in precision units

}

export const alice_bodice = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}