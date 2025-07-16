import {
  inchesToPrecision,
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
    title: 'Alice Bodice Lining',
    source: {
      link: 'https://youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y&si=ZT5c6spRpksh4s8v',
      label: 'The Alice Bodice Lining'
    },
    designer: 'Kyla Bendrik'
  }
  
  let measurements = {
    backLength: { label: "Back Length", value: 14 },
    frontLength: { label: "Front Length", value: 17 },
    blade: { label: "Blade", value: 7.25 },
    heightUnderArm: { label: "Height Under Arm", value: 6.75 },
    breast: { label: "Breast", value: 26 },
    waist: { label: "Waist", value: 22 }
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
        return status
      }
    },
    // {
    //   description: (status) => { return `Point 9 is 1/6 of the breast ${printMeasure(status.measurements.breast, 1 / 6)} left of O` },
    //   action: (status) => {
    //     let breast = parseFloat(status.measurements.breast.value);
    //     let pointO = status.pattern.points['O'];
    //     status.pattern.points['9'] = setPoint(0 - inchesToPrecision(status, breast * 1 / 6), pointO.y);


    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point X is where the line down from 9 meets the line from 3 to 2.` },
    //   action: (status) => {
    //     let point9 = status.pattern.points['9'];
    //     let point2 = status.pattern.points['2'];
    //     let point3 = status.pattern.points['3'];
    //     let pointZV = status.pattern.points['ZV'];


    //     let pointX = setPointLineX(status, point2, point3, point9.x)
    //     console.log(`the distance from 2 to X is ${distPointToPoint(point2, pointX) / status.precision} inches`);
    //     console.log(`the height difference between X and ZV is ${Math.abs(pointX.y - pointZV.y) / status.precision} inches`);
    //     console.log(`the height difference between X and 3 is ${Math.abs(pointX.y - point3.y) / status.precision} inches`);

    //     status.pattern.points['X'] = pointX;
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point 8 is where the line down from 9 meets the line right from Z` },
    //   action: (status) => {
    //     let point9 = status.pattern.points['9'];
    //     let pointZ = status.pattern.points['Z'];
    //     status.pattern.points['8'] = setPoint(point9.x, pointZ.y);
    //     status = setLine(status, 'Z', '8', 'dashed');
    //     status = setLine(status, '9', '8', 'dashed');
        
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point D is 1 1/8 inch left from C. Draw a guide line from D to X. 11 is where this guide line crosses the line from A1` },
    //   action: (status) => {
    //     let pointC = status.pattern.points['C'];
    //     let pointX = status.pattern.points['X'];
    //     let pointA = status.pattern.points['A'];

    //     let pointD = setPoint(pointC.x - inchesToPrecision(status, 1.125), pointC.y);
    //     let point11 = setPointLineY(status, pointC, pointX, pointA.y)

    //     status = registerPoints(status, {'D': pointD, '11': point11});

    //     status = setLine(status, 'C', 'X', 'dashed');
    //     status = setLine(status, 'C', 'D');
    //     status = setCurve(status, {s: '8', g: '11', e: 'D'});
    //     return status;
    //   }
    // },
    // {
    //   description: (status) => { return `Point P is halfway between G and K ${printNum(((status.measurements.breast.value / 2) - status.measurements.blade.value)/2)}. Go up to E (where it crosses line left from O)` },
    //   action: (status) => {
    //     let pointG = status.pattern.points['G'];
    //     let pointK = status.pattern.points['K'];
    //     let pointO = status.pattern.points['O'];
    //     let newX = (pointG.x + pointK.x) / 2
    //     status.pattern.points['P'] = setPoint(newX, pointG.y);
    //     status.pattern.points['E'] = setPoint(newX, pointO.y);

    //     status = setLine(status, 'P', 'E', 'dashed');
        
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => {
    //     return `Point E is found by going up the front length - the width of top of back from 1 inch to the left of J up to meet the line up from P. E may be above or below the top line.`
    //   },
    //   action: (status) => {
    //     const pointB = status.pattern.points['B'];
    //     const pointK = status.pattern.points['K'];
    //     const pointJ = setPoint(pointK.x, pointB.y);
    //     const pointP = status.pattern.points['P'];
    //     status.pattern.points['E'] = findPointE(status, pointJ, pointP);
    //     return status;
    //   }
    // },
    // {
    //   description: (status) => { return `Point F is 1/12 of the breast measure ${printMeasure(status.measurements.breast, 1 / 12)} left of E.` },
    //   action: (status) => {
        
    //     let breast = parseFloat(status.measurements.breast.value);
    //     let pointE = status.pattern.points['E'];
    //     status.pattern.points['F'] = setPoint(pointE.x - inchesToPrecision(status, breast * 1 / 12), pointE.y);
        
    //     status = setLine(status, 'E', 'F', 'dashed');
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Draw line from F through G, extending below the waist line` },
    //   action: (status) => {
    //     status = setLine(status, 'F', 'G', 'dashed', 'continued');
    //     return status;
    //   }
    // },
    // {
    //   description: (status) => { return `Point N is on this line from F to G, 1/12 of the breast ${printMeasure(status.measurements.breast, 1 / 12)} down from F` },
    //   action: (status) => {
    //     const pointF = status.pattern.points['F'];
    //     const pointG = status.pattern.points['G'];
    //     const dist = parseFloat(status.measurements.breast.value) / 12;
    //     status.pattern.points['N'] = setPointAlongLine(status, pointF, pointG, dist);
        
    //     status = setCurve(status, {start: 'E', end: 'N'}, 2);
        
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point H is on this line from F to G, where it crosses the line left of B` },
    //   action: (status) => {
    //     const pointF = status.pattern.points['F'];
    //     const pointG = status.pattern.points['G'];
    //     const pointB = status.pattern.points['B'];
    //     status.pattern.points['H'] = setPointLineY(status, pointF, pointG, pointB.y);
        
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point 13 is along E-ZV, using the same distance as 2-X` },
    //   action: (status) => {
    //     const pointE = status.pattern.points['E'];
    //     const pointZV = status.pattern.points['ZV'];
    //     const point2 = status.pattern.points['2'];
    //     const pointX = status.pattern.points['X'];
        
    //     const a = Math.abs(pointX.x - point2.x);
    //     const b = Math.abs(pointX.y - point2.y);
    //     const c = a * a + b * b;
    //     const distance = Math.sqrt(c);


    //     status.pattern.points['13'] = setPointAlongLine(status, pointE, pointZV, distance / status.precision);
    //     status = setLine(status, '13', 'E');
    //     status = setLine(status, '2', 'X');
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point 00 is 1 inch left of K. It is also 2/5 of the distance down from Z to L` },
    //   action: (status) => {
    //     let pointK = status.pattern.points['K'];

    //     let pointZ = status.pattern.points['Z'];
    //     let pointL = status.pattern.points['L'];

    //     let oneInchPrecision = inchesToPrecision(status, 1);

    //     let distX = oneInchPrecision;
    //     let distY = Math.abs(pointZ.y - pointL.y) * 2/5;

    //     status.pattern.points['00'] = setPoint(pointK.x - distX, pointZ.y + distY);

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Go in from 8 to top of side body 1/4 inch, curve the side-seam from 11 up.` },
    //   action: (status) => {
    //     let point8 = status.pattern.points['8'];
    //     let distX = inchesToPrecision(status, 1/4);

    //     status.pattern.points['8z'] = setPoint(point8.x - distX, point8.y, [], false);

        

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `To find point 16, subtract the waist from the breast, divide by 20, and add 1/8"` },
    //   action: (status) => {
    //     let pointD = status.pattern.points['D'];

    //     let waist = parseFloat(status.measurements.waist.value);
    //     let breast = parseFloat(status.measurements.breast.value);

    //     let min = 0.125; // 1/8 inch
    //     let distX = inchesToPrecision(status, ((breast - waist) / 20) + min);

    //     status.pattern.points['16'] = setPoint(pointD.x - distX, pointD.y);

    //     status = setCurve(status, {s: '8z', g: '11', e: '16'}, 0.45);
        

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point Gx is 1/2 inch left of G. Shape the front from N, touching Gx, ending at H` },
    //   action: (status) => {
    //     let pointG = status.pattern.points['G'];
    //     let distX = inchesToPrecision(status, 1/2);
    //     status.pattern.points['Gx'] = setPoint(pointG.x - distX, pointG.y);
    //     let pointGx = status.pattern.points['Gx'];
    //     let pointN = status.pattern.points['N'];
    //     let pointH = status.pattern.points['H'];
    //     status = setCurve(status, {s: 'N', g: 'Gx', e: 'H'});

    //     return status;
    //   }
    // },
    // {
    //   description: (status) => { return `Divide the distance G - K into 3 parts ${printNum(((status.measurements.breast.value / 2) - status.measurements.blade.value)/3)}, which gives points S and T` },
    //   action: (status) => {
    //     let pointG = status.pattern.points['G'];
    //     let pointK = status.pattern.points['K'];
    //     let distX = Math.abs(pointG.x - pointK.x) / 3;

    //     status.pattern.points['S'] = setPoint(pointG.x + distX, pointG.y);
    //     status.pattern.points['T'] = setPoint(pointG.x + (distX * 2), pointG.y);

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point U is 1/2 inch right of S` },
    //   action: (status) => {
    //     let pointS = status.pattern.points['S'];
    //     let distX = inchesToPrecision(status, 1/2);
    //     status.pattern.points['U'] = setPoint(pointS.x + distX, pointS.y);
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point Ra is halfway between H and J (the actual point R is 1/4" left of Ra). Point Q is halfway between H and Ra.` },
    //   action: (status) => {
    //     let pointH = status.pattern.points['H'];
    //     let pointJ = status.pattern.points['J'];
    //     let newX = (pointH.x + pointJ.x) / 2;
    //     let newY = (pointH.y + pointJ.y) / 2;
    //     let pointRa = setPoint(newX, newY);
    //     let pointQ = setPoint((pointH.x + pointRa.x) / 2, (pointH.y + pointRa.y) / 2);

    //     //calculate point R
    //     let pointR = setPoint(pointRa.x - inchesToPrecision(status, 1/4), pointRa.y);

    //     status = registerPoints(status, {'Q': pointQ, 'R': pointR});
    //     return status;
    //   }
    // },
    // {
    //   description: (status) => { return `Measure from C to D, and from 16 to H. Subtract from this, 1/2 the waist measure ${printMeasure(status.measurements.waist, 1 / 2)}, to get the amount of space to give the darts.` },
    //   action: (status) => {
    //     let pointC = status.pattern.points['C'];
    //     let pointD = status.pattern.points['D'];
    //     let point16 = status.pattern.points['16'];
    //     let pointH = status.pattern.points['H'];

    //     let distCD = distPointToPoint(pointC, pointD);
    //     let dist16H = distPointToPoint(point16, pointH);
    //     let waist = parseFloat(status.measurements.waist.value) / 2 * status.precision;
    //     let space = ((distCD + dist16H) - waist);
    //     let dist = space / 4; //half the space, to place points 6 and 7
    //     console.log(`space in inches: ${space / status.precision}, dist in inches: ${dist / status.precision}`);
        
    //     //place 4 and 5 on either side of Q
    //     let pointQ = status.pattern.points['Q'];
    //     let point4 = setPoint(pointQ.x - dist, pointQ.y);
    //     let point5 = setPoint(pointQ.x + dist, pointQ.y);

    //     //place 6 and 7 on either side of R
    //     let pointR = status.pattern.points['R'];
    //     let point6 = setPoint(pointR.x - dist, pointR.y);
    //     let point7 = setPoint(pointR.x + dist, pointR.y);

    //     //if 6 is left of 5, just swap them
    //     if (point6.x < point5.x) {
    //       [point5, point6] = [point6, point5];
    //     }

    //     status = registerPoints(status, {
    //       '4': point4,
    //       '5': point5,
    //       '6': point6,
    //       '7': point7
    //     });

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Point V is 1" of the way from U to Q` },
    //   action: (status) => {
    //     let pointU = status.pattern.points['U'];
    //     let pointQ = status.pattern.points['Q'];
    //     let dist = 1; // 1 inch


    //     status.pattern.points['V'] = setPointAlongLine(status, pointU, pointQ, dist);

    //     return status;
    //   }
    // },
    // {
    //   description: (status) => { return `Point W is on the line from T to R, 1/2 an inch higher than point V is` },
    //   action: (status) => {
    //     let pointT = status.pattern.points['T'];
    //     let pointR = status.pattern.points['R'];
    //     let pointV = status.pattern.points['V'];

    //     let dist = inchesToPrecision(status, 1/2);

    //     //make two points, one 1/2 higher than V, and another several inches to the right, both invisible
    //     let pointV2 = setPoint(pointV.x, pointV.y - dist, {}, false);
    //     let pointV3 = setPoint(pointV.x + inchesToPrecision(status, 5), pointV.y - dist, {}, false);

    //     //find the intersection of the line from T to R, and the line from V2 to V3
    //     status.pattern.points['W'] = setPointLineLine(status, pointT, pointR, pointV2, pointV3);


    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Take the distance from 7 to 16, and divide it into 3 parts. This gives points 15a and 17a. 15 is 3/8 right of 15a, and 17 is 5/8 right of 17a` },
    //   action: (status) => { 
    //     let point7 = status.pattern.points['7'];
    //     let point16 = status.pattern.points['16'];
    //     let oneThird = Math.abs(point7.x - point16.x) / 3;

    //     let dist15x = oneThird + inchesToPrecision(status, 3/8);
    //     //17 is 5/8 right of its position in Keystone. 15 is placed 3/8 right of its position in Keystone.
    //     //So, moving from 15, 17 is moved the "normal" amount past 15, plus an extra 1/4"
    //     let dist17x = oneThird + inchesToPrecision(status, 1/4);
    //     //draw dashed line up from 15
    //     let point15 = setPoint(point7.x + dist15x, point7.y);
    //     let point17 = setPoint(point15.x + dist17x, point7.y);

    //     status = registerPoints(status, {'15': point15, '17': point17});


    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `draw a line straight up from 3/8 left of 15, finding point 14 where it meets the line from A1`},
    //   action: (status) => {
    //     let point15 = status.pattern.points['15'];
    //     let pointA1 = status.pattern.points['A1'];
    //     let pointG = status.pattern.points['G'];

    //     status.pattern.points['14'] = setPoint(point15.x - inchesToPrecision(status, 3/8), pointA1.y);

    //     status = setLine(status, '15', '14', 'dashed');
    //     //make the armhole fromm 14 to 13, touching 00
    //     status = setCurve(status, {start: '14', touch: '00', end: '13'}, 0.55);
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `From point 17, go up to the armhole to find point 12`},
    //   action: (status) => {
    //     let point14 = status.pattern.points['14'];
    //     let pointZ = status.pattern.points['Z'];
    //     let pointL = status.pattern.points['L'];

    //     status.pattern.points['12'] = makeTouchPoint(status, point14, pointZ, 2, 0.4);
    //     let point12 = status.pattern.points['12'];

    //     //find point 12r, 1/2 inch right of 12
    //     status.pattern.points['12r'] = setPoint(point12.x + inchesToPrecision(status, 1/4), point12.y, {}, false);
    //     let point12r = status.pattern.points['12r'];
    //     let point8z = status.pattern.points['8z'];

    //     //make a bezier curve from 12 to 8z, touching 12r
    //     status.pattern.points['12r_8z'] = makeTouchPoint(status, point12r, point8z, 2, 0.25, false);

    //     status = setCurve(status, {start: '8z', touch: '12r_8z', end: '12r'});
    //     //make a curve from 12 to 14, making a new Touch point
    //     status.pattern.points['12_14'] = makeTouchPoint(status, point14, point12, 2, 0.25, false);
    //     status = setCurve(status, {start: '12', touch: '12_14', end: '14'});
    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Create the underarm and side back seam from 12 to 17, touching just left of L, widening to no more than 1/4" between L and 17, and meeting again at 17.`},
    //   action: (status) => {
    //     let pointL = status.pattern.points['L'];
    //     let point17 = status.pattern.points['17'];
    //     let point12 = status.pattern.points['12'];
    //     let point12r = status.pattern.points['12r'];

    //     //find the point left of L, on the line from 12 to 17
    //     status = setLine(status, '12r', '17', 'dashed');
    //     let pointL2 = setPointLineY(status, point12r, point17, pointL.y);
    //     status.pattern.points['L2'] = pointL2;

    //     status = setCurve(status, {start: '12', touch: 'L2', end: '17'}, 0.4);
    //     status = setCurve(status, {start: '12r', touch: 'L2', end: '17'}, 0.4);

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `On the seam 14 to 15, take out 1/2 inch at 15`},
    //   action: (status) => {
    //     let point14 = status.pattern.points['14'];
    //     let point15 = status.pattern.points['15'];
    //     let distX = inchesToPrecision(status, 1/4);
    //     let distX2 = inchesToPrecision(status, 1/8);

    //     status.pattern.points['15r'] = setPoint(point15.x + distX, point15.y, {}, false);
    //     status.pattern.points['15l'] = setPoint(point15.x - distX, point15.y, {}, false);
    //     let point15r = status.pattern.points['15r'];
    //     let point15l = status.pattern.points['15l'];

    //     //make touch points, about 1/3 up from 15 to 14, 1/8 inch wider than 15r and 15l
    //     let point14_15r = setPoint(point15r.x + distX2, point14.y + (point15r.y - point14.y) * 2/3, {}, false);
    //     let point14_15l = setPoint(point15l.x - distX2, point14.y + (point15l.y - point14.y) * 2/3, {}, false);
    //     status.pattern.points['14_15r'] = point14_15r;
    //     status.pattern.points['14_15l'] = point14_15l;

    //     //draw curves from 14 to 15r and 15l, touching the new points
    //     status = setCurve(status, {start: '14', touch: '14_15r', end: '15r'});
    //     status = setCurve(status, {start: '14', touch: '14_15l', end: '15l'});

    //     return status;
    //   }
    // },
    // {
    //   description: (_status) => { return `Add to the front length from H to 10 1 inch, and shape bottom edge from 16, which is 1/2 below the waistline, to 17, on to 15`},
    //   action: (status) => {
    //     let pointH = status.pattern.points['H'];
    //     let pointG = status.pattern.points['G'];
    //     let pointV = status.pattern.points['V'];
    //     let pointW = status.pattern.points['W'];
    //     let point16 = status.pattern.points['16'];
    //     let point17 = status.pattern.points['17'];
    //     let point4 = status.pattern.points['4'];
    //     let point5 = status.pattern.points['5'];
    //     let point6 = status.pattern.points['6'];
    //     let point7 = status.pattern.points['7'];
    //     let point15r = status.pattern.points['15r'];
    //     let point15l = status.pattern.points['15l'];

    //     //first, find point 10, following the line from G to H, extending it 1 inch down to 10
    //     let x1 = pointG.x;
    //     let y1 = pointG.y;
    //     let x2 = pointH.x;
    //     let y2 = pointH.y;
    //     //distance is expected to be a percentage of the distance between point1 and point2
    //     let dist1to2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    //     const precision = status.precision;

    //     let distTo10inch = (dist1to2 / precision) + 1

    //     let point10 = setPointAlongLine(status, pointG, pointH, distTo10inch);
    //     status.pattern.points['10'] = point10;

    //     status = setLine(status, 'H', '10');

    //     //set heights for 4low, 5low, 6low, and 7low
    //     // Q and R are 1/3 of the way from H to J
    //     // their dart sides should be the same height.
    //     // compare point 10 and point 15l. 1/3 up is qHeight. 2/3 up is rHeight
    //     let pointQ = status.pattern.points['Q'];
    //     let pointR = status.pattern.points['R'];
    //     let qHeight = pointQ.y + (point10.y - point15l.y) * 2/3;
    //     let rHeight = pointR.y + (point10.y - point15l.y) * 1/3;
    //     //set the heights for 4low and 5low at qHeight
    //     status.pattern.points['4low'] = setPoint(point4.x, qHeight, {}, false);
    //     status.pattern.points['5low'] = setPoint(point5.x, qHeight, {}, false);
    //     let point4low = status.pattern.points['4low'];
    //     let point5low = status.pattern.points['5low'];
    //     //set the heights for 6low and 7low at rHeight
    //     status.pattern.points['6low'] = setPoint(point6.x, rHeight, {}, false);
    //     status.pattern.points['7low'] = setPoint(point7.x, rHeight, {}, false);
    //     let point6low = status.pattern.points['6low'];
    //     let point7low = status.pattern.points['7low'];

    //     //make touch points for the curves V to 4low and 5low, and W to 6low and 7low
    //     let curveControl = 0.75;
    //     let lowerCurve = 2/3;
    //     status.pattern.points['V_4low'] = makeTouchPoint(status, point4low, pointV, 4, curveControl, false);
    //     status.pattern.points['V_5low'] = makeTouchPoint(status, pointV, point5low, 1, curveControl, false);
    //     status.pattern.points['W_6low'] = makeTouchPoint(status, point6low, pointW, 4, curveControl, false);
    //     status.pattern.points['W_7low'] = makeTouchPoint(status, pointW, point7low, 1, curveControl, false);
    //     let pointV_4low = status.pattern.points['V_4low'];
    //     let pointV_5low = status.pattern.points['V_5low'];
    //     let pointW_6low = status.pattern.points['W_6low'];
    //     let pointW_7low = status.pattern.points['W_7low'];

    //     //measure the distance from V to 4low
    //     let distV4low = point4low.y - pointV.y;
    //     //measure the distance from W to 6low
    //     let distW6low = point6low.y - pointW.y;

    //     //move touch points down, using lowerCurve
    //     pointV_4low.y = pointV.y + (distV4low * lowerCurve);
    //     pointV_5low.y = pointV.y + (distV4low * lowerCurve);
    //     pointW_6low.y = pointW.y + (distW6low * lowerCurve);
    //     pointW_7low.y = pointW.y + (distW6low * lowerCurve);
    //     status.pattern.points['V_4low'] = pointV_4low;
    //     status.pattern.points['V_5low'] = pointV_5low;
    //     status.pattern.points['W_6low'] = pointW_6low;
    //     status.pattern.points['W_7low'] = pointW_7low;

    //     //draw curves from V to 4low and 5low, touching 4 and 5
    //     status = setCurve(status, {start: 'V', touch: 'V_4low', end: '4low'});
    //     status = setCurve(status, {start: 'V', touch: 'V_5low', end: '5low'});
    //     //draw curves from W to 6low and 7low, touching 6 and 7
    //     status = setCurve(status, {start: 'W', touch: 'W_6low', end: '6low'});
    //     status = setCurve(status, {start: 'W', touch: 'W_7low', end: '7low'});

    //     //draw lines from 10 to 4low, 5low to 6low, and 7low to 15l
    //     status = setLine(status, '10', '4low');
    //     status = setLine(status, '5low', '6low');
    //     status = setLine(status, '7low', '15l');

    //     //draw line from 15r to 17
    //     status = setLine(status, '15r', '17');

    //     //point16low is 1/2 inch below point 16
    //     let point16low = setPoint(point16.x, point16.y + inchesToPrecision(status, 1/2), {}, false);
    //     status.pattern.points['16low'] = point16low;
    //     //draw a curve from 16low to 17, make new touch point
    //     status.pattern.points['16low_17'] = makeTouchPoint(status, point17, point16low, 1, 0.33, false);
    //     status = setCurve(status, {start: '17', touch: '16low_17', end: '16low'});

    //     //draw curve from 8z to 16low, touching 11
    //     status = setCurve(status, {start: '8z', touch: '11', end: '16low'});

    //     //create Dlow, following D down to match 16low
    //     let pointD = status.pattern.points['D'];
    //     let pointDlow = setPoint(pointD.x, pointD.y + inchesToPrecision(status, 1/2), {}, false);
    //     status.pattern.points['Dlow'] = pointDlow;

    //     status = setLine(status, 'D', 'Dlow');

    //     status = setLine(status, 'Dlow', 'C');

    //     //make last curve from X to 8
    //     let pointX = status.pattern.points['X'];
    //     let point8 = status.pattern.points['8'];
    //     //make touch point, from X to 8, 1/8 inch right of X
    //     let dist8X = inchesToPrecision(status, 1/8);

    //     let pointX_8 = makeTouchPoint(status, pointX, point8, 0, dist8X, false);

    //     status = registerPoint(status, pointX_8, 'X_8');

    //     status = setCurve(status, {s: 'X', t: 'X_8', e: '8'});

    //     //let's try adding a label
    //     let pointP = status.pattern.points['P'];
    //     let frontLabelPoint = setPoint(pointP.x - 20, pointP.y + 20);

    //     // //side
    //     let point15 = status.pattern.points['15'];
    //     let sideLabelPoint = setPoint(point15.x + 10, point15.y - 5);
    //     // //side back
    //     let sideBackLabelPoint = setPoint(point17.x + 10, point17.y - 5);

    //     let point11 = status.pattern.points['11'];
    //     let backLabelPoint = setPoint(point11.x + 15, point11.y + 20);
    //     //default size for labels
    //     let defaultSize = 18;

    //     let parts = {
    //       'front': {
    //         point: frontLabelPoint,
    //         size: defaultSize,
    //         direction: 'up',
    //       },
    //       'side': {
    //         point: sideLabelPoint,
    //         size: defaultSize,
    //         direction: 'up',
    //       },
    //       'side back': {
    //         point: sideBackLabelPoint,
    //         size: defaultSize,
    //         direction: 'up',
    //       },
    //       'back': {
    //         point: backLabelPoint,
    //         size: defaultSize,
    //         direction: 'up',
    //       }
    //     }

    //     status = registerLabels(status, parts);


    //     return status;
    //   }
    // }
]



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

  console.log(`c: ${c}, c in inches: ${c / status.precision}`);
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

  console.log(`A1 distance: ${a1Dist * status.precision}, in inches: ${a1Dist }`);
  return a1Dist * status.precision; //return in precision units

}

export const alice_bodice_lining = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}