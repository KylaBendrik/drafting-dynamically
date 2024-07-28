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
  title: 'Keystone - Collars',
  source: {
    link: 'https://archive.org/details/keystonejacketdr00heck/page/72/mode/2up',
    label: 'The Keystone Jacket and Dress Cutter (pg 72)'
  },
  designer: 'Charles Hecklinger'
}

let measurements = {
  neckSize: { label: "Neck Size", value: 10, step: 0.5 },
  collarWidth: { label: "Collar Width", value: 2, step: 0.25},
  setBack: { label: "Set Back", value: 0.5, step: 0.125},
};

const steps = [
  { description: (_status) => { return '(dia 56) This is a collar that clings close to the neck on the upper edge. O is in the lower right corner.'; },
    action: (status) => {
      status.pattern.points['(56) O'] = setPoint(0, 0);
      return status;
    }
  },
  {
    description: (status) => { return '(dia 56) Set 1 to the left of O by 1/2 of the neck size'; },
    action: (status) => {
      let neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value));
      status.pattern.points['1a'] = setPoint( - neckSize / 2, 0);
      status = setLine(status, '(56) O', '1a', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return '(dia 56) Set 4 above O by the collar width'; },
    action: (status) => {
      const point1 = status.pattern.points['1a'];
      
      let collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value));
      status.pattern.points['4a'] = setPoint(0, - collarWidth);
      status.pattern.points['2a'] = setPoint(point1.x, - collarWidth);
      status = setLine(status, '(56) O', '4a', 'dashed');
      return status;
    }
  },
  {
    description: (status) => { return '(dia 56) Point 3 is set slightly back of point 2'; },
    action: (status) => {
      let setBack = inchesToPrecision(status, parseFloat(status.design.measurements.setBack.value));
      status.pattern.points['3a'] = setPoint(status.pattern.points['2a'].x + setBack, status.pattern.points['2a'].y);
      return status;
    }
  },
  {
    description: (status) => { return '(dia 56) Draw edges, curving the lines from 3 to 4 and 1 to O'; },
    action: (status) => {
      const margin = inchesToPrecision(status, 0.75);

      const pointO = status.pattern.points['(56) O'];
      const point1 = status.pattern.points['1a'];
      const point3 = status.pattern.points['3a'];
      const point4 = status.pattern.points['4a'];

      const offset = inchesToPrecision(status, 0.25);
      //invisible points to help with curves
      status.pattern.points['Oa-1a'] = setPoint((pointO.x + point1.x)/2, pointO.y + offset);

      status.pattern.points['3a-4a'] = setPoint((point3.x + point4.x)/2, point3.y + offset);
      status.pattern.points['Oa-1a'].visible = false;
      status.pattern.points['3a-4a'].visible = false;
      status.pattern.points['2a'].visible = false;
      status = setCurve(status, {start: '(56) O', touch: 'Oa-1a', end: '1a'}, 0, 'bezier');
      status = setCurve(status, {start: '3a', touch: '3a-4a',  end: '4a'}, 0, 'bezier');
      status = setLine(status, '1a', '3a');
      status = setLine(status, '4a', '(56) O');

      return status;
    }
  },
  { description: (_status) => { return '(dia 57) Version 57 is exactly the same as 56, but with straight lintes, and is squared'; },
  action: (status) => {
    const point56_O = status.pattern.points['(56) O'];
    const point56_1 = status.pattern.points['1a'];
    const point56_2 = status.pattern.points['2a'];
    const point56_4 = status.pattern.points['4a'];

    const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value));

    const dia_57_offset = defineOffset(status, point56_O.y, collarWidth);

    const point57_O = setPoint(point56_O.x, point56_O.y + dia_57_offset);
    const point57_1 = setPoint(point56_1.x, point56_1.y + dia_57_offset);
    const point57_2 = setPoint(point56_2.x, point56_2.y + dia_57_offset);
    const point57_4 = setPoint(point56_4.x, point56_4.y + dia_57_offset);

    status.pattern.points['(57) O'] = point57_O;
    status.pattern.points['1b'] = point57_1;
    status.pattern.points['2b'] = point57_2;
    status.pattern.points['4b'] = point57_4;

    status = setLine(status, '(57) O', '1b');
    status = setLine(status, '1b', '2b');
    status = setLine(status, '2b', '4b');
    status = setLine(status, '4b', '(57) O');
    return status;
  }
  },
  { description: (_status) => { return '(dia 58) This form will not cling to the neck on the upper edge, because of the curve from 3 to 4'; },
    action: (status) => {
    const point57_O = status.pattern.points['(57) O'];
    const point57_1 = status.pattern.points['1b'];
    const point57_2 = status.pattern.points['2b'];
    const point57_4 = status.pattern.points['4b'];
    
    const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value));
    const neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value)) / 2;
    const dia_58_offset = defineOffset(status, point57_O.y, collarWidth / 8);

    status.pattern.points['(58) O'] = setPoint(0, point57_O.y + dia_58_offset);
    status.pattern.points['1c'] = setPoint(status.pattern.points['(58) O'].x - neckSize, status.pattern.points['(58) O'].y);
    return status;
    }
  },
  {
    description: (status) => { return '(dia 58) Set C 1 inch below O, draw across to 2.'; },
    action: (status) => {
      const point58_O = status.pattern.points['(58) O'];
      status.pattern.points['Cc'] = setPoint(0, point58_O.y + inchesToPrecision(status, 1));
      status.pattern.points['2c'] = setPoint(status.pattern.points['1c'].x, status.pattern.points['Cc'].y);

      return status;
    }
  },
  {
    description: (status) => { return '(dia 58) Set 4 the collar width above O'; },
    action: (status) => {
      const point58_O = status.pattern.points['(58) O'];
      status.pattern.points['4c'] = setPoint(0, point58_O.y - inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value)));
      status = setLine(status, '(58) O', '4c');
      return status;
    }
  },
  {
    description: (status) => { return '(dia 58) Set 3 the collar width above 2'; },
    action: (status) => {
      const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value));
      let setBack = inchesToPrecision(status, parseFloat(status.design.measurements.setBack.value)) / 2;
      

      status.pattern.points['3c'] = setPoint(status.pattern.points['2c'].x + setBack , status.pattern.points['2c'].y - collarWidth);
      status = setLine(status, '2c', '3c');

      //make lines
      status = setSCurve(status, '(58) O', '2c');

      //curve from 3 to 4
      status.pattern.points['3c-4c'] = setPoint((status.pattern.points['3c'].x + status.pattern.points['4c'].x)/2, (status.pattern.points['3c'].y + status.pattern.points['4c'].y)/2 - 2);
      status.pattern.points['3c-4c'].visible = false;
      status = setCurve(status, {start: '3c', touch: '3c-4c', end: '4c'}, 0, 'bezier');
      return status;
    }
  },
  {
    description: (_status) => { return '(dia 59) With the view of giving more curve to the upper edge and therefore more flare to it, we are compelled to make the distance A to B 2 1/2 inches.'; },
    action: (status) => {
      const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value));
      const abOffset = inchesToPrecision(status, 2.5);
      const neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value)) / 2;
      let setBack = inchesToPrecision(status, parseFloat(status.design.measurements.setBack.value)) / 2;
      
      
      let points59 = {
        a: setPoint(0, 0),
        b: setPoint(0, - abOffset),
        c: setPoint(0, - abOffset - collarWidth),
        d: setPoint(0 - neckSize, 0),
        e: setPoint(0 - neckSize + setBack, - collarWidth),
      }

      //offset points
      const point58c = status.pattern.points['Cc'];

      const offset = defineOffsetY(status, point58c, points59.c, points59.a);

      console.log(`point58c.y: ${point58c.y}`)

      for (let key in points59){
        points59[key].y += offset;
      }

      status.pattern.points['(59) A'] = points59.a;
      status.pattern.points['Bd'] = points59.b;
      status.pattern.points['Cd'] = points59.c;
      status.pattern.points['Dd'] = points59.d;
      status.pattern.points['Ed'] = points59.e;

      console.log(status)

      return status;
    }
  },
  {
    description: (_status) => { return '(dia 59) Apply the size of the neck from A to D, the width from B to C, and finish as shown on the diagram.'; },
    action: (status) => {
      //curves
      const point59_A = status.pattern.points['(59) A'];
      const point59_B = status.pattern.points['Bd'];
      const point59_C = status.pattern.points['Cd'];
      const point59_D = status.pattern.points['Dd'];
      const point59_E = status.pattern.points['Ed'];

      status = setLine(status, 'Bd', 'Cd');
      status = setLine(status, 'Dd', 'Ed');

      status.pattern.points['59c_e'] = setPoint((point59_C.x + point59_E.x) / 2, (point59_C.y + point59_E.y) / 2 - 3);
      status.pattern.points['59c_e'].visible = false;
      status = setCurve(status, {start: 'Cd', touch: '59c_e', end: 'Ed'}, 0, 'bezier');
      status = setSCurve(status, 'Bd', 'Dd');

      return status;
    }
  },
  {
    description: (_status) => { return '(dia 61) When we desire to perfect the collar which is ordinarily termed " The Medecie," we are compelled to raise above point A to B 3 inches.'; },
    action: (status) => {
      const neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value)) / 2;
      const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value)) * 1.5;


      let points61 = {
        a: setPoint(0, 0),
        b: setPoint(0, - inchesToPrecision(status, 3)),
        c: setPoint(0, - inchesToPrecision(status, 3) - collarWidth),
        d: setPoint(0 - neckSize, 0),
      }

      const offset = defineOffsetY(status, status.pattern.points['(59) A'] , points61.c, points61.a) - 8;
      for (let key in points61){
        points61[key].y += offset;
      }

      status.pattern.points['(61) A'] = points61.a;
      status.pattern.points['Be'] = points61.b;
      status.pattern.points['Ce'] = points61.c;
      status.pattern.points['De'] = points61.d;

      return status;
    }
  },
  {
    description: (_status) => { return '(dia 61) Applying the size of neck from A to D, curving the neck-seam from B to D, and adding the width B to C and D to E will finish this style.'; },
    action: (status) => {
      
      const neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value)) / 2;
      const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value)) * 1.5;


      //set point E
      //E is the collar width from D, at an angle.
      //find the line from B to D. Go up from this line at a right angle.
      //this is point E
      //set point E

      const point61_B = status.pattern.points['Be'];
      const point61_C = status.pattern.points['Ce'];
      const point61_D = status.pattern.points['De'];

      const slopeB_D = (point61_D.y - point61_B.y) / (point61_D.x - point61_B.x);
      const angleB_D = Math.atan(slopeB_D);
      const angleD_E = angleB_D - Math.PI / 2;
      let e = setPoint(point61_D.x + collarWidth * Math.cos(angleD_E), point61_D.y + collarWidth * Math.sin(angleD_E));
      status.pattern.points['Ee'] = e;

      //find the point C1, which is set back from C 1/2 inch
      const setBack = inchesToPrecision(status, 0.5);
      const c1 = setPoint(point61_C.x + setBack, point61_C.y);
      status.pattern.points['C1e'] = c1;
      status.pattern.points['C1e'].visible = false;
      //straight line D-E
      status = setLine(status, 'De', 'Ee');
      //curves: E-C1, C1-B, B-D
      status.pattern.points['Ee-C1e'] = setPoint(c1.x + (e.x - c1.x) * 0.45, c1.y + (e.y - c1.y) * 0.23);
      status.pattern.points['C1e-Be'] = setPoint(c1.x + (point61_B.x - c1.x) * 0.75, c1.y + (point61_B.y - c1.y) * 0.6);
      status.pattern.points['Be-De'] = setPoint(point61_D.x + (point61_B.x - point61_D.x) * 0.5, point61_D.y + (point61_B.y - point61_D.y) * 0.7);

      status.pattern.points['Ee-C1e'].visible = false;
      status.pattern.points['C1e-Be'].visible = false;
      status.pattern.points['Be-De'].visible = false;

      status = setCurve(status, {start: 'Ee', touch: 'Ee-C1e', end: 'C1e'}, 0, 'bezier');
      status = setCurve(status, {start: 'C1e', touch: 'C1e-Be', end: 'Be'}, 0, 'bezier');
      status = setCurve(status, {start: 'Be', touch: 'Be-De', end: 'De'}, 0, 'bezier');
      
      // const neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value)) / 2;
      // const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value)) * 1.5;

      return status;
    }
  },
  {
    description: (_status) => { return '(dia 62) This is the extremest plain style that it is possible to make for a collar that will stand up and that can also be turned down. This is also called " The Medecie," and may be curved in front as shown on this diagram.'; },
    action: (status) => {
      const neckSize = inchesToPrecision(status, parseFloat(status.design.measurements.neckSize.value)) / 2;
      const collarWidth = inchesToPrecision(status, parseFloat(status.design.measurements.collarWidth.value)) * 1.5;
      const point61A = status.pattern.points['(61) A'];
      const point61B = status.pattern.points['Be'];
      const point61C1 = status.pattern.points['C1e'];
      const point61D = status.pattern.points['De'];

      const offset = point61A.y - point61C1.y - 16;
      
      status.pattern.points['(62) A'] = setPoint(0, point61A.y + offset);
      status.pattern.points['Bf'] = setPoint(0, point61B.y + offset);
      status.pattern.points['C1f'] = setPoint(point61C1.x, point61C1.y + offset);
      status.pattern.points['Df'] = setPoint(point61D.x, point61D.y + offset);

      //curves
      //c1 to d
      status.pattern.points['Df-C1f'] = setPoint(status.pattern.points['C1f'].x + (status.pattern.points['Df'].x - status.pattern.points['C1f'].x) * 0.7, status.pattern.points['C1f'].y + (status.pattern.points['Df'].y - status.pattern.points['C1f'].y) * 0.3);
      status.pattern.points['C1f-Bf'] = setPoint(status.pattern.points['C1f'].x + (status.pattern.points['Bf'].x - status.pattern.points['C1f'].x) * 0.75, status.pattern.points['C1f'].y + (status.pattern.points['Bf'].y - status.pattern.points['C1f'].y) * 0.6);
      status.pattern.points['Bf-Df'] = setPoint(status.pattern.points['Df'].x + (status.pattern.points['Bf'].x - status.pattern.points['Df'].x) * 0.5, status.pattern.points['Df'].y + (status.pattern.points['Bf'].y - status.pattern.points['Df'].y) * 0.7);

      status.pattern.points['Df-C1f'].visible = false;
      status.pattern.points['C1f-Bf'].visible = false;
      status.pattern.points['Bf-Df'].visible = false;

      status = setCurve(status, {start: 'Df', touch: 'Df-C1f', end: 'C1f'}, 0, 'bezier');
      status = setCurve(status, {start: 'C1f', touch: 'C1f-Bf', end: 'Bf'}, 0, 'bezier');
      status = setCurve(status, {start: 'Bf', touch: 'Bf-Df', end: 'Df'}, 0, 'bezier');



      return status;
    }
  },
]

function setSCurve(status, point1Key, point2Key){
        //3 new points
        const point1 = status.pattern.points[point1Key];
        const point2 = status.pattern.points[point2Key];
        
        const point1_5Key = `${point1Key}-${point2Key}`;
        const point1_25Key = `${point1Key}-${point1_5Key}`;
        const point1_75Key = `${point1_5Key}-${point2Key}`;

        //invisible point between point1 and point2
        const point1_5 = setPoint((point1.x + point2.x)/2, (point1.y + point2.y)/2);
        
        //invisible point between 0c-2c and 2c
        const point1_25 = setPoint((point1.x + point1_5.x)/2, point1.y + ((point2.y - point1.y) * 0.15));
        const point1_75 = setPoint((point1_5.x + point2.x)/2, point1.y + ((point2.y - point1.y) * 0.85));
        
        status.pattern.points[point1_5Key] = point1_5;
        status.pattern.points[point1_25Key] = point1_25;
        status.pattern.points[point1_75Key] = point1_75;        
        
        status.pattern.points[point1_5Key].visible = false;
        status.pattern.points[point1_25Key].visible = false;
        status.pattern.points[point1_75Key].visible = false;
  
        status = setCurve(status, {start: point1Key, touch: point1_25Key, end: point1_5Key}, 0, 'bezier');
        status = setCurve(status, {start: point1_5Key, touch: point1_75Key, end: point2Key}, 0, 'bezier');
        
        return status;
}

function defineOffsetY(status, lastPoint, highestPoint, lowestPoint, ){
  return defineOffset(status, lastPoint.y, (lowestPoint.y - highestPoint.y));
}

function defineOffset(status, lastPoint_axis, measurement) {
  const added_offset = inchesToPrecision(status, 0.5);
  return lastPoint_axis + measurement + added_offset;
}

export const keystone_collars = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}

