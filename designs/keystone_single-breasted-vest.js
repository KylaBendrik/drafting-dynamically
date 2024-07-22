import {
  inchesToPrecision,
  setPoint,
  setLine,
  setPointLineY,
  setPointLineX,
  setPointAlongLine,
  setCurve,
  printMeasure,
  printNum,
  perimeterEllipse
} from '../pattern.js';

const design_info = {
  title: 'Keystone - Single Breasted Vest',
  source: {
    link: 'https://archive.org/details/keystonejacketdr00heck/page/66/mode/2up',
    label: 'The Keystone Jacket and Dress Cutter (pg 66)'
  },
  designer: 'Charles Hecklinger'
}

let measurements = {
  backLength: {label: "Back Length", value: 15},
  frontLength: {label: "Front Length", value: 18.25},
  blade: {label: "Blade", value: 10},
  heightUnderArm: {label: "Height Under Arm", value: 7.5},
  breast: {label: "Breast", value: 36},
  waist: {label: "Waist", value: 25},
  lengthOfFront: {label: "Length of Front", value: 23},
  shoulder: {label: "Desired Shoulder Change", value: 1},
  neckline: {label: "Neckline", value: 10}
};

//all distances are in inches * precision
// starting point (in this case 'O') is always 0,0. All other points are defined in relation to this point. Negatives are expected

const steps = [
  {
      description: (_status) => {return 'Set point O in upper right of canvas'},
      action: (status) => {
          status.pattern.points['O'] = setPoint(0, 0,{ d: true, l: true });
          return status;
      }
  },
  {
      description: (_status) => {return 'Point 1 is 3/4 inch down from O'},
      action: (status) => {
          status.pattern.points['1'] = setPoint(0, inchesToPrecision(status, 3/4));
          return status;
      }
  },
  {
      description: (status) => {return `From point 1, go down the back length ${printMeasure(status.design.measurements.backLength)} to define point B`},
      action: (status) => {
          status.pattern.points['B'] = setPoint(0, inchesToPrecision(status, parseFloat(status.design.measurements.backLength.value)), { l: true });
          return status;
      }
  },
  {
      description: (status) => {return `From point B, go up the height under arm ${printMeasure(status.measurements.heightUnderArm)} to define point A`},
      action: (status) => {
          let pointB = status.pattern.points['B'];
          status.pattern.points['A'] = setPoint(0, pointB.y - inchesToPrecision(status, parseFloat(status.measurements.heightUnderArm.value)), { l: true });
          return status;
      }
  },
  {
      description: (status) => {return `B to D is 1/24 breast ${printMeasure(status.measurements.breast, 1/24)} to the left of B`},
      action: (status) => {
          let pointB = status.pattern.points['B'];
          status.pattern.points['D'] = setPoint(pointB.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 24), pointB.y);
          return status;
      }
  },
  {
      description: (_status) => {return 'Draw back line from 1 to D'},
      action: (status) => {
          status = setLine(status, '1', 'D');
          return status;
      }
  },
  {
      description: (_status) => {return 'Point A1 is where the line 1-D crosses line extending left from A'},
      action: (status) => {
          let point1 = status.pattern.points['1'];
          let pointA = status.pattern.points['A'];
          let pointD = status.pattern.points['D'];
          status.pattern.points['A1'] = setPointLineY(status, point1, pointD, pointA.y);
          return status;
      }
  },
  {
    description: (status) => {return `Point K is the blade measure ${printMeasure(status.measurements.blade)} left from A1`},
    action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointA1 = status.pattern.points['A1'];
        status.pattern.points['K'] = setPoint(pointA1.x - inchesToPrecision(status, blade), pointA1.y, {u: true, d: true});
        return status;
    }
  },
  {
    description: (status) => {return `Point L is 3/8 of the blade measure ${printMeasure(status.measurements.blade, 3/8)} right of K`},
    action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        const pointK = status.pattern.points['K'];
        status.pattern.points['L'] = setPoint(pointK.x + inchesToPrecision(status, blade * 3/8), pointK.y, {u: true, d: true});
        return status;
    }
  },
  {
    description: (_status) => {return `Point J is at the intersection of the line down from K and the line left from B`},
    action: (status) => {
        const pointK = status.pattern.points['K'];
        const pointB = status.pattern.points['B'];
        status.pattern.points['J'] = setPoint(pointK.x, pointB.y);
        return status;
    }
  },
  {
    description: (status) => {return `Point 2 is 3/16 of the blade measure ${printMeasure(status.measurements.blade, 3/16)} left from O`},
    action: (status) => {
        const blade = parseFloat(status.measurements.blade.value);
        status.pattern.points['2'] = setPoint(0 - inchesToPrecision(status, blade * 3/16), 0);
        //draw curve from 2 to 1, centered around O
        console.log(status)
        status = setCurve(status, '1', '2', 3);
        return status;
    }
  },
  { 
    description: (_status) => {return `Point G is 1/2 the breast measure ${printMeasure(_status.measurements.breast, 1/2)} to the left of A1`},
    action: (status) => {
        const pointA1 = status.pattern.points['A1'];
        status.pattern.points['G'] = setPoint(pointA1.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 2), pointA1.y);
        return status;
    }
  },
  {
    description: (_status) => {return `Point P is halfway between points G and K. Draw guide up from P`},
    action: (status) => {
        const pointG = status.pattern.points['G'];
        const pointK = status.pattern.points['K'];
        status.pattern.points['P'] = setPoint((pointG.x + pointK.x) / 2, pointG.y, {u: true});
        return status;
    }
  },
  {
    description: (_status) => {
      return `Point E is found by going up the front length - the width of top of back from 1 inch to the left of J up to meet the line up from P. E may be above or below the top line.`},
    action: (status) => {
      const pointJ = status.pattern.points['J'];
      const pointP = status.pattern.points['P'];
      status.pattern.points['E'] = findPointE(status, pointJ, pointP);
      return status;
    }
  },
  {
    description: (status) => {return `Point F is 1/12 breast ${printMeasure(status.measurements.breast, 1/12)} to the left of E`},
    action: (status) => {
      const pointE = status.pattern.points['E'];
      status.pattern.points['F'] = setPoint(pointE.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 12), pointE.y);
      return status;
    }
  },
  {
    description: (_status) => {return `Draw line from F through G, extending below the waist line`},
    action: (status) => {
      status = setLine(status, 'F', 'G', 'dashed', 'continued');
      return status;
    }
  },
  {  description: (_status) => {return `Point N is on this line from F to G, 1/12 of the breast down from F`},
    action: (status) => {
      const pointF = status.pattern.points['F'];
      const pointG = status.pattern.points['G'];
      const dist = parseFloat(status.measurements.breast.value) / 12;
      status.pattern.points['N'] = setPointAlongLine(status, pointF, pointG, dist);
      return status;
    }
  },
  {
    description: (status) => {return `Point Y is 3/4 ${printNum(distOtoA(status) * 3/4)} of the way up from L to the line from O`},
    action: (status) => {
      const pointL = status.pattern.points['L'];
      const pointO = status.pattern.points['O'];
      const x = pointL.x;
      const y = pointO.y + (pointL.y - pointO.y) * 1/4;
      status.pattern.points['Y'] = setPoint(x, y);
      return status;
    }
  },
  {
    description: (status) => {return `Point Z is 5/8 ${printNum(distOtoA(status) * 5/8)} of the way up from L to the line from O`},
    action: (status) => {
      const pointL = status.pattern.points['L'];
      const pointO = status.pattern.points['O'];
      const x = pointL.x;
      const y = pointO.y + (pointL.y - pointO.y) * 3/8;
      status.pattern.points['Z'] = setPoint(x, y);
      return status;
    }
  },
  {
    description: (status) => {return `Point 9 is 1/6 of the breast ${printMeasure(status.measurements.breast, 1/6)} to the left of O`},
    action: (status) => {
      status.pattern.points['9'] = setPoint(-inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 6), 0, {d: true});
      return status;
    }
  },
  {
    description: (_status) => {return `Draw line from 2 to Z, and one from E to Y`},
    action: (status) => {
      status = setLine(status, '2', 'Z', 'dashed');
      status = setLine(status, 'E', 'Y', 'dashed');
      return status;
    }
  },
  {
    description: (_status) => {return `Point X is where the line from 2 to Z crosses the line down from 9`},
    action: (status) => {
      const point2 = status.pattern.points['2'];
      const pointZ = status.pattern.points['Z'];
      const point9 = status.pattern.points['9'];
      let x9 = 0 + point9.x;
      status.pattern.points['X'] = setPointLineX(status, point2, pointZ, x9);
      return status;
    }
  },
  {
    description: (status) => {return `Point 3 is the desired shoulder change ${printMeasure(status.measurements.shoulder)} closer to point 2 along the line from 2 to X`},
    action: (status) => {
      const point2 = status.pattern.points['2'];
      const pointX = status.pattern.points['X'];
      status.pattern.points['3'] = setPointAlongLine(status, pointX, point2, parseFloat(status.measurements.shoulder.value));
      status = setLine(status, '2', '3');
      return status;
    }
  },
  {
    description: (_status) => {return `Point 14 is along the line from E to Y, the same distance as 3 to 2`},
    action: (status) => {
      const pointE = status.pattern.points['E'];
      const pointY = status.pattern.points['Y'];
      const point2 = status.pattern.points['2'];
      const point3 = status.pattern.points['3'];
      const a = Math.abs(point3.x - point2.x);
      const b = Math.abs(point3.y - point2.y);
      const c = a * a + b * b;
      const distance = Math.sqrt(c);
      status.pattern.points['14'] = setPointAlongLine(status, pointY, pointE, distance / status.precision);
      status = setLine(status, '14', 'E');
      return status;
    }
  },
  {
    description: (status) => {return `Point 12 is 1/4 the breast measurement ${printMeasure(status.measurements.breast, 1/4)} from A1 to G`},
    action: (status) => {
      const pointA1 = status.pattern.points['A1'];
      const pointG = status.pattern.points['G'];
      const dist = parseFloat(status.measurements.breast.value) / 4;
      status.pattern.points['12'] = setPointAlongLine(status, pointA1, pointG, dist);
      return status;
    }
  },
  {
    description: (_status) => {return `Point 00 is the same distance as Z to X, left of K, and halfway between Z and K up from K`},
    action: (status) => {
      const pointZ = status.pattern.points['Z'];
      const pointX = status.pattern.points['X'];
      const pointK = status.pattern.points['K'];
      const a = Math.abs(pointZ.x - pointX.x);
      const b = Math.abs(pointZ.y - pointX.y);
      const c = a * a + b * b;
      const xdistance = Math.sqrt(c);
      status.pattern.points['00'] = setPoint(pointK.x - xdistance, (pointK.y + pointZ.y)/2, {u: true, d: true});
      return status;
    }
  },
  {
    description: (_status) => {return `curve the armhole from 00 to 12, from 14 to 12, and from 00 to 3`},
    action: (status) => {
      status = setCurve(status, '12', '3', 2);
      status = setCurve(status, '00', '12', 3);
      status = setCurve(status, '14', '00', 4);
      return status;
    }
  },
  {
    description: (status) => {return `To start making the darts, divide the distance from G to K into 3 parts ${printNum(((parseFloat(status.measurements.breast.value) / 2) - parseFloat(status.measurements.blade.value)) / 3)}, giving points S and T.`},
    action: (status) => {
      const pointG = status.pattern.points['G'];
      const pointK = status.pattern.points['K'];
      const dist = Math.round((pointG.x - pointK.x) / 3);
      status.pattern.points['S'] = setPoint(pointG.x - dist, pointG.y);
      status.pattern.points['T'] = setPoint(pointG.x - (dist * 2), pointG.y);
      return status;
    }
  },
  { 
    description: (_status) => {return `Point U is 1/2 inch right of S`},
    action: (status) => {
      const pointS = status.pattern.points['S'];
      status.pattern.points['U'] = setPoint(pointS.x + inchesToPrecision(status, 1), pointS.y);
      return status;
    }
  },
  {
    description: (_status) => {return `Point H is at the height of B, where the line extends from F through G`},
    action: (status) => {
      const pointF = status.pattern.points['F'];
      const pointG = status.pattern.points['G'];
      const pointB = status.pattern.points['B'];
      status.pattern.points['H'] = setPointLineY(status, pointF, pointG, pointB.y);
      status = setLine(status, 'G', 'H', 'dashed');
      return status;
    }
  },
  {
    description: (_status) => {return `Also divide H to J into three parts to give points Q and R `},
    action: (status) => {
      const pointH = status.pattern.points['H'];
      const pointJ = status.pattern.points['J'];
      const dist = (pointH.x - pointJ.x) / 3;
      status.pattern.points['Q'] = setPoint(pointH.x - dist, pointH.y);
      status.pattern.points['R'] = setPoint(pointH.x - (dist * 2), pointH.y);
      return status;
    }
  },
  {
    description: (_status) => {return `Draw two lines, one from U to Q and one from T to R, continuing below the waist line`},
    action: (status) => {
      status = setLine(status, 'U', 'Q', 'dashed', 'continued');
      status = setLine(status, 'T', 'R', 'dashed', 'continued');
      return status;
    }
  },
  {
    description: (_status) => {return `To find the dart difference, measure along the waistline from D to H and subract 1 inch. Then subtract half the waist to get the difference. Each dart will get half of this equally on either side of points Q (which makes points 4 and 5) and R (to make points 6 and 7).`},
    action: (status) => {
      const pointD = status.pattern.points['D'];
      const pointH = status.pattern.points['H'];
      const pointQ = status.pattern.points['Q'];
      const pointR = status.pattern.points['R'];
      const dist = Math.abs(pointH.x - pointD.x) - inchesToPrecision(status, 1);

      const waist = (parseFloat(status.measurements.waist.value) * status.precision) / 2;
      const diff = (dist - waist) / 4;
      console.log(`dist: ${dist}, waist: ${waist}, diff: ${diff}`);
      status.pattern.points['4'] = setPoint(pointQ.x - diff, pointQ.y, {d: true});
      status.pattern.points['5'] = setPoint(pointQ.x + diff, pointQ.y);
      status.pattern.points['6'] = setPoint(pointR.x - diff, pointR.y, {d: true});
      status.pattern.points['7'] = setPoint(pointR.x + diff, pointR.y);
      console.log(status);
      return status;
    }
  },
  {
    description: (_status) => {return `Point V is 1/3 of the way from U to Q, and W between T and R a half an inch higher than V`},
    action: (status) => {
      const pointU = status.pattern.points['U'];
      const pointQ = status.pattern.points['Q'];
      const pointT = status.pattern.points['T'];
      const pointR = status.pattern.points['R'];
      const a = Math.abs(pointU.x - pointQ.x);
      const b = Math.abs(pointU.y - pointQ.y);
      const dist = Math.round(Math.sqrt(a * a + b * b) / 3) / status.precision;
      status.pattern.points['V'] = setPointAlongLine(status, pointU, pointQ, dist);
      const wY = status.pattern.points['V'].y - inchesToPrecision(status, 0.5);
      status.pattern.points['W'] = setPointLineY(status, pointT, pointR, wY);
      
      status = setLine(status, 'V', '4');
      status = setLine(status, 'V', '5');
      status = setLine(status, 'W', '6');
      status = setLine(status, 'W', '7');
      return status;
    }
  },
  {
    description: (status) => {return `Point 9b is 1/4 of the waist ${printMeasure(status.measurements.waist,  - 1/4)} - 1 inch  to the left of D`},
    action: (status) => {
      const pointD = status.pattern.points['D'];
      const waist = parseFloat(status.measurements.waist.value) / 4;
      const distD9 = inchesToPrecision(status, waist - 1)
      console.log(`distD9 = ${waist} + 1 = ${distD9}`);
      status.pattern.points['9b'] = setPoint(pointD.x - distD9, pointD.y, {d: true});
      return status;
    }
  },
  {
    description: (_status) => {return `From the front at H to 4, 5 to 6, and 7 to 8, place another 1/4 of the waist - 1 inch to find point 8`},
    action: (status) => {
      const pointH = status.pattern.points['H'];
      const point4 = status.pattern.points['4'];
      const point5 = status.pattern.points['5'];
      const point6 = status.pattern.points['6'];
      const point7 = status.pattern.points['7'];
      const distH4 = Math.abs(pointH.x - point4.x)
      const dist56 = Math.abs(point5.x - point6.x)
      const waist = ((parseFloat(status.measurements.waist.value) / 4 - 1) * status.precision);
      const dist78 = Math.abs(waist - distH4 - dist56);
      status.pattern.points['8'] = setPoint(point7.x + dist78, pointH.y, {d:true});
      status = setLine(status, '12', '8');
      status = setLine(status, '12', '9b');
      return status;
    }
  },
  {
    description: (_status) => {return `Point 15 is 3/8 of the blade measure left of A1 and 1/2 inch below V`},
    action: (status) => {
      const blade = parseFloat(status.measurements.blade.value);
      const pointA1 = status.pattern.points['A1'];
      const pointV = status.pattern.points['V'];
      status.pattern.points['15'] = setPoint(pointA1.x - inchesToPrecision(status, blade * 3/8), pointV.y + inchesToPrecision(status, 0.5));
      return status;
    }
  }
];

function widthTopBack(status){
  console.log(status);
  //returns the width of the top of the back, the quarter ellipse 1-2 around O
  const point1 = status.pattern.points['1'];

  //const point1 = {x: 20, y: 0};
  const point2 = status.pattern.points['2']; 
  const center = status.pattern.points['O'];
  const p = perimeterEllipse(status, center, point1, point2);
  return p / 4;
}

function findPointE(status, pointJ, pointP){
  const pointj = setPoint(pointJ.x - (1 * status.precision), pointJ.y);
  const frontLength = parseFloat(status.design.measurements.frontLength.value) * status.precision;

  //the "width of top back" not clear in the instructions. But it seems that 1/12 of the breast value gets the right result
  //I did try from O to 2, as well as finding the circumference of the ellipse, but neither seemed to work.
  const wtb2 = Math.abs(parseFloat(status.design.measurements.breast.value) / 12 * status.precision);
  //we need to find the y for point E
  //we have a triangle, with lines a, b, and c.
  //a is along x, from pointj to pointP
  const a = Math.abs(pointP.x - pointj.x);
  const c = frontLength - wtb2;
  //b is along y, on x of point P.
  //a^2 + b^2 = c^2
  //b = sqrt(c^2 - a^2)
  const b = Math.round(Math.sqrt(c * c - a * a));
  const ey = Math.round(pointJ.y - b);
  return setPoint(pointP.x, ey, {l: true});
}

function distOtoA(status){
  const b = status.measurements.backLength.value + 0.75;
  const a = status.measurements.heightUnderArm.value;
  return b - a;
}

export default { design_info, measurements, steps };
