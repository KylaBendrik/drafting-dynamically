import {
  inchesToPrecision,
  toInches,
  registerPoints,
  registerPoint,
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
  title: 'Alice Yoke',
  source: {
    link: 'https://youtube.com/playlist?list=PLZByZ9HlQcCKq3uJ8MjaXbjN1poxS_H8y&si=ZT5c6spRpksh4s8v',
    label: 'The Alice Dress - Yoke',
  },
  designer: 'Kyla Bendrik',
}

let measurements = {
  neckSize: { label: "Neck Size", value: 12, step: 0.5 },
    blade: { label: "Blade", value: 9 },
    breast: { label: "Breast", value: 32 },
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
    description: (_status) => { return 'Point A is 1/2 inch below point O' },
    action: (status) => {
        let pointO = status.pattern.points['O'];

        let dist = inchesToPrecision(status, 1/2);
        status.pattern.points['A'] = setPoint(pointO.x, pointO.y + dist);
        return status;
    }
  },
  {
    description: (_status) => { return 'Take the (Neck Size / 2 pi) x 2.1, this is radiusNS. Point B is left of A, Point C is below A' },
    action: (status) => {
        let pointA = status.pattern.points['A'];
        let dist = radiusNS(status);
        status.pattern.points['B'] = setPoint(pointA.x - dist, pointA.y);
        status.pattern.points['C'] = setPoint(pointA.x, pointA.y + dist);
        return status;
    }
  },
  {
    description: (_status) => { return 'Point D is 45 degrees down and left from A, radiusNS - 1/2"' },
    action: (status) => {
        let pointA = status.pattern.points['A'];
        let dist = radiusNS(status) - inchesToPrecision(status, 1/2);
        let leg = dist / Math.sqrt(2); //45 degrees, so both legs are equal
        status.pattern.points['D'] = setPoint(pointA.x - leg, pointA.y + leg);

        console.log(`distance from A to D: ${distPointToPoint(pointA, status.pattern.points['D'])}`);
        console.log(`distance from A to B: ${distPointToPoint(pointA, status.pattern.points['B'])}`);
        return status;
    }
  },
  {
    description: (_status) => { return 'Point E is left of O, distance is RadiusNS + (Blade / 4)"' },
    action: (status) => {
        let pointO = status.pattern.points['O'];
        let dist = radiusNS(status) + inchesToPrecision(status, status.measurements.blade.value / 4);
        status.pattern.points['E'] = setPoint(pointO.x - dist, pointO.y);
        return status;
    }
  },
  {
    description: (_status) => { return 'Point F is 45 degrees down and left from D, distance is (blade / 5.14) + (breast / 18.29)' },
    action: (status) => {
        let pointD = status.pattern.points['D'];
        let blade = status.measurements.blade.value;
        let breast = status.measurements.breast.value;
        console.log(`blade: ${blade}, breast: ${breast}`);
        console.log(`blade / 5.14: ${blade / 5.14}, breast / 18.29: ${breast / 18.29} = ${(blade / 5.14) + (breast / 18.29)}`);

        let dist = inchesToPrecision(status, blade / 5.14) + inchesToPrecision(status, breast / 18.29);
        let leg = Math.sqrt((dist * dist) / 2); //45 degrees, so both legs are equal
        console.log(`leg: ${leg}, dist: ${dist}`);
        status.pattern.points['F'] = setPoint(pointD.x - leg, pointD.y + leg);

        console.log('distance from A to F in inches: ' + toInches(status, distPointToPoint(status.pattern.points['A'], status.pattern.points['F'])));
        console.log('distance from A to D in inches: ' + toInches(status, distPointToPoint(status.pattern.points['A'], status.pattern.points['D'])));
        console.log('distance from D to F in inches: ' + toInches(status, distPointToPoint(status.pattern.points['D'], status.pattern.points['F'])));
        return status;
    }
  },
  {
    description: (_status) => { return 'Point G is breast / 7.76 below C' },
    action: (status) => {
        let pointC = status.pattern.points['C'];
        let dist = inchesToPrecision(status, status.measurements.breast.value / 7.76);
        status.pattern.points['G'] = setPoint(pointC.x, pointC.y + dist);

        //connect the dots
        status = setLine(status, 'E', 'B');
        status = setLine(status, 'C', 'G');
        status = setCurve(status, {s: 'B', g: 'D', e: 'C'});
        status = setCurve(status, {s: 'E', g: 'F', e: 'G'});

        return status;
    }
  },
  {
    description: (_status) => { return 'Start front yoke with point 0, 1" below G'},
    action: (status) => {
        let pointG = status.pattern.points['G'];
        status.pattern.points['0'] = setPoint(pointG.x, pointG.y + inchesToPrecision(status, 1));
        return status;
    }
  },
  {
    description: (_status) => { return 'Point 1 is neck size / 3 down from 0. '},
    action: (status) => {
        let point0 = status.pattern.points['0'];
        let dist = inchesToPrecision(status, status.measurements.neckSize.value / 3);
        status.pattern.points['1'] = setPoint(point0.x, point0.y + dist);
        console.log(`distance from 0 to 1: ${distPointToPoint(point0, status.pattern.points['1'])}`);
        
        return status;
    }
  },
  {
    description: (_status) => { return 'Point 2 is radiusNS left of 1. Point 3 is radiusNS below 1.'},
    action: (status) => {
        let point1 = status.pattern.points['1'];
        let dist = radiusNS(status);
        status.pattern.points['2'] = setPoint(point1.x - dist, point1.y);
        status.pattern.points['3'] = setPoint(point1.x, point1.y + dist);
        return status;
    }
  },
  {
    description: (_status) => { return 'Point 4 RadiusNS + 3/8" left of 0. Point 5 is 1/2 left of 0 and 1 5/8" below 0.' },
    action: (status) => {
        let point0 = status.pattern.points['0'];
        let dist = radiusNS(status) + inchesToPrecision(status, 3/8);
        status.pattern.points['4'] = setPoint(point0.x - dist, point0.y);
        status.pattern.points['5'] = setPoint(point0.x - inchesToPrecision(status, 1/2), point0.y + inchesToPrecision(status, 1 + 5/8));
        return status;
    }   
  },
  {
    description: (_status) => { return 'Point 6 is 2 1/4" left of 2.' },
    action: (status) => {
        let point2 = status.pattern.points['2'];
        status.pattern.points['6'] = setPoint(point2.x - inchesToPrecision(status, 2 + 1/4), point2.y);
        return status;
    }
  },
  {
    description: (_status) => { return 'Point 7 is Breast / 8.83 below 3.' },
    action: (status) => {
        let point3 = status.pattern.points['3'];
        let dist = inchesToPrecision(status, status.measurements.breast.value / 8.83);
        status.pattern.points['7'] = setPoint(point3.x, point3.y + dist);
        return status;
    }
  },
  {
    description: (_status) => { return 'Point 8 is RadiusNS distance, 45 degrees left and down from 1. Point 9 is 3 inches beyond 8' },
    action: (status) => {
        let point1 = status.pattern.points['1'];

        let dist8 = radiusNS(status);
        let leg8 = dist8 / Math.sqrt(2); //45 degrees, so both legs are equal
        status.pattern.points['8'] = setPoint(point1.x - leg8, point1.y + leg8);

        let dist9 = inchesToPrecision(status, 3);
        let leg9 = dist9 / Math.sqrt(2); //45 degrees, so both legs are equal

        status.pattern.points['9'] = setPoint(status.pattern.points['8'].x - leg9, status.pattern.points['8'].y + leg9);

        return status;
    }
  },
  {
    description: (_status) => { return 'Draw the curves and sides'},
    action: (status) => {
        // Draw the curves and sides
        status = setCurve(status, {s: '5', g1: '2', g2: '8', e: '3'}, [0.4, 0.7]);
        status = setCurve(status, {s: '4', g1: '6', g2: '9', e: '7'}, [0.45, 0.75]);

        status = setLine(status, '4', '5');
        status = setLine(status, '3', '7');


        let pointF = status.pattern.points['F'];
        let point9 = status.pattern.points['9'];
        //set the labels
        let defaultSize = 13;
        let margin = 3
        let backYokePoint = setPoint(pointF.x + margin, pointF.y - margin);
        let frontYokePoint = setPoint(point9.x + margin, point9.y - margin);
        let defaultDirection = 'right';

        let parts = {
            'front': {
                point: frontYokePoint,
                size: defaultSize,
                direction: defaultDirection
            },
            'back': {
                point: backYokePoint,
                size: defaultSize,
                direction: defaultDirection
            }
        }

        status = registerLabels(status, parts);

        return status;
    }
},
]

function radiusNS(status){
  //to simplify several steps, this is (neck size / 2pi) * 1.18
  return inchesToPrecision(status, (status.measurements.neckSize.value / (2 * Math.PI))) * 1.18;
}

export const alice_yoke = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}