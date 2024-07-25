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

    const dia_57_offset = collarWidth * 1.5;

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

    const dia_58_offset = collarWidth * 1.5;

    status.pattern.points['(58) O'] = setPoint(0, point57_O.y + dia_58_offset);
    status.pattern.points['1c'] = setPoint(point57_1.x, point57_1.y + dia_58_offset);
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
      

      status.pattern.points['3c'] = setPoint(status.pattern.points['2c'].x, status.pattern.points['2c'].y - collarWidth);
      status = setLine(status, '2c', '3c');
      return status;
    }
  }
]

export const keystone_collars = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}
