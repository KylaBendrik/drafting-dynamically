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
    title: 'Keystone - Waist (Simple Bodice)',
    source: {
      link: 'https://archive.org/details/keystonejacketdr00heck/page/12/mode/2up',
      label: 'The Keystone Jacket and Dress Cutter (pg 12)'
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
        status = setCurve(status, {start: '1', end: '2'}, 3, 'ellipse');
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
        status = status = setCurve(status, {start: '8', touch: '11', end: 'D'}, 0, 'bezier');
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
        
        status = setCurve(status, {start: 'E', end: 'N'}, 2, 'ellipse');
        
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
      description: (_status) => { return `Point 00 is left of K, the same distance 3 is left of X (not distance between 3 and X) It is also 2/5 of the distance down from Z to L` },
      action: (status) => {
        let pointK = status.pattern.points['K'];
        let point3 = status.pattern.points['3'];
        let pointX = status.pattern.points['X'];
        let pointZ = status.pattern.points['Z'];
        let pointL = status.pattern.points['L'];

        let distX = Math.abs(point3.x - pointX.x);
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
        
        let point16 = status.pattern.points['16'];
       status = status = setCurve(status, {start: '8z', touch: '11', end: '16'}, 0, 'bezier');

        return status;
      }
    },
    {
      description: (_status) => { return `Point Gx is 1/2 inch left of G. Shape the front from N, touching Gx, ending at H` },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let distX = inchesToPrecision(status, 1/2);
        status.pattern.points['Gx'] = setPoint(pointG.x - distX, pointG.y);
        let pointGx = status.pattern.points['Gx'];
        let pointN = status.pattern.points['N'];
        let pointH = status.pattern.points['H'];
        status = setCurve(status, {start: 'N', touch: 'Gx', end: 'H'}, 0, 'bezier');

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
        let pointV2 = setPoint(pointV.x, pointV.y + inchesToPrecision(status, 1/2), {}, false);
        let pointV3 = setPoint(pointV.x + inchesToPrecision(status, 5), pointV.y + inchesToPrecision(status, 1/2), {}, false);

        //find the intersection of the line from T to R, and the line from V2 to V3
        status.pattern.points['W'] = setPointLineLine(status, pointT, pointR, pointV2, pointV3);


        return status;
      }
    },
    {
      description: (status) => { return `Measure from C to D, and from 16 to H. Subtract from this, 1/2 the waist measure ${printMeasure(status.measurements.waist, 1 / 2)}, to get the amount of space to give the darts.` },
      action: (status) => {
        let pointC = status.pattern.points['C'];
        let pointD = status.pattern.points['D'];
        let point16 = status.pattern.points['16'];
        let pointH = status.pattern.points['H'];

        let distCD = distPointToPoint(pointC, pointD);
        let dist16H = distPointToPoint(point16, pointH);
        let waist = parseFloat(status.measurements.waist.value) / 2;
        let space = (distCD + dist16H) - waist;

        

        return status;
      }
    }
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
  //b is along y, on x of point P.
  //a^2 + b^2 = c^2
  //b = sqrt(c^2 - a^2)
  const b = Math.round(Math.sqrt(c * c - a * a));
  const ey = Math.round(pointJ.y - b);
  return setPoint(pointP.x, ey, { l: true });
}

export const keystone_bodice = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}