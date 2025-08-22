import {
  H,
  inchesToPrecision,
  toInches,
  measure,
  half,
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
    title: 'Keystone - Skirt',
    source: {
      link: 'https://archive.org/details/keystonejacketdr00heck/page/82/mode/2up',
      label: 'The Keystone Skirt'
    },
    designer: 'Charles Hecklinger'
  }
  
  let measurements = {
    waist: { label: "Waist", value: 24 },
    hip: { label: "Hip", value: 40 },
    length: { label: "Length", value: 40 },
    fullness: { label: "Fullness", value: 10 },
    train: { label: "Train", value: 1.5 }
  };

//all distances are in inches * precision
// starting point (in this case 'O') is always 0,0. All other points are defined in relation to this point. Negatives are expected

const steps = [
    {
      description: (_status) => { return 'Place point O at the top right (center back)' },
      action: (status) => {
        //we need to make the precision smaller than the default so that the skirt is not too wide
        status.canvasInfo.pixelsPerInch = 10;
        console.log(status)
        //center back
        let pointO = setPoint(0, 0, {d: true, l: true});

        status = registerPoints(status,{
          'O': pointO
        });
        
        return status;
      }
    },
    {
      description: (status) => { return `Draw a straight line down from point O to B, using waist ${printMeasure(status.measurements.waist)} and from B to C, using length ${printMeasure(status.measurements.length)}` },
      action: (status) => {
        let pointO = status.pattern.points['O'] ;
        let waist = inchesToPrecision(status, H.waist(status));
        let length = inchesToPrecision(status, H.length(status));

        let pointB = setPoint(pointO.x, pointO.y + waist);
        let pointC = setPoint(pointB.x, pointB.y + length);

        status = registerPoints(status, {
          'B': pointB,
          'C': pointC
        });

        return status;
      }
    },
    {
      description: (status) => { return `Start sweeping around O, using the waist measure as the radius. 1/8 waist ${printNum(status.measurements.waist.value / 8)} is used for the distance for the tops of the panels (B to 1, 2 to 3, and 0 to 4). ${dartInstructions(status)}` },
      action: (status) => {
        let pointO = status.pattern.points['O'];
        let pointB = status.pattern.points['B'];

        let radius = inchesToPrecision(status, H.waist(status));
        let eighth = radius / 8;

        let dart1 = inchesToPrecision(status, dart(status, 1));
        let dart3 = inchesToPrecision(status, dart(status, 3));

        // Sweep around point 0
        let point1 = setPointCircleCircle(status, pointO, radius, pointB, eighth, true)
        let point2 = setPointCircleCircle(status, pointO, radius, point1, dart1, true)
        let point3 = setPointCircleCircle(status, pointO, radius, point2, eighth, true)
        let point0 = setPointCircleCircle(status, pointO, radius, point3, dart1, true)
        let point4 = setPointCircleCircle(status, pointO, radius, point0, eighth, true)
        let point5 = setPointCircleCircle(status, pointO, radius, point4, dart3, true)

        status = registerPoints(status, {
          '0': point0,
          '1': point1,
          '2': point2,
          '3': point3,
          '4': point4,
          '5': point5
        });

        //use arcs for the curves from B to 1, 2 to 3, and 0 to 4
        status = setCurve(status, {s: 'B', e: '1', c: 'O'});
        status = setCurve(status, {s: '2', e: '3', c: 'O'});
        status = setCurve(status, {s: '0', e: '4', c: 'O'});

        return status;
      }
    },
    {
      description: (status) => { return `Place D, E, and F in the center of the darts. Draw lines from O through these points using length ${printMeasure(status.measurements.length)} to find P, Q, and R at the hem of the skirt.` },
      action: (status) => {
        let pointO = status.pattern.points['O'];

        let point1 = status.pattern.points['1'];
        let point2 = status.pattern.points['2'];
        let point3 = status.pattern.points['3'];
        let point0 = status.pattern.points['0'];
        let point4 = status.pattern.points['4'];
        let point5 = status.pattern.points['5'];

        let pointD = setPoint((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
        let pointE = setPoint((point3.x + point0.x) / 2, (point3.y + point0.y) / 2);
        let pointF = setPoint((point4.x + point5.x) / 2, (point4.y + point5.y) / 2);

        status = registerPoints(status, {
          'D': pointD,
          'E': pointE,
          'F': pointF
        });

        // Draw lines from O through D, E, and F
        status = setLine(status, 'O', 'd', 'dashed');
        status = setLine(status, 'O', 'e', 'dashed');
        status = setLine(status, 'O', 'f', 'dashed');

        //find points P, Q, and R
        let length = H.length(status);
        let waist = H.waist(status);
        let dist = length + waist;

        let pointP = setPointAlongLine(status, pointO, pointD, dist);
        let pointQ = setPointAlongLine(status, pointO, pointE, dist);
        let pointR = setPointAlongLine(status, pointO, pointF, dist);

        status = registerPoints(status, {
          'P': pointP,
          'Q': pointQ,
          'R': pointR
        });

        status = setLine(status, 'B', 'C');

        return status;
      }
    },
    {
      description: (status) => { return `Curve the darts 4 1/2" down from the waist.`},
      action: (status) => {
        let pointO = status.pattern.points['O'];
        let pointD = status.pattern.points['D'];
        let pointE = status.pattern.points['E'];
        let pointF = status.pattern.points['F'];

        let waist = H.waist(status);
        console.log('waist:', waist);

        let dist = 4.5 + waist;
        console.log('dist:', dist);

        let pointd = setPointAlongLine(status, pointO, pointD, dist);
        let pointe = setPointAlongLine(status, pointO, pointE, dist);
        let pointf = setPointAlongLine(status, pointO, pointF, dist);

        status = registerPoints(status, {
          'd': pointd,
          'e': pointe,
          'f': pointf
        });

        status = setLine(status, 'd', '1');
        status = setLine(status, 'd', '2');
        status = setLine(status, 'e', '3');
        status = setLine(status, 'e', '0');
        status = setLine(status, 'f', '4');
        status = setLine(status, 'f', '5');

        status = setLine(status, 'd', 'P');
        status = setLine(status, 'e', 'Q');
        status = setLine(status, 'f', 'R');

        return status;
      }
    },
    {
      description: (status) => { return `At a right angle from the line O to F, go ${printNum(H.waist(status) * 3 / 8)} to find G. This provides ample room for the waist and to add some pleats.`; },
      action: (status) => {
        let pointO = status.pattern.points['O'];
        let pointF = status.pattern.points['F'];

        let angle = Math.atan2(pointF.y - pointO.y, pointF.x - pointO.x) + Math.PI / 2;
        let dist = inchesToPrecision(status, 9);
        let pointG = setPoint(pointF.x + dist * Math.cos(angle), pointF.y + dist * Math.sin(angle));

        status = registerPoints(status, {
          'G': pointG
        });

        return status;
      }
    },
    {
      description: (status) => { return `At a right angle from the line O to F, go ${printNum(H.waist(status) * 3 / 8)} from 5 to find G. This provides ample room for the waist and to add some pleats.`; },
      action: (status) => {
        let pointO = status.pattern.points['O'];
        let pointF = status.pattern.points['F'];
        let point5 = status.pattern.points['5'];

        let angle = Math.atan2(pointF.y - pointO.y, pointF.x - pointO.x) + Math.PI / 2;
        let dist = inchesToPrecision(status, 9);
        let pointG = setPoint(point5.x + dist * Math.cos(angle), point5.y + dist * Math.sin(angle));

        status = registerPoints(status, {
          'G': pointG
        });

        return status;
      }
    },
    {
      description: (status) => { return `At a right angle from the line 5 to G, go down from G to the hem to find point U. This is the narrowest skirt, but as it only hangs straight down, more room around the bottom will give it a better shape.`; },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let pointO = status.pattern.points['O'];
        let point5 = status.pattern.points['5'];
        let distOToHem = oToHem(status);
        let dist = inchesToPrecision(status, H.length(status));

        let angle = Math.atan2(pointG.y - point5.y, pointG.x - point5.x) + Math.PI / 2;
        let tempPoint = setPoint(pointG.x - dist * Math.cos(angle), pointG.y - dist * Math.sin(angle));

        let pointU = setPointLineCircle(status, pointG, tempPoint, pointO, distOToHem);

        status = registerPoints(status, {
          'U': pointU,
        });

        status = setLine(status, 'G', 'U', 'dashed');

        return status;
      }
    },
    {
      description: (status) => { return `Therefore, find point K along the hem line, 12 in. from point U.`},
      action: (status) => {
        let pointU = status.pattern.points['U'];
        let pointO = status.pattern.points['O'];

        let distOToHem = oToHem(status);
        let distUToK = inchesToPrecision(status, 12);

        let pointK = setPointCircleCircle(status, pointU, distUToK, pointO, distOToHem);

        status = registerPoints(status, {
          'K': pointK
        });


        return status;
      }
    },
    {
      description: (status) => { return `G will likely be too short to reach the waistband, so take the length ${printMeasure(status.measurements.length)} from G up to find I. This finishes the slim skirt.`; },
      action: (status) => {
        let pointG = status.pattern.points['G'];
        let pointK = status.pattern.points['K'];
        let length = H.length(status);
        let pointI = setPointAlongLine(status, pointK, pointG, length);

        status = registerPoints(status, {
          'I': pointI
        });

        status = setLine(status, 'K', 'I');
        status = setLine(status, 'G', '5', 'dashed');
        status = setCurve(status, {s: '5', e: 'I', c: 'O'})

        return status;
      }
    },
    {
      description: (status) => { return `To create a skirt with more fullness (the Bell Skirt), find point A between O and B, and go left to the hem line to find L.`; },
      action: (status) => {
        let pointO = status.pattern.points['O'];
        let pointB = status.pattern.points['B'];
        let distOToHem = oToHem(status);

        let pointA = setPoint((pointB.x + pointO.x) / 2, (pointB.y + pointO.y) / 2);
        let tempPoint = setPoint(pointA.x + 100, pointA.y);
        let pointL = setPointLineCircle(status, pointA, tempPoint, pointO, distOToHem);

        status = registerPoints(status, {
          'A': pointA,
          'L': pointL
        });
        
        status = setCurve(status, {s: 'C', e: 'L', c: 'O'});

        return status;
      }
    },
    {
      description: (status) => { return `On the waist sweeep around O, go right from L to find 6.`; },
      action: (status) => {
        let pointL = status.pattern.points['L'];
        let pointA = status.pattern.points['A'];
        let pointO = status.pattern.points['O'];


        let length = H.length(status);
        let waist = inchesToPrecision(status, H.waist(status));
        console.log('waist', waist)

        let point6 = setPointLineCircle(status, pointL, pointA, pointO, waist)

        status = registerPoints(status, {
          '6': point6
        });

        status = setLine(status, 'L', '6')

        return status;
      }
    },
    {
      description: (status) => { return `To make the "Umbrella" skirt, with even more fullness, continue around the hem curve ${printNum(H.fullness(status))} to find M.`},
      action: (status) => {
        let point6 = status.pattern.points['6'];
        let pointO = status.pattern.points['O'];
        let pointL = status.pattern.points['L'];

        let fullness = inchesToPrecision(status, H.fullness(status));
        let distOToHem = oToHem(status);

        let pointM = setPointCircleCircle(status, pointL, fullness, pointO, distOToHem);

        status = registerPoints(status, {
          'M': pointM
        });

        return status;
      }
    },
    {
      description: (status) => { return `Find the point along the waist curve that intersects with the line from M to A. This is H.`},
      action: (status) => {
        let pointM = status.pattern.points['M'];
        let pointA = status.pattern.points['A'];
        let pointO = status.pattern.points['O'];

        let waist = inchesToPrecision(status, H.waist(status));
        let pointH = setPointLineCircle(status, pointM, pointA, pointO, waist);

        status = registerPoints(status, {
          'H': pointH
        });

        let distMH = distPointToPoint(pointM, pointH);
        let length = inchesToPrecision(status, H.length(status));

        status = setLine(status, 'M', 'H');
        status = setLine(status, 'A', 'H', 'dashed');

        return status;
      }
    },
    {
      description: (status) => { return `Take the measurement of the train ${printNum(status.measurements.train.value)} past M to find N. This is the end of the center back hem.`; },
      action: (status) => {
        let pointM = status.pattern.points['M'];
        let pointH = status.pattern.points['H'];
        let pointR = status.pattern.points['R'];
        let train = status.measurements.train.value;
        let pointN = setPointAlongLine(status, pointM, pointH, - train);

        status = registerPoints(status, {
          'N': pointN
        });

        status = setLine(status, 'H', 'N');

        status = setCurve(status, {s: '5', e: 'H', c: 'O'})

        //find the theoretical center of the arc for R to N
        let centerRN = setEquilateralThirdPoint(status, pointR, pointN)
        status = registerPoints(status, {
          'centerRN': centerRN
        });

        status = setCurve(status, {s: 'R', e: 'N', c: 'centerRN'})

        return status;
      }
    }
  ]



function dart(status, dartNum = 1) {
  //according to the reference, an average form (15-20" difference between waist and hip) should use 1" darts
  //forms that are smaller should use 3/4"
  //larger forms need 1 1/4"
  //all sizes have 1/4" larger dart on the side (number 3)

  //dart number is counted from the front. There are three darts (between 2 and 1, between 3 and 0, and between 4 and 5) 

  const waist = status.measurements.waist.value;
  const hip = status.measurements.hip.value;

  const diff = hip - waist;

  let dart = 1

  if (diff >= 15 && diff <= 20) {
    dart = 1;
  } else if (diff <= 15) {
    dart = 0.75
  } else {
    dart = 1.25;
  }
  if (dartNum <= 2) {
      return dart;
    } else {
      return dart + 0.25;
    }
}

function dartInstructions(status){
  const waist = status.measurements.waist.value;
  const hip = status.measurements.hip.value;

  const diff = hip - waist;

  if (diff >= 15 && diff <= 20) {
    return `Use ${printNum(dart(status))} darts for the first two and ${printNum(dart(status, 3))} for the dart between 5 and 4.`;
  } else if (diff <= 15) {
    return `Use ${printNum(dart(status))} darts for the first two and ${printNum(dart(status, 3))} for the dart between 5 and 4.`;
  } else {
    return `Use ${printNum(dart(status))} darts for the first two and ${printNum(dart(status, 3))} for the dart between 5 and 4.`;
  }
}

function oToHem(status){
  return inchesToPrecision(status, H.waist(status) + H.length(status));
}

export const keystone_skirt = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}