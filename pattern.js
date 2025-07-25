//turn design into pattern

export function inchesToPrecision(status, inches){
  const precision = status.precision;
  return Math.round(inches * precision);
}

export function toInches(status, value) {
  //the inverse of inchesToPrecision
  //convert value to inches, using the precision from status
  const precision = status.precision;
  return value / precision;
}

export function seeDist(status, length, label = "") {
  //this is just for debugging purposes, to see the distance in precision units and inches
  console.log(`Distance ${label}: ${length} precision units, ${length / status.precision} inches`);
}

export function registerPoint(status, point, label = undefined) {
  // register point to the pattern
  status.pattern.points[label] = point;

  return status;
}

export function registerPoints(status, points) {
  // use registerPoint to register all points in the object
  // points is an object with keys as labels and values as points
  for (let key in points) {
    status = registerPoint(status, points[key], key);
  }
  return status;
}

export function setPoint(x, y, guides, visible = true){
  let tempGuide = {u: false, d: false, l: false, r: false};
  if (guides === undefined){
    guides = tempGuide;
  } else {
    guides = {...tempGuide, ...guides};
  }
  let point = {x: Math.round(x), y: Math.round(y), guides: guides, visible: visible};
  return point;
}

export function registerLabel(status, point, label, direction = 'right', size = 16){
  point.visible = `label-${direction}`;
  point.size = size;
  status.pattern.points[label] = point;

  return status;
}

export function registerTwoPartLabel(status, point, label1, label2, direction = 'right', size = 16){
  //register a two part label, with a space in between
  //point is the point to register the label at
  //label1 is the first part of the label
  //label2 is the second part of the label
  //direction is the direction of the label (up, down, left, right)
  //size is the size of the label
  let point1 = point;
  let point2 = {...point};
  let margin = size / 4;
  let size2 = size - 2;
  if (direction === 'up'){
    point2.x += margin;
  } else if (direction === 'right'){
    point2.y += margin;
  }
  
  status = registerLabel(status, point1, label1, direction, size);
  status = registerLabel(status, point2, label2, direction, size2);

  return status;
}

export function registerLabels(status, parts) {
  //parts is an array of objects, each with a simple point object, a name, a size (in case of smaller pieces), and a direction (right or up)
  //for example, let parts = {
        //   'front': {
        //     point: frontLabelPoint,
        //     size: 14,
        //     direction: 'up',
        //   },
        //   'side': {
        //     point: sideLabelPoint,
        //     size: 14,
        //     direction: 'up',
        //   }
        // }
  let designLabelText = status.design.design_info.title;
  let measurements = status.design.measurements;
  let measurementLabelText = '';

  for (let key in measurements) {
    measurementLabelText += `${measurements[key].value}-`;
    //if it's the last measurement, don't add a dash
    if (key === Object.keys(measurements)[Object.keys(measurements).length - 1]) {
      measurementLabelText = measurementLabelText.slice(0, -1); //remove the last dash
    }
  }

  let numSpaces = 1;

  for (let key in parts) {
    let part = parts[key];
    //part is an object with point, size, and direction
    //register the two part label

    //generate whitespace for the size label (so we can have multiple labels with the same text but different locations)
    let whitespace = '';
    //for each key in parts, add a space (not to the first. Second gets one space, third gets two, etc.)
    for (let i = 1; i < numSpaces; i++) {
      whitespace += ' ';
    }

    let sizeLabelText = `${measurementLabelText}${whitespace}`;
    numSpaces++;

    status = registerTwoPartLabel(status, part.point, `${designLabelText} (${key})`, `${sizeLabelText}`, part.direction, part.size);
  }

  return status;

  // Example usage:
  // let frontLabelPoint = setPoint(100, 100);
  // let sideLabelPoint = setPoint(200, 100);
  //
  // let parts = {
  //   'front': {
  //     point: frontLabelPoint,
  //     size: 14,
  //     direction: 'up',
  //   },
  //   'side': {
  //     point: sideLabelPoint,
  //     size: 14,
  //     direction: 'up',
  //   }
  // }
  // status = registerLabels(status, parts);
}

export function mirrorPoints(status, points, linePoint1, linePoint2) {
  //mirror a set of points across a line defined by two points
  //points is an object with keys as labels and values as points
  let mirroredPoints = {};
  for (let key in points) {
    let point;
    //if a point object is passed in, use it directly
    if (typeof points[key] === 'object' && points[key].x !== undefined && points[key].y !== undefined) {
    
      //it's a point object, so use it directly
      point = mirrorPoint(points[key], linePoint1, linePoint2);
    } else {
      //it's a label, so find the point in the status pattern
      //find the point in the status pattern
      point = status.pattern.points[points[key]];
    }
    let mirroredPoint = mirrorPoint(point, linePoint1, linePoint2);
    status = registerPoint(status, mirroredPoint, `${points[key]}m`);
  }
  //register the mirrored points to the status pattern
  return status;
}

export function mirrorPoint(point, linePoint1, linePoint2) {

  //mirror a point across a line defined by two points
  let x1 = linePoint1.x;
  let y1 = linePoint1.y;
  let x2 = linePoint2.x;
  let y2 = linePoint2.y;
  let x = point.x;
  let y = point.y;
  //find the slope of the line
  let m = (y2 - y1) / (x2 - x1);

  //if the line is vertical, we need to handle it differently
  if (x1 === x2) {
    //vertical line, so the slope is undefined
    //the mirrored point will have the same y, but the x will be mirrored across the line
    let mirroredX = 2 * x1 - x; //the x will be mirrored across the line
    let mirroredY = y; //the y will stay the same
    return setPoint(mirroredX, mirroredY);
  }
  //find the intercept of the line
  let b = y1 - m * x1;
  //find the perpendicular slope
  let mPerp = -1 / m;
  //find the intercept of the perpendicular line
  let bPerp = y - mPerp * x;
  //find the intersection of the two lines
  let xIntersect = (bPerp - b) / (m - mPerp);
  let yIntersect = m * xIntersect + b;
  //find the distance from the point to the intersection
  let dx = x - xIntersect;
  let dy = y - yIntersect;
  //find the mirrored point
  let mirroredX = xIntersect - dx;
  let mirroredY = yIntersect - dy;
  let mirroredPoint = setPoint(mirroredX, mirroredY);

  return mirroredPoint;
}

export function setPointLineY(status, point1, point2, y, guides, visible = true){
  //find x value where line between point1 and point2 crosses y

  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;

  let x = Math.round(x1 + (x2 - x1) * (y - y1) / (y2 - y1));
  let point = setPoint(x, y, guides, visible);

  return point;
}
export function setPointLineX(status, point1, point2, x, guides, visible = true){
  //find x value where line between point1 and point2 crosses y
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;

  let y = Math.round(y1 + (y2 - y1) * (x - x1) / (x2 - x1));
  let point = setPoint(x, y, guides, visible);

  return point;
}

export function setPointAlongLine(status, point1, point2, to3inInches, guides = {}, visible = true){
  //find point distance from point1 along line to point2
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  //distance is expected to be a percentage of the distance between point1 and point2
  let dist1to2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  let distance = (to3inInches * status.precision ) / dist1to2;
  //let distance = to3inInches * status.precision;

  let x = Math.round(x1 + (x2 - x1) * distance);
  let y = Math.round(y1 + (y2 - y1) * distance);
  status = setPoint(x, y, guides, visible);

  return status;
}

export function setPointLineCircle(status, point1, point2, center, radius, visible = true, flip = false) {
  //first, find the slope of the line between point1 and point2
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let m = (y2 - y1) / (x2 - x1);
  //then, find the intercept
  let b = y1 - m * x1;

  //then, find the equation of the circle
  let k = center.x;
  let h = center.y;

  //equation of circle is (x-h)^2 + (y-k)^2 = r^2
  //where h and k are the center of the circle, and r is the radius
  //substitute y = mx + b into the circle equation

  let a = 1 + m * m;
  let b2 = 2 * (m * (b - h) - k);
  let c = k * k + (b - h) * (b - h) - radius * radius;

  //if the line is vertical, we need to handle it differently
  if (x1 === x2) {
    //vertical line, so the slope is undefined
    //the mirrored point will have the same y, but the x will be mirrored across the line
    let newPoint = setPoint(x1, h + Math.sqrt(radius * radius - (x1 - k) * (x1 - k)), {}, visible);
    if (flip) {
      newPoint = setPoint(x1, h - Math.sqrt(radius * radius - (x1 - k) * (x1 - k)), {}, visible);
    }
    return newPoint;
  }

  //solve for x
  let x = Math.round((-b2 - Math.sqrt(b2 * b2 - 4 * a * c)) / (2 * a));
  let y = Math.round(m * x + b);
  let newPoint = setPoint(x, y, undefined, visible);
  //there may be two solutions, but we'll just use the first one for now
  if (flip) {
    //find the other intersection point
    x = Math.round((-b2 + Math.sqrt(b2 * b2 - 4 * a * c)) / (2 * a));
    y = Math.round(m * x + b);
    newPoint = setPoint(x, y, undefined, visible);
  }


  return newPoint;

}

export function setPointCircleCircle(_status, center1, r1, center2, r2, flip = false) {
  //find the intersection of two circles
  //the "flip" parameter is true or false, it determines which of the two points is used.
  //there wasn't a simple way to define which point to use, so this is a workaround that requires trial and error.
  let x1 = center1.x;
  let y1 = center1.y;
  let x2 = center2.x;
  let y2 = center2.y;

  let r1Squared = r1 * r1;
  let r2Squared = r2 * r2;
  let d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  if (d > r1 + r2 || d < Math.abs(r1 - r2)) {
    //no intersection
    return null;
  } 
  //find the intersection points
  let a = (r1Squared - r2Squared + d * d) / (2 * d);
  let h = Math.sqrt(r1Squared - a * a);
  let x0 = x1 + a * (x2 - x1) / d;
  let y0 = y1 + a * (y2 - y1) / d;
  let intersection1 = setPoint(x0 + h * (y2 - y1) / d, y0 - h * (x2 - x1) / d);
  let intersection2 = setPoint(x0 - h * (y2 - y1) / d, y0 + h * (x2 - x1) / d);

  if (flip) {
    return intersection2;
  } else {
    return intersection1;
  }
}

export function setEquilateralThirdPoint(_status, point1, point2) {
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;

  // Calculate the midpoint
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;

  // Calculate the distance between the two points
  let dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  // Calculate the height of the equilateral triangle
  let height = (Math.sqrt(3) / 2) * dist;

  // Calculate the coordinates of the third point
  let thirdX = midX - height * (y2 - y1) / dist;
  let thirdY = midY + height * (x2 - x1) / dist;

  return setPoint(thirdX, thirdY)
}


export function setPointLineLine(status, point1, point2, point3, point4, visible = true){
  //find the intersection of two lines, defined by points 1 and 2, and points 3 and 4
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let x3 = point3.x;
  let y3 = point3.y;
  let x4 = point4.x;
  let y4 = point4.y;

  let m1 = (y2 - y1) / (x2 - x1);
  let m2 = (y4 - y3) / (x4 - x3);
  let b1 = y1 - m1 * x1;
  let b2 = y3 - m2 * x3;

  let x = (b2 - b1) / (m1 - m2);
  let y = m1 * x + b1;
  status = setPoint(x, y, {}, visible);

  return status;

}

export function makeTouchPoint(_status, point1, point2, quarter, depth = 0.5, visible = true) {
  //make a point that provides a touch point for a bezier curve. 
  //mid is the halfway point between point1 and point2
  //corner is the outer corner of the curve, if it were a rectangle
  //Depth is a percentage from mid to the corner, so 0.5 is halfway, 1 is all the way to the corner
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  //calculate center from point1, point2, and quarter
  let corner = { x: 0, y: 0 };
  let mid = { x: 0, y: 0 };
  let touch = { x: 0, y: 0 };
  let dist = { x: 0, y: 0 };

  if (quarter == 1) {
    //center is below point1 and left of point2
    corner.x = point1.x;
    corner.y = point2.y;

    //find the halfway point between point1 and point2
    mid.y = (point1.y + point2.y) / 2;
    mid.x = (point1.x + point2.x) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point

    touch.x = mid.x + dist.x * depth;
    touch.y = mid.y - dist.y * depth;

  } else if (quarter == 2) {
    //center is left of point1 and above point2
    corner.x = point2.x;
    corner.y = point1.y;

    //find the halfway point between point1 and point2
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point

    touch.x = mid.x + dist.x * depth;
    touch.y = mid.y + dist.y * depth;
  } else if (quarter == 3) {
    //center is above point1 and right of point2
    corner.x = point1.x;
    corner.y = point2.y;

    //find the halfway point between point1 and point2
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point

    touch.x = mid.x - dist.x * depth;
    touch.y = mid.y + dist.y * depth;
  } else if (quarter == 4) {
    //center is right of point1 and below point2
    corner.x = point2.x;
    corner.y = point1.y;

    //find the halfway point between point1 and point2
    mid.x = (point1.x + point2.x) / 2;
    mid.y = (point1.y + point2.y) / 2;

    //distance from center to mid
    dist.x = Math.abs(corner.x - mid.x);
    dist.y = Math.abs(corner.y - mid.y);

    //find the x and y of the touch point
    touch.x = mid.x - dist.x * depth;
    touch.y = mid.y - dist.y * depth;
  } else if (quarter === undefined || quarter === null || quarter === 0) {
    //if quarter is not defined, assume it's horizontal or vertical
    //first, figure out if it's horizontal or vertical
    if (Math.abs(point1.y - point2.y) === 0) {
      //horizontal line, so depth is up (if positive) or down (if negative)
      //find the halfway point between point1 and point2
      mid.x = (point1.x + point2.x) / 2;
      mid.y = (point1.y + point2.y) / 2; 
      //touch point is mid.x and mid.y + depth
      touch.x = mid.x;
      touch.y = mid.y + depth;
    } else if (Math.abs(point1.x - point2.x) === 0) {
      //vertical line, so depth is left (if positive) or right (if negative)
      //find the halfway point between point1 and point2
      mid.x = (point1.x + point2.x) / 2;
      mid.y = (point1.y + point2.y) / 2;
      //touch point is mid.x + depth and mid.y
      touch.x = mid.x + depth;
      touch.y = mid.y;
    }
      
  }


  return setPoint(touch.x, touch.y, {}, visible);
}

export function setLine(status, start, end, style = 'solid', length = 'defined'){
  let line = {
    start: start,
    end: end,
    style: style, //solid, dashed
    length: length //either defined or continued (extending past end point)
  };
  status.pattern.lines.push(line);

  return status;
}

//new version of setCurve, using fewer parameters
export function setCurve(status, points, info){
  let curve = {
    points: points
  }

  //info is either quarter, time, or times
  //info = 1, 2, 3, or 4 (means quarter) (clockwise from 12 o'clock)
  //info = a number between 0 and 0.99999 (means time) (quadratic bezier)
  //info = an array of two numbers between 0 and 0.99999 (means times) (cubic bezier)
  //info = no info means the curve is an arc

  if (info === undefined){
    //check if there's a center point
    if (points.c === undefined && points.center === undefined){
      //type is quadratic bezier, default time is 0.5   
      curve.type = 'quadraticBezier';
      curve.time = 0.5;
      curve.points = checkPoints_quadraticBezier(points);
    } else {
      //type is arc
      curve.type = 'arc';
      curve.points = checkPoints_arc(points);
    }

  } else if (typeof info === 'number'){

    //check if it's a quarter
    if (info >= 0 && info < 1){
      //type is quadratic bezier     
      curve.type = 'quadraticBezier';
      curve.time = info;
      curve.points = checkPoints_quadraticBezier(points);
    } else if (info >= 1 && info <= 4){
      //type is ellipse
      curve.type = 'ellipse';
      curve.quarter = info;
      curve.points = checkPoints_ellipse(points);
    } else {
      //error
      console.log('error: info is not a valid quarter or time');
    }

  } else if (Array.isArray(info)){

    curve.type = 'cubicBezier';
    curve.times = info;
    curve.points = checkPoints_cubicBezier(points);

  } else {

    //if info is an object, it'll probably be {t1: 0.33, t2: 0.67}
    //check if it's an object
    if (typeof info === 'object'){
      //check if it's a cubic bezier
      if (info.t1 !== undefined && info.t2 !== undefined){
        curve.type = 'cubicBezier';
        curve.times = [info.t1, info.t2];
        curve.points = checkPoints_cubicBezier(points);
      } else {
        //error
        console.log('error: info is not a valid quarter or time');
      }
    } else {

    //error
    console.log('error: info is not a valid quarter or time');
    }
  }
  status.pattern.curves.push(curve);
  return status;
}

const findValue = function findValue(array, callback) {
  for (const item of array) {
    const result = callback(item);

    if (result !== undefined) return result;
  }
  return undefined;
};

function checkPoints_SE(curve_points, input_points){
  //check for start and end points

  curve_points.s = findValue(
    ['s', 'start', 'init'],
    (key) => input_points[key]
  );
  curve_points.e = findValue(
    ['e', 'end', 'finish'],
    (key) => input_points[key]
  );

  return curve_points;
}

function checkPoints_arc(input_points){
  //example of ideal points -- points: {s: 'K', c: 'G', e: 'E'}
  let points = {
    s: input_points.s,
    c: input_points.c,
    e: input_points.e
  };
  //check for start and end points
  points = checkPoints_SE(points, input_points);

  //check for center point
  //if a point is missing, look for an alternative label
  if (input_points.c === undefined){
    if (input_points.center !== undefined){
      points.c = input_points.center;
    } else {
      console.log('error: no center point for arc');
    }
  }
  return points;
}

function checkPoints_ellipse(input_points){
  //example of ideal points -- points: {s: 'K', e: 'E'}
  let points = {
    s: input_points.s,
    e: input_points.e
  };
  //check for start and end points
  points = checkPoints_SE(points, input_points);
  return points;
}

function checkPoints_quadraticBezier(input_points){
  //example of ideal points -- points: {s: 'K', g: 'G', e: 'E'}
  let points = {
    s: input_points.s,
    g: input_points.g,
    e: input_points.e
  };
  //check for start and end points
  points = checkPoints_SE(points, input_points);
  //check for guide point
  //if a point is missing, look for an alternative label
  if (input_points.g === undefined){
    if (input_points.guide !== undefined){
      points.g = input_points.guide;
    } else if (input_points.t !== undefined){
      points.g = input_points.t;
    }  else if (input_points.touch !== undefined){
      points.g = input_points.touch;
    } else 
      console.log('error: no guide point for quadratic bezier');
    }
  return points;
}

function checkPoints_cubicBezier(input_points){
  //example of ideal points -- points: {s: 'K', g1: 'G1', g2: 'G2', e: 'E'}
  let points = {
    s: input_points.s,
    g1: input_points.g1,
    g2: input_points.g2,
    e: input_points.e
  };
  //check for start and end points
  points = checkPoints_SE(points, input_points);
  //check for guide points
  //if a point is missing, look for an alternative label
  if (input_points.g1 === undefined){
    if (input_points.guide1 !== undefined){
      points.g1 = input_points.guide1;
    } else if (input_points.t1 !== undefined){
      points.g1 = input_points.t1;
    } else 
      console.log('error: no guide point for cubic bezier');
    }
  if (input_points.g2 === undefined){
    if (input_points.guide2 !== undefined){
      points.g2 = input_points.guide2;
    } else if (input_points.t2 !== undefined){
      points.g2 = input_points.t2;
    } else 
      console.log('error: no guide point for cubic bezier');
    }
  return points;
}

export function perimeterEllipse(_status, center, point1, point2){
  //calculates 1/4 of the ellipse circumference, based on the quarter
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  //calculate center from start, end, and quarter
  //find semi major and semi minor axes, not sure if point1 or point2 is larger
  let dist1 = Math.abs((center.x - point1.x)) + Math.abs((center.y - point1.y));
  let dist2 = Math.abs((center.x - point2.x)) + Math.abs((center.y - point2.y));
  //a is semi-major, the larger distance
  //b is semi-minor, the smaller distance
  let a = 0;
  let b = 0;
  if (dist1 > dist2){ 
    a = dist1;
    b = dist2;
  } else {
    a = dist2;
    b = dist1;
  }
  //h is the eccentricity
  let h = Math.abs(a - b) * (a - b) / (Math.abs(a + b) * (a + b));
  let perimeter = Math.PI * (a + b) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
  return perimeter;
  //return 10;
}
export function distPointToPoint(point1, point2){
  //find the distance between two points
  //point1 and point2 are objects with x and y properties
  return Math.round(Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y)));
}

export function distABC(status, pointa, pointb, pointc){
  const a = status.pattern.points[pointa];
  const b = status.pattern.points[pointb];
  const c = status.pattern.points[pointc];


  return Math.abs(distPointToPoint(a, b) + distPointToPoint(b, c));
}
//convert numbers to printable strings

function formatFraction(numInput){
  //num can be a string or a number
  let num = parseFloat(numInput);
  //return a whole number and/or a fraction, using halves, quarters, or eighths
  let whole = Math.floor(num);
  let fraction = num - whole;
  let fractionString = '';
  const fractions = {
    '1/8': 0.125,
    '1/4': 0.25,
    '3/8': 0.375,
    '1/2': 0.5,
    '5/8': 0.625,
    '3/4': 0.75,
    '7/8': 0.875
  }

  if (fraction !== 0){
    let bestFraction = '1/8';
    for (let key in fractions){
      if (Math.abs(fraction - fractions[key]) < Math.abs(fraction - fractions[bestFraction])){
        bestFraction = key;
      }
    }
    fractionString = bestFraction;
  }
  if (whole === 0){
    return fractionString;
  } else if (fractionString === ''){
    return `${whole}`;
  } else {
    return `${whole} ${fractionString}`;
  }
}

export function printMeasure(measure, math = 1){
  return printNum(measure.value, math);
}

export function printNum(num, math = 1){
  return `(${formatFraction(num * math)} in.)`;
}

//create shapes for pattern based on steps actions
function createShapes(status){
  let stepFuncs = status.design.steps;

  stepFuncs.forEach(step => {
    let action = step.action;
    status = action(status);
  });

  return status;
}

//turn steps_functions into steps strings, populated with the necessary numbers
function writeSteps(status){
  let steps = [];
  status.design.steps.forEach(step => {
    let description = step.description(status);
    steps.push(description);
  });
  status.pattern.steps = steps;
  return status;
}

export function makePattern(status){
  //loop through design's steps functions, passing measurements to each
  //create pattern, with steps, points, lines, and curves
  status.pattern = {
    points: {},
    lines: [],
    curves: [],
    steps: []
  };
  status = writeSteps(status);
  status = createShapes(status); //runs through steps.ations, populating points, lines, and curves
  return status;
}


