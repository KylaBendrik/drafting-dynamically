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
    title: 'Alice Skirt',
    source: {
      link: 'https://youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y&si=ZT5c6spRpksh4s8v',
      label: 'The Alice Skirt'
    },
    designer: 'Kyla Bendrik'
  }
  
  let measurements = {
    waist: { label: "Waist", value: 22 },
    length: { label: "Length", value: 36.5 },
  };

  //all distances are in inches * precision
// starting point (in this case 'O') is always 0,0. All other points are defined in relation to this point. Negatives are expected

const steps = [
    {
      description: (_status) => { return 'Place point 0 at the top right (center back)' },
      action: (status) => {
        //we need to make the precision smaller than the default so that the skirt is not too wide
        status.canvasInfo.pixelsPerInch = 8;
        console.log(status)
        //center back
        let point0 = setPoint(0, 0, {d: true, l: true});

        status = registerPoints(status,{
          '0': point0
        });
        
        return status;
      }
    },
    {
      description: (status) => { return `Draw a straight line down from point 0 to the hem, using length ${printMeasure(status.measurements.length)} ` },
      action: (status) => {
        let point0 = status.pattern.points['0'] ;
        let length = inchesToPrecision(status, H.length(status));

        let point1 = setPoint(point0.x, point0.y + length, {l: true});

        status = registerPoints(status, {
          '1': point1
        });


        return status;
      }
    },
    {
      description: (status) => { return `Draw a line left from point 1, 5.2 times half the waist. This is the width of the skirt at the hem, and is ${printNum(hem(status) / status.precision)} ` },
      action: (status) => {
        let point1 = status.pattern.points['1'];
        let hemLength = hem(status);

        let point2 = setPoint(point1.x - hemLength, point1.y);

        status = registerPoints(status, {
          '2': point2
        });

        return status;
      }
    },
    {
      description: (status) => { return `To find the lowest point of the back panel, go from 1 left to find A at 1/4 * the hem ${printNum(hem(status) * 0.25 / status.precision)}, and find B right of 2 at 1/4 * the hem` },
      action: (status) => {
        let point1 = status.pattern.points['1'];
        let point2 = status.pattern.points['2'];

        let pointA = setPoint(point1.x - (hem(status) / 4), point1.y, {u: true});
        let pointB = setPoint(point2.x + (hem(status) / 4), point2.y, {u: true});

        status = registerPoints(status, {
          'A': pointA,
          'B': pointB
        });

        return status;
      }
    },
    {
      description: (status) => { return `Draw straight lines around the back panel, from 1 to A, and up from A to the point it meets the line left of 0, and from there to 0.` },
      action: (status) => {
        let point0 = status.pattern.points['0'];
        let point1 = status.pattern.points['1'];
        let pointA = status.pattern.points['A'];

        let point3 = setPoint(pointA.x, point0.y);

        status = registerPoints(status, {
          '3': point3
        });

        status = setLine(status, '1', 'A');
        status = setLine(status, 'A', '3');
        status = setLine(status, '3', '0');
        status = setLine(status, '0', '1');

        return status;
      }
    },
    {
      description: (status) => { return `Go left from point A 23% of the waist ${printNum(H.waist(status) * 0.23)} to find point C.` },
      action: (status) => {
        let pointA = status.pattern.points['A'];
        let pointC = setPoint(pointA.x - (H.waist(status) * 0.23 * status.precision), pointA.y, {u: true});

        status = registerPoints(status, {
          'C': pointC
        });

        return status;
      }
    },
    {
      description: (status) => { return `Take the length of skirt from A up to the line up from C. The point you find is point 4.` },
      action: (status) => {
        let pointA = status.pattern.points['A'];
        let pointC = status.pattern.points['C'];

        let length = inchesToPrecision(status, H.length(status));

        let width = distPointToPoint(pointA, pointC);

        let height = Math.sqrt(Math.pow(length, 2) - Math.pow(width, 2));


        let point4 = setPoint(pointC.x, pointC.y - height, {u: true});
        status = registerPoints(status, {
          '4': point4
        });
        return status;
      }
    },
    {
      description: (status) => { return `Go down the skirt length from point 4 to find point 5. Draw a line from A to 4, and from A to 5.` },
      action: (status) => {
        let point4 = status.pattern.points['4'];

        let length = inchesToPrecision(status, H.length(status));

        let point5 = setPoint(point4.x, point4.y + length, {u: true});

        status = registerPoints(status, {
          '5': point5
        });

        status = setLine(status, 'A', '4');

        return status;
      }
    },
    {
      description: (status) => { return `Go right from point B 10% of the waist ${printNum(H.waist(status) * 0.1)} to find point D.` },
      action: (status) => {
        let pointB = status.pattern.points['B'];
        let pointD = setPoint(pointB.x + (H.waist(status) * 0.1 * status.precision), pointB.y, {u: true});

        status = registerPoints(status, {
          'D': pointD
        });

        return status;
      }
    },
    {
      description: (status) => { return `Take the length of skirt from B up to the line up from D. The point you find is point 6. Go down the length of skirt from 6 to find 7.` },
      action: (status) => {
        let pointD = status.pattern.points['D'];
        let pointB = status.pattern.points['B'];

        let length = inchesToPrecision(status, H.length(status));

        let width = distPointToPoint(pointB, pointD);

        let height = Math.sqrt(Math.pow(length, 2) - Math.pow(width, 2));

        let point6 = setPoint(pointD.x, pointD.y - height);
        let point7 = setPoint(point6.x, point6.y + length);

        status = registerPoints(status, {
          '6': point6,
          '7': point7
        });

        status = setLine(status, 'B', '7');
        status = setLine(status, '6', '4');
        status = setLine(status, 'B', '6')
        status = setCurve(status, {s: 'B', g1: '7', g2: '5', e: 'A'}, [0.2, 0.8]);

        return status;
      }
    },
    {
      description: (status) => { return `Go left from B 27% of the waist ${printNum(H.waist(status) * 0.27)} to find point E.` },
      action: (status) => {
        let pointB = status.pattern.points['B'];
        let pointE = setPoint(pointB.x - (H.waist(status) * 0.27 * status.precision), pointB.y, {u: true});

        status = registerPoints(status, {
          'E': pointE
        });

        return status;
      }
    },
    { 
      description: (status) => { return `Take the length of skirt from B up to the line up from E. The point you find is point 8. Go down the length of skirt from 8 to find 9.` },
      action: (status) => {
        let pointE = status.pattern.points['E'];
        let pointB = status.pattern.points['B'];

        let length = inchesToPrecision(status, H.length(status));

        let width = distPointToPoint(pointB, pointE);

        let height = Math.sqrt(Math.pow(length, 2) - Math.pow(width, 2));

        let point8 = setPoint(pointE.x, pointE.y - height);
        let point9 = setPoint(point8.x, point8.y + length);

        status = registerPoints(status, {
          '8': point8,
          '9': point9
        });

        status = setLine(status, 'B', '8');
        status = setLine(status, '9', 'B');
        //status = setCurve(status, {s: 'E', g1: '9', g2: '7', e: 'B'}, [0.2, 0.8]);

        return status;
      }
    },
    {
      description: (status) => { return `Go left from both 9 and 8 to the line up and down from 2.`; },
      action: (status) => {
        let point8 = status.pattern.points['8'];
        let point9 = status.pattern.points['9'];
        let point2 = status.pattern.points['2'];

        let pointF = setPoint(point2.x, point8.y);
        let pointG = setPoint(point2.x, point9.y);

        status = registerPoints(status, {
          'F': pointF,
          'G': pointG
        });

        status = setLine(status, 'F', 'G');
        status = setLine(status, 'F', '8');
        status = setLine(status, 'G', '9');

        //add labels
        let pointD = status.pattern.points['D'];
        let pointA = status.pattern.points['A'];

        let labelY = (point8.y + pointD.y + pointD.y) / 3;

        let frontpanelpoint = setPoint(point2.x + 15, labelY);
        let sidepanelpoint = setPoint(pointD.x + 15, labelY);
        let backpanelpoint = setPoint(pointA.x + 15, labelY);

        let parts = {
          'front': {
            point: frontpanelpoint,
            size: 14,
            direction: 'up',
          },
          'side': {
            point: sidepanelpoint,
            size: 14,
            direction: 'up',
          },
          'back': {
            point: backpanelpoint,
            size: 14,
            direction: 'up',
          },
        };
        status = registerLabels(status, parts);

        return status;
      }
    },
]


function hem(status) {
  let waist = inchesToPrecision(status, H.waist(status)) / 2;

  return waist * 5.25;
}

export const alice_skirt = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}