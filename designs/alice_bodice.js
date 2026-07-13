import {
  inchesToPrecision,
  toInches,
  seeDist,
  registerPoints,
  registerPoint,
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
    title: 'The Alice Dress - Bodice',
    source: {
      link: 'https://youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y&si=ZT5c6spRpksh4s8v',
      label: 'The Alice Dress - Video Series'
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
      description: (_status) => { return 'Point 1 is 3/4 inch down from O' },
      action: (status) => {
        status.pattern.points['1'] = setPoint(0, inchesToPrecision(status, 3 / 4));
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
    },
    {
      description: (status => {return `Point K is the Blade (or "front of arm") ${printMeasure(status.measurements.blade)} left of A1`}),
      action : (status) => {
        let pointA1 = status.pattern.points['A1'];
        status.pattern.points['K'] = setPoint(pointA1.x - inchesToPrecision(status, parseFloat(status.measurements.blade.value)), pointA1.y, { d: true, u: true });
        return status;
      }
    },
    {
      description: (status) => { return `Point L is 3/8 of the blade measure ${printMeasure(status.measurements.blade, 3 / 8)} right of K` },
      action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointK = status.pattern.points['K'];
        status.pattern.points['L'] = setPoint(pointK.x + inchesToPrecision(status, blade * 3 / 8), pointK.y, { u: true });
        return status;
      }
    },
    {
      description: (_status) => { return 'Point V is where the line up from L crosses line extending left from O' },
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let pointO = status.pattern.points['O'];
        status.pattern.points['V'] = setPoint(pointL.x, pointO.y);
        return status;
      }
    },
    {
      description: (_status) => { return 'Point Z is halfway between Point L and Point V'},
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let pointV = status.pattern.points['V'];
        let newY = (pointL.y + pointV.y) / 2
        status.pattern.points['Z'] = setPoint(pointL.x, newY)
        return status
      }
    },
    {
      description: (_status) => { return 'Point T is halfway between Point Z and Point V'},
      action: (status) => {
        let pointZ = status.pattern.points['Z'];
        let pointV = status.pattern.points['V'];
        let newY = (pointZ.y + pointV.y) / 2
        status.pattern.points['T'] = setPoint(pointZ.x, newY)
        return status
      }
    },
    {
      description: (_status) => { return 'Point 3 is halfway between Point Z and Point T'},
      action: (status) => {
        let pointZ = status.pattern.points['Z'];
        let pointT = status.pattern.points['T'];
        let newY = (pointZ.y + pointT.y) / 2
        status.pattern.points['3'] = setPoint(pointZ.x, newY)
        return status
      }
    },
    {
      description: (status) => { return `Point 2 is 3/16 of the blade measure ${printMeasure(status.measurements.blade, 3 / 16)} left from O` },
      action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        status.pattern.points['2'] = setPoint(0 - inchesToPrecision(status, blade * 3 / 16), 0);
        
        status = setLine(status, '2', '3', 'dashed');
        status = setCurve(status, {start: '1', end: '2'}, 3);
        return status;
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
        status.pattern.points['X'] = setPointLineX(status, point2, point3, point9.x)
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
      description: (status) => { return `Point D is 1 1/2 inch left from C. Draw a guide line from C to X` },
      action: (status) => {
        let pointC = status.pattern.points['C'];
        let pointX = status.pattern.points['X'];
        let pointA = status.pattern.points['A'];

        status.pattern.points['D'] = setPoint(pointC.x - inchesToPrecision(status, 1.5), pointC.y);
        status.pattern.points['11'] = setPointLineY(status, pointC, pointX, pointA.y)
        
        status = setLine(status, 'C', 'X', 'dashed');
        status = status = setCurve(status, {start: '8', touch: '11', end: 'D'});
        return status;
      }
    },
    {
      description: (_status) => { return `Point P is halfway between G and K. Go up to E (where it crosses line left from O)` },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let pointK = status.pattern.points['K'];
        let pointO = status.pattern.points['O'];
        let newX = (pointG.x + pointK.x) / 2
        status.pattern.points['P'] = setPoint(newX, pointG.y);
        status.pattern.points['E'] = setPoint(newX, pointO.y);

        status = setLine(status, 'P', 'E', 'dashed');
        
        return status;
      }
    },
    {
      description: (_status) => {
        return `Point E is found by going up the front length - the width of top of back from 1 inch to the left of J up to meet the line up from P. E may be above or below the top line.`
      },
      action: (status) => {
        const pointB = status.pattern.points['B'];
        const pointK = status.pattern.points['K'];
        const pointJ = setPoint(pointK.x, pointB.y);
        const pointP = status.pattern.points['P'];
        status.pattern.points['E'] = findPointE(status, pointJ, pointP);
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
      description: (_status) => { return `Draw line from F through G, extending below the waist line` },
      action: (status) => {
        status = setLine(status, 'F', 'G', 'dashed', 'continued');
        return status;
      }
    },
    {
      description: (_status) => { return `Point N is on this line from F to G, 1/12 of the breast down from F` },
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
      description: (_status) => { return `Point H is on this line from F to G, where it crosses the line left of B` },
      action: (status) => {
        const pointF = status.pattern.points['F'];
        const pointG = status.pattern.points['G'];
        const pointB = status.pattern.points['B'];
        status.pattern.points['H'] = setPointLineY(status, pointF, pointG, pointB.y);
        
        return status;
      }
    },
    {
      description: (_status) => { return `Point 13 is along E-T, using the same distance as 2-X` },
      action: (status) => {
        const pointE = status.pattern.points['E'];
        const pointT = status.pattern.points['T'];
        const point2 = status.pattern.points['2'];
        const pointX = status.pattern.points['X'];
        
        const a = Math.abs(pointX.x - point2.x);
        const b = Math.abs(pointX.y - point2.y);
        const c = a * a + b * b;
        const distance = Math.sqrt(c);


        status.pattern.points['13'] = setPointAlongLine(status, pointE, pointT, distance / status.precision);
        status = setLine(status, '13', 'E');
        status = setLine(status, '2', 'X');
        return status;
      }
    },
    {
      description: (_status) => { return `Point 00 is 1 inch left of K. It is also 2/5 of the distance down from Z to L` },
      action: (status) => {
        let pointK = status.pattern.points['K'];

        let pointZ = status.pattern.points['Z'];
        let pointL = status.pattern.points['L'];

        let oneInchPrecision = inchesToPrecision(status, 1);

        let distX = oneInchPrecision;
        let distY = Math.abs(pointZ.y - pointL.y) * 2/5;

        status.pattern.points['00'] = setPoint(pointK.x - distX, pointZ.y + distY);

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
      description: (_status) => { return `Point 16 is 1 inch left of D` },
      action: (status) => {
        let pointD = status.pattern.points['D'];
        let distX = inchesToPrecision(status, 1);

        status.pattern.points['16'] = setPoint(pointD.x - distX, pointD.y);
        

        return status;
      }
    },
    {
      description: (_status) => { return `Point Gx is 1/2 inch left of G. Shape the front from N, touching Gx, ending at H` },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let distX = inchesToPrecision(status, 1/2);
        status.pattern.points['Gx'] = setPoint(pointG.x - distX, pointG.y, {}, false);
        let pointGx = status.pattern.points['Gx'];
        let pointN = status.pattern.points['N'];
        let pointH = status.pattern.points['H'];
        status = setCurve(status, {start: 'N', g1: 'Gx', g2: 'H', end: 10}, [0.38, 0.92]);

        return status;
      }
    },
    {
      description: (_status) => { return `Divide the distance G - K into 3 parts, which gives points S and T` },
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
      description: (_status) => { return `Point U is 1/2 inch right of S` },
      action: (status) => {
        let pointS = status.pattern.points['S'];
        let distX = inchesToPrecision(status, 1/2);
        status.pattern.points['U'] = setPoint(pointS.x + distX, pointS.y);
        return status;
      }
    },
    {
      description: (_status) => { return `Point J is along the bottom, where the line down from K meets the line across from B.` },
      action: (status) => {
        let pointK = status.pattern.points['K'];
        let pointB = status.pattern.points['B'];
        status.pattern.points['J'] = setPoint(pointK.x, pointB.y);
        return status;
      }
    },
    {
      description: (_status) => { return `Divide the space between H-J into 3, giving points Q and R` },
      action: (status) => {
        let pointH = status.pattern.points['H'];
        let pointJ = status.pattern.points['J'];
        let distX = Math.abs(pointH.x - pointJ.x) / 3;

        status.pattern.points['Q'] = setPoint(pointH.x + distX, pointH.y);
        status.pattern.points['R'] = setPoint(pointH.x + (distX * 2), pointH.y);

        status = setLine(status, 'U', 'Q', 'dashed');
        status = setLine(status, 'T', 'R', 'dashed');

        return status;
      }
    },
    {
      description: (_status) => { return `Point V is 1/3 of the way from U to Q` },
      action: (status) => {
        let pointU = status.pattern.points['U'];
        let pointQ = status.pattern.points['Q'];
        let distX = Math.abs(pointU.x - pointQ.x) / 3;
        let distY = Math.abs(pointU.y - pointQ.y) / 3;

        status.pattern.points['V'] = setPoint(pointU.x - distX, pointU.y + distY);

        return status;
      }
    },
    {
      description: (status) => { return `Point W is on the line from T to R, 1/2 an inch higher than point V is` },
      action: (status) => {
        let pointT = status.pattern.points['T'];
        let pointR = status.pattern.points['R'];
        let pointV = status.pattern.points['V'];

        //make two points, one 1/2 higher than V, and another several inches to the right, both invisible
        let pointV2 = setPoint(pointV.x, pointV.y - inchesToPrecision(status, 1/2), {}, false);
        let pointV3 = setPoint(pointV.x + inchesToPrecision(status, 5), pointV.y - inchesToPrecision(status, 1/2), {}, false);

        //find the intersection of the line from T to R, and the line from V2 to V3
        status.pattern.points['W'] = setPointLineLine(status, pointT, pointR, pointV2, pointV3);


        return status;
      }
    },
    {
      description: (status) => { return `Measure from C to D, and from 16 to H. Subtract from this, 1/2 the waist measure ${printMeasure(status.measurements.waist, 1 / 2)}, to get the amount of space to give the darts. Then remove an extra 1/2" for the under arm seam.` },
      action: (status) => {
        let pointC = status.pattern.points['C'];
        let pointD = status.pattern.points['D'];
        let point16 = status.pattern.points['16'];
        let pointH = status.pattern.points['H'];

        let distCD = distPointToPoint(pointC, pointD);
        let dist16H = distPointToPoint(point16, pointH);
        let waist = parseFloat(status.measurements.waist.value) / 2 * status.precision;
        let space = ((distCD + dist16H) - waist);
        //reduce space by 1/2 inch for the underarm
        space = space - inchesToPrecision(status, 1/2);
        //divide space into 4 parts, giving the distance for each side of the dart
        let dist = space / 4;
        //on either side of Q is 4 and 5, and on either side of R is 6 and 7
        let pointQ = status.pattern.points['Q'];
        let pointR = status.pattern.points['R'];
        status.pattern.points['4'] = setPoint(pointQ.x - dist, pointQ.y);
        status.pattern.points['5'] = setPoint(pointQ.x + dist, pointQ.y);
        status.pattern.points['6'] = setPoint(pointR.x - dist, pointR.y);
        status.pattern.points['7'] = setPoint(pointR.x + dist, pointR.y);

        return status;
      }
    },
    {
      description: (_status) => { return `Take the distance from 7 to 16, and divide it into 3 parts. This gives points 15 and 17` },
      action: (status) => { 
        let point7 = status.pattern.points['7'];
        let point16 = status.pattern.points['16'];
        let distX = Math.abs(point7.x - point16.x) / 3;

        //draw dashed line up from 15
        status.pattern.points['15'] = setPoint(point7.x + distX, point7.y);
        status.pattern.points['17'] = setPoint(point7.x + (distX * 2), point7.y);

        return status;
      }
    },
    {
      description: (_status) => { return `draw a line straight up from 15, finding point 14 where it meets the line from A1`},
      action: (status) => {
        let point15 = status.pattern.points['15'];
        let pointA1 = status.pattern.points['A1'];
        let pointG = status.pattern.points['G'];

        status.pattern.points['14'] = setPointLineX(status, pointA1, pointG, point15.x);

        status = setLine(status, '15', '14', 'dashed');
        //make the armhole fromm 14 to 13, touching 00
        status = setCurve(status, {start: '14', touch: '00', end: '13'}, 0.55);
        return status;
      }
    },
    {
      description: (_status) => { return `From point 17, go up to the armhole to find point 12, touching just left of L. At 12, nip a slight amount (1/4") to the right`},
      action: (status) => {
        let point14 = status.pattern.points['14'];
        let pointZ = status.pattern.points['Z'];
        let pointL = status.pattern.points['L'];

        status.pattern.points['12'] = makeTouchPoint(status, point14, pointZ, 2, 0.4);
        let point12 = status.pattern.points['12'];

        //find point 12r, 1/4 inch right of 12
        status.pattern.points['12r'] = setPoint(point12.x + inchesToPrecision(status, 1/4), point12.y, {}, false);
        let point12r = status.pattern.points['12r'];
        let point8z = status.pattern.points['8z'];

        //make a bezier curve from 12 to 8z, touching 12r
        status.pattern.points['12r_8z'] = makeTouchPoint(status, point12r, point8z, 2, 0.25, false);

        status = setCurve(status, {start: '8z', touch: '12r_8z', end: '12r'});
        //make a curve from 12 to 14, making a new Touch point
        status.pattern.points['12_14'] = makeTouchPoint(status, point14, point12, 2, 0.25, false);
        status = setCurve(status, {start: '12', touch: '12_14', end: '14'});
        return status;
      }
    },
    {
      description: (_status) => { return `Create the underarm and side back seam from 12 to 17, touching just left of L, widening to no more than 1/4" between L and 17 (default is 1/8" left, 1/4" right), and meeting again at 17.`},
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let point17 = status.pattern.points['17'];
        let point12 = status.pattern.points['12'];
        let point12r = status.pattern.points['12r'];

        //find the point left of L, on the line from 12 to 17
        status = setLine(status, '12r', '17', 'dashed');
        let pointL2 = setPointLineY(status, point12r, point17, pointL.y);
        status.pattern.points['L2'] = pointL2;

        //create the width points between L2 and 17
        let midDist = toInches(status, distPointToPoint(pointL2, point17) * 0.4);
        console.log("midDist: ", midDist)
        
        let pointL2_17 = setPointAlongLine(status, point17, pointL2, midDist, {}, false);
        status.pattern.points['L2_17'] = pointL2_17;

        let left = inchesToPrecision(status, 1/8);
        let right = inchesToPrecision(status, 1/4);

        let pointL2_17_l = setPoint(pointL2_17.x - left, pointL2_17.y, {}, false);

        let pointL2_17_r = setPoint(pointL2_17.x + right, pointL2_17.y, {}, false);

        status = registerPoints(status, {'L2_17_l': pointL2_17_l, 'L2_17_r': pointL2_17_r})

        status = setCurve(status, {start: '12', g1: 'L2', g2: 'L2_17_l', end: '17'}, [0.2, 0.67]);
        status = setCurve(status, {start: '12r', g1: 'L2', g2: 'L2_17_r', end: '17'}, [0.2, 0.67]);

        return status;
      }
    },
    {
      description: (_status) => { return `On the seam 14 to 15, take out 1/2 inch at 15`},
      action: (status) => {
        let point14 = status.pattern.points['14'];
        let point15 = status.pattern.points['15'];
        let distX = inchesToPrecision(status, 1/4);
        let distX2 = inchesToPrecision(status, 1/8);

        status.pattern.points['15r'] = setPoint(point15.x + distX, point15.y, {}, false);
        status.pattern.points['15l'] = setPoint(point15.x - distX, point15.y, {}, false);
        let point15r = status.pattern.points['15r'];
        let point15l = status.pattern.points['15l'];

        //make touch points, about 1/3 up from 15 to 14, 1/8 inch wider than 15r and 15l
        let point14_15r = setPoint(point15r.x + distX2, point14.y + (point15r.y - point14.y) * 2/3, {}, false);
        let point14_15l = setPoint(point15l.x - distX2, point14.y + (point15l.y - point14.y) * 2/3, {}, false);
        status.pattern.points['14_15r'] = point14_15r;
        status.pattern.points['14_15l'] = point14_15l;

        //draw curves from 14 to 15r and 15l, touching the new points
        status = setCurve(status, {start: '14', touch: '14_15r', end: '15r'});
        status = setCurve(status, {start: '14', touch: '14_15l', end: '15l'});

        return status;
      }
    },
    {
      description: (_status) => { return `Add to the front length from H to 10 1 inch, and shape bottom edge from 16, which is 1/2 below the waistline, to 17, on to 15`},
      action: (status) => {
        let pointH = status.pattern.points['H'];
        let pointG = status.pattern.points['G'];
        let pointV = status.pattern.points['V'];
        let pointW = status.pattern.points['W'];
        let point16 = status.pattern.points['16'];
        let point17 = status.pattern.points['17'];
        let point4 = status.pattern.points['4'];
        let point5 = status.pattern.points['5'];
        let point6 = status.pattern.points['6'];
        let point7 = status.pattern.points['7'];
        let point15r = status.pattern.points['15r'];
        let point15l = status.pattern.points['15l'];

        //first, find point 10, following the line from G to H, extending it 1 inch down to 10
        let x1 = pointG.x;
        let y1 = pointG.y;
        let x2 = pointH.x;
        let y2 = pointH.y;
        //distance is expected to be a percentage of the distance between point1 and point2
        let dist1to2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

        const precision = status.precision;

        let distTo10inch = (dist1to2 / precision) + 1

        let point10 = setPointAlongLine(status, pointG, pointH, distTo10inch);
        status.pattern.points['10'] = point10;

        status = setLine(status, 'H', '10');

        //set heights for 4low, 5low, 6low, and 7low
        // Q and R are 1/3 of the way from H to J
        // their dart sides should be the same height.
        // compare point 10 and point 15l. 1/3 up is qHeight. 2/3 up is rHeight
        let pointQ = status.pattern.points['Q'];
        let pointR = status.pattern.points['R'];
        let qHeight = pointQ.y + (point10.y - point15l.y) * 2/3;
        let rHeight = pointR.y + (point10.y - point15l.y) * 1/3;
        //set the heights for 4low and 5low at qHeight
        status.pattern.points['4low'] = setPoint(point4.x, qHeight, {}, false);
        status.pattern.points['5low'] = setPoint(point5.x, qHeight, {}, false);
        let point4low = status.pattern.points['4low'];
        let point5low = status.pattern.points['5low'];
        //set the heights for 6low and 7low at rHeight
        status.pattern.points['6low'] = setPoint(point6.x, rHeight, {}, false);
        status.pattern.points['7low'] = setPoint(point7.x, rHeight, {}, false);
        let point6low = status.pattern.points['6low'];
        let point7low = status.pattern.points['7low'];

        //make touch points for the curves V to 4low and 5low, and W to 6low and 7low
        let curveControl = 0.75;
        let lowerCurve = 2/3;
        status.pattern.points['V_4low'] = makeTouchPoint(status, point4low, pointV, 4, curveControl, false);
        status.pattern.points['V_5low'] = makeTouchPoint(status, pointV, point5low, 1, curveControl, false);
        status.pattern.points['W_6low'] = makeTouchPoint(status, point6low, pointW, 4, curveControl, false);
        status.pattern.points['W_7low'] = makeTouchPoint(status, pointW, point7low, 1, curveControl, false);
        let pointV_4low = status.pattern.points['V_4low'];
        let pointV_5low = status.pattern.points['V_5low'];
        let pointW_6low = status.pattern.points['W_6low'];
        let pointW_7low = status.pattern.points['W_7low'];

        //measure the distance from V to 4low
        let distV4low = point4low.y - pointV.y;
        //measure the distance from W to 6low
        let distW6low = point6low.y - pointW.y;

        //move touch points down, using lowerCurve
        pointV_4low.y = pointV.y + (distV4low * lowerCurve);
        pointV_5low.y = pointV.y + (distV4low * lowerCurve);
        pointW_6low.y = pointW.y + (distW6low * lowerCurve);
        pointW_7low.y = pointW.y + (distW6low * lowerCurve);
        status.pattern.points['V_4low'] = pointV_4low;
        status.pattern.points['V_5low'] = pointV_5low;
        status.pattern.points['W_6low'] = pointW_6low;
        status.pattern.points['W_7low'] = pointW_7low;

        //draw curves from V to 4low and 5low, touching 4 and 5
        status = setCurve(status, {start: 'V', touch: 'V_4low', end: '4low'});
        status = setCurve(status, {start: 'V', touch: 'V_5low', end: '5low'});
        //draw curves from W to 6low and 7low, touching 6 and 7
        status = setCurve(status, {start: 'W', touch: 'W_6low', end: '6low'});
        status = setCurve(status, {start: 'W', touch: 'W_7low', end: '7low'});

        //draw lines from 10 to 4low, 5low to 6low, and 7low to 15l
        status = setLine(status, '10', '4low');
        status = setLine(status, '5low', '6low');
        status = setLine(status, '7low', '15l');

        //draw line from 15r to 17
        status = setLine(status, '15r', '17');

        //point16low is 1/2 inch below point 16
        let point16low = setPoint(point16.x, point16.y + inchesToPrecision(status, 1/2), {}, false);
        status.pattern.points['16low'] = point16low;
        //draw a curve from 16low to 17, make new touch point
        status.pattern.points['16low_17'] = makeTouchPoint(status, point17, point16low, 1, 0.33, false);
        status = setCurve(status, {start: '17', touch: '16low_17', end: '16low'});

        //draw curve from 8z to 16low, touching 11
        status = setCurve(status, {start: '8z', touch: '11', end: '16low'});

        //create Dlow, following D down to match 16low
        let pointD = status.pattern.points['D'];
        let pointDlow = setPoint(pointD.x, pointD.y + inchesToPrecision(status, 1/2), {}, false);
        status.pattern.points['Dlow'] = pointDlow;

        status = setLine(status, 'D', 'Dlow');

        status = setLine(status, 'Dlow', 'C');

        //make last curve from X to 8
        let pointX = status.pattern.points['X'];
        let point8 = status.pattern.points['8'];
        //make touch point, from X to 8, 1/8 inch right of X
        let dist8X = inchesToPrecision(status, 1/8);

        let pointX_8 = makeTouchPoint(status, pointX, point8, 0, dist8X, false);

        status = registerPoint(status, pointX_8, 'X_8');

        status = setCurve(status, {s: 'X', t: 'X_8', e: '8'});

        //let's try adding a label
        let pointP = status.pattern.points['P'];
        let frontLabelPoint = setPoint(pointP.x - 20, pointP.y + 20);

        // //side
        let point15 = status.pattern.points['15'];
        let sideLabelPoint = setPoint(point15.x + 10, point15.y - 5);
        // //side back
        let sideBackLabelPoint = setPoint(point17.x + 10, point17.y - 5);

        let point11 = status.pattern.points['11'];
        let backLabelPoint = setPoint(point11.x + 15, point11.y + 20);
        //default size for labels
        let defaultSize = 18;

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
        //find the point 1bX1b, which is 1/2" left of 1b, at a right angle to the line Bb-1b
        const dist1bX1b = inchesToPrecision(status, 1/2);
        const angleBbTo1b = Math.atan2(point1b.y - pointBb.y, point1b.x - pointBb.x);
        //calculate the angle from Bb to 1b
        //we want to go counter-clockwise, so we subtract the angle from Bb to 1b from the angle
        const angleBbTo1bX1b = angleBbTo1b - Math.PI / 2; //90 degrees in radians, since we want to go left from 1b
        //calculate the distance from 1b to 1bX1b
        const dist1bX1bX = dist1bX1b * Math.cos(angleBbTo1bX1b);
        const dist1bX1bY = dist1bX1b * Math.sin(angleBbTo1bX1b);
        const point1bX1b = setPoint(point1b.x + dist1bX1bX, point1b.y + dist1bX1bY);
        status.pattern.points['1bX1b'] = point1bX1b;
        status = registerPoints(status, {'1bX1b': point1bX1b});
        status = setCurve(status, {s: '1b', g: '1bX1b', e: 'X1b'}, 0.1);
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
      description: (_status) => { return `The shoulder point of 13b1 is 29 degrees clockwise of the line from 13 to E, 1" away from 13b`; },
      action: (status) => {
        const point13b = status.pattern.points['13b'];
        const pointNb = status.pattern.points['Nb'];
        const breast = parseFloat(status.measurements.breast.value) * status.precision;
        const dist13b = inchesToPrecision(status, 1);
        const distNb = breast * 0.58;
        //find the point 13b1

        //what is the angle of E to 13?
        let pointE = status.pattern.points['E'];
        let point13 = status.pattern.points['13'];
        let angle13toE = Math.atan2(pointE.y - point13.y, pointE.x - point13.x);

        let angleDiffDegrees = 29; //29 degrees is the angle difference we want to use
        let angleDiffRadians = angleDiffDegrees * Math.PI / 180; //convert to radians
        let angleto13b1 = angle13toE + angleDiffRadians;

        //calculate the distance to move in x and y
        const distX = dist13b * Math.cos(angleto13b1);
        const distY = dist13b * Math.sin(angleto13b1);
        const point13b1 = setPoint(point13b.x + distX, point13b.y + distY);


        status.pattern.points['13b1'] = point13b1;

        //draw the lines from 13b to 13b1
        status = setLine(status, '13b', '13b1');
        //draw the line from 13b1 to Nb
        status = setLine(status, '13b1', 'Nb', 'dashed');

        //now, we need to move all the points down. 
        //first, let's find the distance from E to 5
        const point5 = status.pattern.points['5'];
        const distEto5 = distPointToPoint(pointE, point5);

        const margin = inchesToPrecision(status, 1.5);

        const distDown = distEto5 + margin;

        let pointList = [
          '00b', 
          '1b', 
          '2b', 
          '8b', 
          '13b', 
          '13b1',
          '1bX1b', 
          '14b', 
          '15fb', 
          '15bb', 
          'Bb', 
          'Hb', 
          'Nb', 
          'X1b', 
          'Xb'];
        pointList.sort();
        for (let point of pointList) {
          let p = status.pattern.points[point];
          //if the point is null, warn.
          if (!p) {
            console.warn(`Point ${point} is null`);
          }
          //move the point down by distDown
          status.pattern.points[point] = setPoint(p.x, p.y + distDown);
        }

        return status;
      }
    },
    {
      description: (_status) => { return `To form the top seam and ruffle, go from Nb at a right angle to the line from Hb to Nb, 1/2" to the right. To find point N1b`; },
      action: (status) => {
        const pointHb = status.pattern.points['Hb'];
        const pointNb = status.pattern.points['Nb'];

        //calculate the angle from Hb to Nb
        const angleHbToNb = Math.atan2(pointNb.y - pointHb.y, pointNb.x - pointHb.x);
        //calculate the distance to move in x and y
        const distX = inchesToPrecision(status, 1/2) * Math.cos(angleHbToNb + Math.PI / 2); //90 degrees to the right
        const distY = inchesToPrecision(status, 1/2) * Math.sin(angleHbToNb + Math.PI / 2);
        const pointN1b = setPoint(pointNb.x + distX, pointNb.y + distY);

        status.pattern.points['N1b'] = pointN1b;

        //draw the line from Hb to N1b. This should create a smooth front.
        status = setLine(status, 'Nb', 'N1b');
        status = setCurve(status, {s: 'Nb', g: 'N1b', e: '13b1'}, 0.1);

        return status;
      }
    },
    {
      description: (_status) => { return `To finish the ruffles on both the front and back, move the top curves up by the ruffle width (3/4") to mark the fold line, then once more to mark the seam line.`; },
      action: (status) => {
        //first, the front.
        const pointNb = status.pattern.points['Nb'];
        const pointN1b = status.pattern.points['N1b'];
        const point13b1 = status.pattern.points['13b1'];
        const pointHb = status.pattern.points['Hb'];

        // Follow the front line up by 3/4" to find the fold line, and then again to find the seam line.
        const distUp = 3/4;
        let foldDist = distPointToPoint(pointHb, pointNb)/status.precision + distUp;
        let seamDist = foldDist + distUp;
        const pointNba = setPointAlongLine(status, pointHb, pointNb, foldDist);
        const pointNbb = setPointAlongLine(status, pointHb, pointNb, seamDist);

        //following the same angle and distance, find the point N1ba
        //find the difference in x and y between Nb and N1b
        const distN1bX = pointN1b.x - pointNb.x;
        const distN1bY = pointN1b.y - pointNb.y;
        const pointN1ba = setPoint(pointNba.x + distN1bX, pointNba.y + distN1bY);
        const pointN1bb = setPoint(pointNbb.x + distN1bX, pointNbb.y + distN1bY);

        //do the same for point13b1
        const dist13b1X = point13b1.x - pointNb.x;
        const dist13b1Y = point13b1.y - pointNb.y;
        const point13b1a = setPoint(pointNba.x + dist13b1X, pointNba.y + dist13b1Y);
        const point13b1b = setPoint(pointNbb.x + dist13b1X, pointNbb.y + dist13b1Y);

        status = registerPoints(status, {'Nba': pointNba, 'N1ba': pointN1ba, '13b1a': point13b1a, '13b1b': point13b1b, 'Nbb': pointNbb, 'N1bb': pointN1bb});

        status = setCurve(status, {s: 'Nba', g: 'N1ba', e: '13b1a'}, 0.1);
        status = setCurve(status, {s: 'Nbb', g: 'N1bb', e: '13b1b'}, 0.1);

        status = setLine(status, 'Nbb', 'Hb');
        status = setCurve(status, {s: '13b1b', g: '13b1a', e: '13b1'}, 0.5);

        //now, the back
        const pointX1b = status.pattern.points['X1b'];
        const point1b = status.pattern.points['1b'];
        const point1bX1b = status.pattern.points['1bX1b'];
        const pointBb = status.pattern.points['Bb'];

        // Follow the back line up by 3/4" to find the fold line, and then again to find the seam line.
        foldDist = distPointToPoint(pointBb, point1b)/status.precision + distUp;
        seamDist = foldDist + distUp;
        const point1ba = setPointAlongLine(status, pointBb, point1b, foldDist);
        const point1bb = setPointAlongLine(status, pointBb, point1b, seamDist);

        const dist1bX1bX = point1bX1b.x - point1b.x;
        const dist1bX1bY = point1bX1b.y - point1b.y;
        const point1bX1ba = setPoint(point1ba.x + dist1bX1bX, point1ba.y + dist1bX1bY);
        const point1bX1bb = setPoint(point1bb.x + dist1bX1bX, point1bb.y + dist1bX1bY);

        const distX1bx = pointX1b.x - point1b.x;
        const distX1by = pointX1b.y - point1b.y;
        const pointX1ba = setPoint(point1ba.x + distX1bx, point1ba.y + distX1by);
        const pointX1bb = setPoint(point1bb.x + distX1bx, point1bb.y + distX1by);

        status = registerPoints(status, { '1ba': point1ba, '1bb': point1bb, 'X1ba': pointX1ba, 'X1bb': pointX1bb, '1bX1ba': point1bX1ba, '1bX1bb': point1bX1bb });

        status = setCurve(status, {s: '1ba', g: '1bX1ba', e: 'X1ba'}, 0.1);
        status = setCurve(status, {s: '1bb', g: '1bX1bb', e: 'X1bb'}, 0.1);

        status = setCurve(status, {s: 'X1b', g: 'X1ba', e: 'X1bb'}, 0.5);
        status = setLine(status, '1bb', 'Bb');
        return status
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
        //divide by 3.51 to get the distance from 3y to 7y
        const dist7y = distNtoH / 3.51;

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
        //divide by 2.1 to get the distance from 2y to 6y
        const dist6y = dist1yto4y / 2.1;

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

        // add labels for front and back yokes
        let pointFy = status.pattern.points['Fy'];

        let frontYokeLabelPoint = setPoint(point9y.x - 4, point9y.y - 7);
        let backYokeLabelPoint = setPoint(pointFy.x - 4, pointFy.y - 7);

        // outer label points

        let pointHb = status.pattern.points['Hb'];
        let outerfrontLabelPoint = setPoint(pointHb.x, pointHb.y - 40);

        let point15bb = status.pattern.points['15bb'];
        let outerbackLabelPoint = setPoint(point15bb.x, point15bb.y - 40);

        // lining label points
        let pointP = status.pattern.points['P'];
        let frontLabelPoint = setPoint(pointP.x - 15, pointP.y + 15);

        let point15 = status.pattern.points['15'];
        let sideLabelPoint = setPoint(point15.x + 10, point15.y - 5);

        let point17 = status.pattern.points['17'];
        let sideBackLabelPoint = setPoint(point17.x + 5, point17.y - 5);

        let point11 = status.pattern.points['11'];
        let backLabelPoint = setPoint(point11.x + 10, point11.y + 20);


        //default size for labels
        let outerSize = 14;
        let yokeSize = 9; 
        let liningSize = 14;

        let parts = {
          'front yoke': {
            point: frontYokeLabelPoint,
            size: yokeSize,
            direction: 'right',
          },
          'back yoke': {
            point: backYokeLabelPoint,
            size: yokeSize,
            direction: 'right',
          },
          'front outer': {
            point: outerfrontLabelPoint,
            size: outerSize,
            direction: 'right',
          },
          'back outer': {
            point: outerbackLabelPoint,
            size: outerSize,
            direction: 'right',
          },
          'front': {
            point: frontLabelPoint,
            size: liningSize,
            direction: 'up',
          },
          'side': {
            point: sideLabelPoint,
            size: liningSize,
            direction: 'up',
          },
          'side back': {
            point: sideBackLabelPoint,
            size: liningSize,
            direction: 'up',
          },
          'back': {
            point: backLabelPoint,
            size: liningSize,
            direction: 'up',
          }
        } 
        status = registerLabels(status, parts);

        return status;
      }
    },
    {
      description: (_status) => { return `To double check sizing, measure from center neck to bust point, and side neck to bust point. Check your measurements against the pattern.`; },
      action: (status) => {
        let centerNeck = status.pattern.points['N'];
        let sideNeck = status.pattern.points['E'];
        let bustPoint = status.pattern.points['P'];

        let centerNeckToBust = distPointToPoint(centerNeck, bustPoint);
        let sideNeckToBust = distPointToPoint(sideNeck, bustPoint);

        status = setLine(status, 'N', 'P', 'dashed');
        //status = setLine(status, 'E', 'P', 'dashed'); //this line is already set in a previous step

        //now, let's add the measurements to the pattern by making points with the measurement as labels
        let centerNeckLabel = `N to P: ${printNum(centerNeckToBust, 1 / status.precision)}`;
        let centerNeckPoint = setPoint((centerNeck.x + bustPoint.x) / 2, (centerNeck.y + bustPoint.y) / 2);

        let sideNeckLabel = `E to P: ${printNum(sideNeckToBust, 1 / status.precision)}`;
        let sideNeckPoint = setPoint((sideNeck.x + bustPoint.x) / 2, (sideNeck.y + bustPoint.y) / 2);

        status = registerPoints(status, 
          {
            [centerNeckLabel]: centerNeckPoint,
            [sideNeckLabel]: sideNeckPoint
          }
        );

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