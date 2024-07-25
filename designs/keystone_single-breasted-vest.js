import {
  inchesToPrecision,
  setPoint,
  setLine,
  setPointLineY,
  setPointLineX,
  setPointAlongLine,
  setPointLineCircle,
  setPointLineLine,
  setCurve,
  distPointToPoint,
  distABC,
  printNum,
  printMeasure,
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
  backLength: { label: "Back Length", value: 15 },
  frontLength: { label: "Front Length", value: 18.25 },
  blade: { label: "Blade", value: 10 },
  heightUnderArm: { label: "Height Under Arm", value: 7.5 },
  breast: { label: "Breast", value: 36 },
  waist: { label: "Waist", value: 25 },
  lengthOfFront: { label: "Length of Front", value: 23 },
  shoulder: { label: "Desired Shoulder Change", value: 1, step: 0.25 },
  neckline: { label: "Neckline", value: 10 }
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
      description: (status) => {return `From point 1, go down the back length ${printMeasure(status.design.measurements.backLength)} to define point B`},
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
    description: (status) => { return `B to D is 1/24 breast ${printMeasure(status.measurements.breast, 1 / 24)} to the left of B` },
    action: (status) => {
      let pointB = status.pattern.points['B'];
      status.pattern.points['D'] = setPoint(pointB.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 24), pointB.y);
      return status;
    }
  },
  {
    description: (_status) => { return 'Draw back line from 1 to D' },
    action: (status) => {
      status = setLine(status, '1', 'D');
      return status;
    }
  },
  {
    description: (_status) => { return 'Point A1 is where the line 1-D crosses line extending left from A' },
    action: (status) => {
      let point1 = status.pattern.points['1'];
      let pointA = status.pattern.points['A'];
      let pointD = status.pattern.points['D'];
      status.pattern.points['A1'] = setPointLineY(status, point1, pointD, pointA.y);
      return status;
    }
  },
  {
    description: (status) => { return `Point K is the blade measure ${printMeasure(status.measurements.blade)} left from A1` },
    action: (status) => {
      const blade = parseFloat(status.measurements.blade.value);
      const pointA1 = status.pattern.points['A1'];
      status.pattern.points['K'] = setPoint(pointA1.x - inchesToPrecision(status, blade), pointA1.y, { u: true, d: true });
      return status;
    }
  },
  {
    description: (status) => { return `Point L is 3/8 of the blade measure ${printMeasure(status.measurements.blade, 3 / 8)} right of K` },
    action: (status) => {
      const blade = parseFloat(status.measurements.blade.value);
      const pointK = status.pattern.points['K'];
      status.pattern.points['L'] = setPoint(pointK.x + inchesToPrecision(status, blade * 3 / 8), pointK.y, { u: true, d: true });
      return status;
    }
  },
  {
    description: (_status) => { return `Point J is at the intersection of the line down from K and the line left from B` },
    action: (status) => {
      const pointK = status.pattern.points['K'];
      const pointB = status.pattern.points['B'];
      status.pattern.points['J'] = setPoint(pointK.x, pointB.y);
      return status;
    }
  },
  {
    description: (status) => { return `Point 2 is 3/16 of the blade measure ${printMeasure(status.measurements.blade, 3 / 16)} left from O` },
    action: (status) => {
      const blade = parseFloat(status.measurements.blade.value);
      status.pattern.points['2'] = setPoint(0 - inchesToPrecision(status, blade * 3 / 16), 0);
      
      status = setCurve(status, {start: '1', end: '2'}, 3, 'ellipse');
      return status;
    }
  },
  {
    description: (_status) => { return `Point G is 1/2 the breast measure ${printMeasure(_status.measurements.breast, 1 / 2)} to the left of A1` },
    action: (status) => {
      const pointA1 = status.pattern.points['A1'];
      status.pattern.points['G'] = setPoint(pointA1.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 2), pointA1.y);
      return status;
    }
  },
  {
    description: (_status) => { return `Point P is halfway between points G and K. Draw guide up from P` },
    action: (status) => {
        const pointG = status.pattern.points['G'];
        const pointK = status.pattern.points['K'];
        const diffGK = Math.abs(pointG.x - pointK.x);
        
        status.pattern.points['P'] = setPoint((pointG.x + pointK.x) / 2, pointG.y, {u: true});
        return status;
    }
  },
  {
    description: (_status) => {
      return `Point E is found by going up the front length - the width of top of back from 1 inch to the left of J up to meet the line up from P. E may be above or below the top line.`
    },
    action: (status) => {
      const pointJ = status.pattern.points['J'];
      const pointP = status.pattern.points['P'];
      status.pattern.points['E'] = findPointE(status, pointJ, pointP);
      return status;
    }
  },
  {
    description: (status) => { return `Point F is 1/12 breast ${printMeasure(status.measurements.breast, 1 / 12)} to the left of E` },
    action: (status) => {
      const pointE = status.pattern.points['E'];
      status.pattern.points['F'] = setPoint(pointE.x - inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 12), pointE.y);
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
      
      return status;
    }
  },
  {
    description: (status) => { return `Point Y is 3/4 ${printNum(distOtoA(status) * 3 / 4)} of the way up from L to the line from O` },
    action: (status) => {
      const pointL = status.pattern.points['L'];
      const pointO = status.pattern.points['O'];
      const x = pointL.x;
      const y = pointO.y + (pointL.y - pointO.y) * 1 / 4;
      status.pattern.points['Y'] = setPoint(x, y);
      return status;
    }
  },
  {
    description: (status) => { return `Point Z is 5/8 ${printNum(distOtoA(status) * 5 / 8)} of the way up from L to the line from O` },
    action: (status) => {
      const pointL = status.pattern.points['L'];
      const pointO = status.pattern.points['O'];
      const x = pointL.x;
      const y = pointO.y + (pointL.y - pointO.y) * 3 / 8;
      status.pattern.points['Z'] = setPoint(x, y);
      return status;
    }
  },
  {
    description: (status) => { return `Point 9 is 1/6 of the breast ${printMeasure(status.measurements.breast, 1 / 6)} to the left of O` },
    action: (status) => {
      status.pattern.points['9'] = setPoint(-inchesToPrecision(status, parseFloat(status.measurements.breast.value) / 6), 0, { d: true });
      return status;
    }
  },
  {
    description: (_status) => { return `Draw line from 2 to Z, and one from E to Y` },
    action: (status) => {
      status = setLine(status, '2', 'Z', 'dashed');
      status = setLine(status, 'E', 'Y', 'dashed');
      return status;
    }
  },
  {
    description: (_status) => { return `Point X is where the line from 2 to Z crosses the line down from 9` },
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
    description: (status) => { return `Point 3 is the desired shoulder change ${printMeasure(status.measurements.shoulder)} closer to point 2 along the line from 2 to X` },
    action: (status) => {
      const point2 = status.pattern.points['2'];
      const pointX = status.pattern.points['X'];
      status.pattern.points['3'] = setPointAlongLine(status, pointX, point2, parseFloat(status.measurements.shoulder.value));
      status = setLine(status, '2', '3');
      return status;
    }
  },
  {
    description: (_status) => { return `Point 14 is along the line from E to Y, the same distance as 3 to 2` },
    action: (status) => {
      const pointE = status.pattern.points['E'];
      const pointY = status.pattern.points['Y'];
      const point2 = status.pattern.points['2'];
      const point3 = status.pattern.points['3'];
      const a = Math.abs(point3.x - point2.x);
      const b = Math.abs(point3.y - point2.y);
      const c = a * a + b * b;
      const distance = Math.sqrt(c);
      status.pattern.points['14'] = setPointAlongLine(status, pointE, pointY, distance / status.precision);
      status = setLine(status, '14', 'E');
      return status;
    }
  },
  {
    description: (status) => { return `Point 12 is 1/4 the breast measurement ${printMeasure(status.measurements.breast, 1 / 4)} from A1 to G` },
    action: (status) => {
      const pointA1 = status.pattern.points['A1'];
      const pointG = status.pattern.points['G'];
      const dist = parseFloat(status.measurements.breast.value) / 4;
      status.pattern.points['12'] = setPointAlongLine(status, pointA1, pointG, dist);
      return status;
    }
  },
  {
    description: (_status) => {return `Point 00 is the same distance as Z.x to X.x, left of K, and halfway between Z and K up from K`},
    action: (status) => {
      const pointZ = status.pattern.points['Z'];
      const pointX = status.pattern.points['X'];
      const pointK = status.pattern.points['K'];
      const xdistance = Math.abs(pointZ.x - pointX.x);
      const point00 = setPoint(pointK.x - xdistance, (pointK.y + pointZ.y)/2, {u: true, d: true}, );
      status.pattern.points['00'] = point00;
      status.pattern.points['00K'] = setPoint(point00.x, pointK.y, {}, false);
      return status;
    }
  },
  {
    description: (_status) => { return `curve the armhole from 00 to 12, from 14 to 12, and from 00 to 3` },
    action: (status) => {
      
      status = setCurve(status, {start:'14', touch: '00', end: '12'}, 0, 'bezier');
      status = setCurve(status, {start: '3', end: '12'}, 2, 'ellipse')
      return status;
    }
  },
  {
    description: (status) => { return `To start making the darts, divide the distance from G to K into 3 parts ${printNum(((parseFloat(status.measurements.breast.value) / 2) - parseFloat(status.measurements.blade.value)) / 3)}, giving points S and T.` },
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
    description: (_status) => { return `Point U is 1/2 inch right of S` },
    action: (status) => {
      const pointS = status.pattern.points['S'];
      status.pattern.points['U'] = setPoint(pointS.x + inchesToPrecision(status, 0.5), pointS.y);
      return status;
    }
  },
  {
    description: (_status) => { return `Point H is at the height of B, where the line extends from F through G` },
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
    description: (_status) => { return `Also divide H to J into three parts to give points Q and R ` },
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
    description: (_status) => { return `Draw two lines, one from U to Q and one from T to R, continuing below the waist line` },
    action: (status) => {
      status = setLine(status, 'U', 'Q', 'dashed', 'continued');
      status = setLine(status, 'T', 'R', 'dashed', 'continued');
      return status;
    }
  },
  {
    description: (_status) => { return `To find the dart difference, measure along the waistline from D to H and subract 1 inch. Then subtract half the waist to get the difference. Each dart will get half of this equally on either side of points Q (which makes points 4 and 5) and R (to make points 6 and 7).` },
    action: (status) => {
      const pointD = status.pattern.points['D'];
      const pointH = status.pattern.points['H'];
      const pointQ = status.pattern.points['Q'];
      const pointR = status.pattern.points['R'];
      const dist = Math.abs(pointH.x - pointD.x) - inchesToPrecision(status, 1);

      const waist = (parseFloat(status.measurements.waist.value) * status.precision) / 2;
      const diff = (dist - waist) / 4;
      const dart = diff * 2

      let point4 = setPoint(pointQ.x - diff, pointQ.y);
      let point5 = setPoint(point4.x + dart, pointQ.y);
      let point6 = setPoint(pointR.x - diff, pointR.y);
      let point7 = setPoint(pointR.x + diff, pointR.y);

      //set a minimum of 1/2 between the edges
      const minimum = inchesToPrecision(status, 0.75);

      //point 4
      if (point4.x - pointH.x < minimum) {
        point4 = setPoint(pointH.x + minimum, pointQ.y);
      } else {
        point4 = setPoint(pointQ.x - diff, pointQ.y);
      }

      point5 = setPoint(point4.x + dart, pointQ.y);
      point6 = setPoint(pointR.x - diff, pointR.y);
      
      if (point6.x - point5.x < minimum) {
        //if it gets too small, set this section at 0.5, and modify 4 as necessary
        point6 = setPoint(point5.x + minimum, pointR.y);
      }
      
      point7 = setPoint(point6.x + dart, pointR.y);

      status.pattern.points['4'] = point4;
      status.pattern.points['5'] = point5;
      status.pattern.points['6'] = point6;
      status.pattern.points['7'] = point7;
      return status;
    }
  },
  {
    description: (_status) => { return `Point V is 1/3 of the way from U to Q, and W between T and R a half an inch higher than V` },
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

      return status;
    }
  },
  {
    description: (status) => { return `Point 9b is 1/4 of the waist ${printMeasure(status.measurements.waist, - 1 / 4)} + 1 inch  to the left of D` },
    action: (status) => {
      const pointD = status.pattern.points['D'];
      const waist = parseFloat(status.measurements.waist.value) / 4;
      const distD9 = inchesToPrecision(status, waist + 1)
      status.pattern.points['9b'] = setPoint(pointD.x - distD9, pointD.y);
      return status;
    }
  },
  {
    description: (_status) => { return `From the front at H to 4, 5 to 6, and 7 to 8, place another 1/4 of the waist - 1 inch to find point 8` },
    action: (status) => {
      const pointH = status.pattern.points['H'];
      const point4 = status.pattern.points['4'];
      const point5 = status.pattern.points['5'];
      const point6 = status.pattern.points['6'];
      const point7 = status.pattern.points['7'];
      const distH4 = Math.abs(pointH.x - point4.x)
      const dist56 = Math.abs(point5.x - point6.x)
      const waist = ((parseFloat(status.measurements.waist.value) / 4 - 1.5) * status.precision);
      const dist78 = Math.abs(waist - distH4 - dist56);
      status.pattern.points['8'] = setPoint(point7.x + dist78, pointH.y);

      return status;
    }
  },
  {
    description: (status) => { return `Point M is along the line from F to H, where the length of the front ${printMeasure(status.measurements.lengthOfFront)} from E meets it.` },
    action: (status) => {
      const pointF = status.pattern.points['F'];
      const pointH = status.pattern.points['H'];
      const pointE = status.pattern.points['E'];
      //make a line from pointE. we don't know the angle, but we know the length.
      const wtb = widthTopBack(status);
      const dist = parseFloat(status.measurements.lengthOfFront.value) * status.precision - wtb;
      status.pattern.points['M'] = setPointLineCircle(status, pointF, pointH, pointE, dist);
      return status;
    }
  },
  {
    description: (_status) => { return `Point e is below point 12, 1/2 of the way between 8 and M's height` },
    action: (status) => {
      const point8 = status.pattern.points['8'];
      const pointM = status.pattern.points['M'];
      const point12 = status.pattern.points['12'];
      const y = point8.y - (point8.y - pointM.y) / 2;
      status.pattern.points['e'] = setPoint(point12.x, y, { r: true });
      status = setLine(status, 'e', '12', 'dashed');
      return status;
    }
  },
  {
    description: (_status) => { return `Lowest front point (M1) is 1/2 the distance between H and 4  to the right of M. Draw a dashed line from e to M1` },
    action: (status) => {
      const pointH = status.pattern.points['H'];
      const point4 = status.pattern.points['4'];
      const pointM = status.pattern.points['M'];
      const x = pointM.x + Math.abs(pointH.x - point4.x) / 2;
      status.pattern.points['M1'] = setPoint(x, pointM.y);
      status = setLine(status, 'e', 'M1', 'dashed');
      return status;
    }
  },
  {
    description: (_status) => { return `On the line from M1 to e, points B and D are at thirds.` },
    action: (status) => {
      const pointM1 = status.pattern.points['M1'];
      const pointe = status.pattern.points['e'];
      const dist = Math.round(distPointToPoint(pointM1, pointe) / 3) / status.precision;
      status.pattern.points['b'] = setPointAlongLine(status, pointM1, pointe, dist);
      status.pattern.points['d'] = setPointAlongLine(status, pointM1, pointe, dist * 2);
      return status;
    }
  },
  {
    description: (_status) => { return `True up the other side of the dart from W to 6 to find c` },
    action: (status) => {
      let distdw = distABC(status, 'd', '7', 'W');
      const pointW = status.pattern.points['W'];
      const point6 = status.pattern.points['6'];
      let disty = distdw - distPointToPoint(pointW, point6);
      let y = point6.y + disty;
      status.pattern.points['c'] = setPoint(point6.x, y);
      return status;
    }
  },
  {
    description: (_status) => {return `True up the other side of the dart from V to 4 to find a. M2 is along the line from M to H, at the height halfway between b and c`},
    action: (status) => {
      let distbV = distABC(status, 'b', '5', 'V');
      const pointV = status.pattern.points['V'];
      const pointQ = status.pattern.points['Q'];
      const point4 = status.pattern.points['4'];
      const pointb = status.pattern.points['b'];
      // const disty = distbV - distPointToPoint(pointV, point4);
      // //const y = point4.y + disty;
      // //isntead of straight down, use slope from line V_Q
      // //y = mx + b
      // //m is slope, b is y intercept
      //a is across from 
      const m = (pointV.y - pointQ.y) / (pointV.x - pointQ.x);
      const b = point4.y - m * point4.x; //?
      const y = pointb.y
      const x = (y - b) / m;

      
      status.pattern.points['a'] = setPoint(x, y);
      status = setLine(status, 'M1', 'a');

    
      //front mysterious point
      status.pattern.points['M2'] = setPointLineY(status, status.pattern.points['M'], status.pattern.points['H'], (status.pattern.points['b'].y + status.pattern.points['c'].y) / 2);
      status = setLine(status, 'M1', 'M2');
      return status;
    }
  },
  {
    description: (_status) => { return `Point f is 1/2 inch right of e` },
    action: (status) => {
      const pointe = status.pattern.points['e'];
      status.pattern.points['f'] = setPoint(pointe.x + inchesToPrecision(status, 0.5), pointe.y);

      return status;
    }
  },
  {
    description: (_status) => {return `Point 15 is 12 of the blade measure left of A1 and 1/2 inch below V`},
    action: (status) => {
      const blade = parseFloat(status.measurements.blade.value);
      const pointA1 = status.pattern.points['A1'];
      const pointD = status.pattern.points['D'];
      const point12 = status.pattern.points['12'];
      const point9b = status.pattern.points['9b'];
      const pointV = status.pattern.points['V'];
      const point12_9bIntersect = setPointLineY(status, point12, point9b, pointV.y);
      const pointA1_DIntersect = setPointLineY(status, pointA1, pointD, pointV.y);
      status.pattern.points['15'] = setPoint((pointA1_DIntersect.x + point12_9bIntersect.x) / 2, pointV.y + inchesToPrecision(status, 0.5));
      return status;
    }
  },
  {
    description: (_status) => { return `Point 16 is 1/3 of the way from f to D` },
    action: (status) => {
      const pointf = status.pattern.points['f'];
      const pointD = status.pattern.points['D'];
      const dist = Math.abs(pointf.x - pointD.x) / 3;
      status.pattern.points['16'] = setPoint(pointf.x + dist, pointf.y);
      return status;
    }
  },
  {
    description: (_status) => { return `Point D1 is right below D. Point g is right of f. D to D1 and D1 to g are the same distance` },
    action: (status) => {
      const pointD = status.pattern.points['D'];
      const pointf = status.pattern.points['f'];

      //D1 is in the center, g and D are on the circumference. the line from D1 to D is at 12 o'clock, the line from D1 to G is at 8 o'clock
      let angle = 50;
      const angleRad = angle * (Math.PI / 180);
      let r = (pointD.y - pointf.y) / (1 + Math.sin(angleRad));
      let xg = pointD.x + r * Math.cos(angleRad);

      let pointD1 = { x: pointD.x, y: pointD.y - r };
      let pointG = { x: xg, y: pointf.y };
      status.pattern.points['D1'] = setPoint(pointD1.x, pointD1.y);
      status.pattern.points['D1'].visible = false;
      status.pattern.points['g'] = setPoint(pointG.x, pointG.y);
      status = setLine(status, 'D', 'D1');
      status = setLine(status, 'D1', 'g');
      status = setLine(status, '15', '16', 'dashed');
      status = setLine(status, 'g', 'f', 'dashed');
      return status;
    }
  },
  {
    description:  (_status) => {return `Go left from G to the front 1/2 inch to find G1 and shape the front from N, passing the G1, and touching at H.`},
    action: (status) => {
      const pointG = status.pattern.points['G'];
      const dist = inchesToPrecision(status, 0.5);
      status.pattern.points['G1'] = setPoint(pointG.x - dist, pointG.y);
      
      return status;
    }
  },
  {
    description: (_status) => {return `The form from E to N is for a front to button up to the neck, and usually has a standing collar. If, however, it is desired to have an open front, measure from E down the front line to point 20, the opening wanted, which may be 10, 12 or 14 inches, always remembering that the width of the top of the back must be subtracted.`},
    action: (status) => {
      const pointE = status.pattern.points['E'];
      const pointF = status.pattern.points['F'];
      const pointH = status.pattern.points['H'];
      const pointN = status.pattern.points['N'];
      const pointG1 = status.pattern.points['G1'];
      const wtb = widthTopBack(status);
      //const point20 = setPoint(pointE.x, pointE.y - inchesToPrecision(status, parseFloat(status.design.measurements.neckline.value)));
      const necklineLength = parseFloat(status.design.measurements.neckline.value) * status.precision - wtb;
      const point20 = setPointLineCircle(status, pointF, pointH, pointE, necklineLength);
      status.pattern.points['20'] = point20;
      const point21a = setPointLineLine(status, point20, pointE, pointN, pointG1)
      const point21b = setPointLineLine(status, point20, pointE, pointH, pointG1)

      if(point20.y <= pointN.y){

        status = setCurve(status, {start: 'E', end: 'N'}, 2, 'ellipse', 'dashed');
        status = setCurve(status, {start: 'N', touch: 'G1', end: 'H'}, 0, 'bezier');

        status.pattern.points[`21`] = point21a;
        status.pattern.points[`21`].visible = false
        status.pattern.points[`20`].visible = false
      } else {
        status = setCurve(status, {start: 'E', end: 'N'}, 2, 'ellipse');
      
            //if neckline extends below G1, don't connect to G1
            if(point21a.y < pointG1.y){  

              status.pattern.points[`21`] = point21a;
              
              status = setLine(status, 'E', '21');
               status = setCurve(status, {start: '21', touch: 'G1', end: 'H'}, 0, 'bezier');

            } else {
      
              status.pattern.points[`21`] = point21b;
              
              status = setLine(status, 'E', '21');
              status = setLine(status, '21', 'H');
            }
      }





      status = setLine(status, 'M2', 'H');

      const pointe = status.pattern.points['e'];
      const pointf = status.pattern.points['f'];

      //side seam curves
      const point8 = status.pattern.points['8'];
      const point8a = setPoint(point8.x + inchesToPrecision(status, 1/16), point8.y - inchesToPrecision(status, 1)); 
      status.pattern.points['8a'] = point8a;
      const point9b = status.pattern.points['9b'];
      const point9ba = setPoint(point9b.x + inchesToPrecision(status, 1/16), point9b.y - inchesToPrecision(status, 0.75)); 
      status.pattern.points['9ba'] = point9ba;


      //if 8 is right of e, move it so it works better
      if(point8.x > pointe.x){
        let diff89 = point9b.x - point8.x;
        point8.x = pointe.x - inchesToPrecision(status, 1/4);
        point8a.x = point8.x + inchesToPrecision(status, 1/16);
        point9b.x = point8.x + diff89;
      }

      //if 9 is left of f, move it so it works better
      if(point9b.x < pointf.x){
        let diff89 = point8.x - point9b.x;
        point9b.x = pointf.x + inchesToPrecision(status, 1/4);
        point9ba.x = point9b.x + inchesToPrecision(status, 1/16);
      }



      status = setCurve(status, {start: '12', touch: '8a', end: 'e'}, 0, 'bezier');
      status = setCurve(status, {start: '12', touch: '9ba', end: 'f'}, 0, 'bezier');

      //dart 1 curves
      status = setCurve(status, {start: 'W', touch: '6', end: 'c'}, 0, 'bezier');
      status = setCurve(status, {start: 'W', touch: '7', end: 'd'}, 0, 'bezier');

      //dart 2 curves
      status = setCurve(status, {start: 'V', touch: '4', end: 'a'}, 0, 'bezier');
      status = setCurve(status, {start: 'V', touch: '5', end: 'b'}, 0, 'bezier');

      //back dart
      //make points 15a and 15b, on 1/4 inch on either side of the line from 15 to 16, halfway down the line
      const point15 = status.pattern.points['15'];
      const point16 = status.pattern.points['16'];
      const dist = distPointToPoint(point15, point16) / 2;
      const point15a = setPointAlongLine(status, point15, point16, dist / status.precision);
      const point15b = setPointAlongLine(status, point15, point16, dist / status.precision);

      point15a.x += inchesToPrecision(status, 0.25);
      point15b.x -= inchesToPrecision(status, 0.25);
      point15a.visible = false;
      point15b.visible = false;

      status.pattern.points['15a'] = point15a;
      status.pattern.points['15b'] = point15b;

      const point16a = setPoint(point16.x + inchesToPrecision(status, 1/8), point16.y - inchesToPrecision(status, 1/8));
      const point16b = setPoint(point16.x - inchesToPrecision(status, 1/8), point16.y - inchesToPrecision(status, 1/8));

      point16a.visible = false;
      point16b.visible = false;

      status.pattern.points['16a'] = point16a;
      status.pattern.points['16b'] = point16b;

      status = setCurve(status, {start: '15', touch: '15a', end: '16a'}, 0, 'bezier');
      status = setCurve(status, {start: '15', touch: '15b', end: '16b'}, 0, 'bezier');
      
      //lower edge curves     
      const pointb = status.pattern.points['b'];
      const pointc  = status.pattern.points['c'];
      const pointd = status.pattern.points['d'];


      const pointbc = setPoint((pointb.x + pointc.x) / 2, (pointb.y + pointc.y) / 2 + inchesToPrecision(status, 1/16));
      const pointde = setPoint((pointe.x + pointd.x) / 2, (pointe.y + pointd.y) / 2 - inchesToPrecision(status, 1/16)); 
      status.pattern.points['bc'] = pointbc;
      status.pattern.points['de'] = pointde;
      status = setCurve(status, {start: 'b', touch: 'bc', end: 'c'}, 0, 'bezier');
      status = setCurve(status, {start: 'd', touch: 'de', end: 'e'}, 0, 'bezier');
      
      const pointf16 = setPoint((pointf.x + point16.x) / 2, ((pointf.y + point16.y) / 2) - inchesToPrecision(status, 1/16));
      pointf16.visible = false;
      status.pattern.points['f16'] = pointf16;
      status = setCurve(status, {start: 'f', touch: 'f16', end: '16b'}, 0, 'bezier');
      
      const pointg = status.pattern.points['g'];
      const point16g = setPoint((pointg.x + point16.x) / 2, ((pointg.y + point16.y) / 2) - inchesToPrecision(status, 1/16));
      point16g.visible = false;
      status.pattern.points['16g'] = point16g;
      status = setCurve(status, {start: '16a', touch: '16g', end: 'g'}, 0, 'bezier');


      status.pattern.points['G1'].visible = false
      return status;
    }
  },
];
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

function distOtoA(status) {
  const b = status.measurements.backLength.value + 0.75;
  const a = status.measurements.heightUnderArm.value;
  return b - a;
}

export const keystone_single = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}
