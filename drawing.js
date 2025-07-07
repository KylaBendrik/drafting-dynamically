import { makePixels } from './pixels.js';
import { cubicBezier } from './math/cubic_bezier.js';

export function drawPattern(status) {
  let pixelPattern = makePixels(status);
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = pixelPattern.canvasSize.x;
  canvas.height = pixelPattern.canvasSize.y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px serif';
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

  let drawing = {
    points: [],
    lines: [],
    curves: []
  };

  for (let point in pixelPattern.points) {
    drawPoint(ctx, status, pixelPattern, point);
  }

  for (let line of pixelPattern.lines) {
    let start = pixelPattern.points[line.start];
    let end = pixelPattern.points[line.end];

    // if (line.style === 'dashed') {
    //   ctx.setLineDash([5, 5]);
    //   ctx.strokeStyle = 'gray';
    // } else {  //solid
    //   ctx.setLineDash([]);
    //   ctx.strokeStyle = 'black';
    // }

    line.start = start;
    line.end = end;
    if (line.length === 'defined') {
      drawLine(ctx, line);
    } else {
      drawLine(ctx, line, true);
    }
  }

  for (let curve of pixelPattern.curves) {
    if (curve.style === 'dashed') {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'gray';
    } else {  //solid
      ctx.setLineDash([]);
      ctx.strokeStyle = 'black';
    }
    if (curve.type === 'bezier') {
      drawBezier(ctx, status, pixelPattern, curve);
    } else if (curve.type === 'arc') {
      drawArc(ctx, status, pixelPattern, curve);
    } else if (curve.type === 'ellipse') {
      drawQuarterEllipse(ctx, status, pixelPattern, curve);
    } else if (curve.type === 'quadraticBezier') {
      drawBezierQuadratic(ctx, status, pixelPattern, curve);
    } else if (curve.type === 'cubicBezier') {
      drawBezierCubic(ctx, status, pixelPattern, curve);
    }
  }

  status.canvasInfo.drawing = drawing;
  return status;
}

function drawPoint(ctx, status, pixelPattern, pointLabel) {
  let point = pixelPattern.points[pointLabel];
  let pointSize = status.canvasInfo.pointSize;
  let margin = status.canvasInfo.margin;
  let visible = point.visible;
  let x = point.x;
  let y = point.y;
  let guides = point.guides;

  if (visible === true) {
    ctx.beginPath();
    //make a small solid black square for the point

    ctx.rect(x - pointSize / 2, y - pointSize / 2, pointSize, pointSize);
    ctx.fill();
    //set label to the upper right by 15 pixels
    ctx.fillText(pointLabel, x + 5, y - 5);

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'gray';
    if (guides.u) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, margin);
      ctx.stroke();
    }
    if (guides.d) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, pixelPattern.canvasSize.y - margin);
      ctx.stroke();
    }
    if (guides.l) {
      ctx.moveTo(x, y);
      ctx.lineTo(margin, y);
      ctx.stroke();
    }
    if (guides.r) {
      ctx.moveTo(x, y);
      ctx.lineTo(pixelPattern.canvasSize.x - margin, y);
      ctx.stroke();
    }
  } else if (visible === 'label-right') {
    console.log(point)
    let size = point.size; //default size is 16px
    console.log(`Drawing point ${pointLabel} at (${x}, ${y}), size ${size}, visible as label-right`);
    //if visible is 'label', just draw the label
    //set label font size to 12px
    ctx.font = `${size}px serif`;
    ctx.fillStyle = 'black';
    ctx.fillText(pointLabel, x + 5, y - 5);
  } else if (visible === 'label-up') {
    console.log('drawing label-up')
    console.log(point)
    let size = point.size; //default size is 16px
    console.log(`Drawing point ${pointLabel} at (${x}, ${y}), size ${size}, visible as label-up`);
    //if visible is 'label', just draw the label
    //write text vertically, starting at the point
    ctx.font = `${size}px serif`;
    ctx.fillStyle = 'black';
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(pointLabel, 0, 0);
    ctx.restore();
  }

}

function drawLine(ctx, line, continued = false) {
  ctx.beginPath();
  ctx.moveTo(line.start.x, line.start.y);

  // style is either 'dashed', empty (for default solid), or {style: 'solid'}
  const defaultStyle = { style: 'solid' , color: 'black' , label: {text: '', visible: false, side: 'a' } };
  let style = {};
  if (!line.style) {
    style = defaultStyle;
  } else if (typeof line.style === 'string') {
    style = { style: line.style, color: 'black', label: { text: '', visible: false, side: 'a' } };
  } else if (typeof line.style === 'object') {
    // if style is an object, ensure it has a color and label
    style = {
      style: line.style.style || 'solid',
      color: line.style.color || 'black',
      label: line.style.label || { text: '', visible: false, side: 'a' }
    };
  }




  //style
  if (style.style === 'dashed') {
    ctx.setLineDash([5, 5]);
  } else {  //solid
    ctx.setLineDash([]);
    //ctx.strokeStyle = 'black';
  }
  
    ctx.strokeStyle = style.color;

  if (continued) {
    let dx = line.end.x - line.start.x;
    let dy = line.end.y - line.start.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    let scale = 400 / length;
    let offsetX = dx * scale;
    let offsetY = dy * scale;
    ctx.lineTo(line.end.x + offsetX, line.end.y + offsetY);
  } else {
    ctx.lineTo(line.end.x, line.end.y);
  }
  ctx.stroke();
}

function drawQuarterEllipse(ctx, _status, pixelPattern, curve) {
  //assume quarter of an ellipse
  let point1 = pixelPattern.points[curve.points.s];
  let point2 = pixelPattern.points[curve.points.e];
  let quarter = curve.quarter;
  //quarter 1, 2, 3, or 4, clockwise from 12 o'clock (so 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left)
  //calculate center from start, end, and quarter
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };
  let center = { x: 0, y: 0 };
  let startAngle = 0;
  let endAngle = 0;
  let radiusX = 0;
  let radiusY = 0;



  if (quarter === 1) {
    //center is below the start point and to the left of the end point
    //set start and end points, based on direction from center
    if (point1.x < point2.x) {
      //point1 is to the left of point2
      start = point1;
      end = point2;
    } else {
      start = point2;
      end = point1;
    }
    startAngle = 1 * Math.PI;
    endAngle = 0.5 * Math.PI;
    center = { x: start.x, y: end.y };
    radiusX = Math.abs(center.x - start.x);
    radiusY = Math.abs(center.y - start.y);

  } else if (quarter === 2) {
    //center is to the left of the start point and above the end point
    //set start and end points, based on direction from center
    if (point1.x > point2.x) {
      //point1 is to the right of point2
      start = point1;
      end = point2;
    } else {
      start = point2;
      end = point1;
    }
    startAngle = 2 * Math.PI;
    endAngle = 0.5 * Math.PI;
    center = { x: end.x, y: start.y };
    radiusX = Math.abs(center.x - start.x);
    radiusY = Math.abs(center.y - end.y);
  } else if (quarter === 3) {
    //center is above the start point and to the right of the end point
    //set start and end points, based on direction from center
    if (point1.x > point2.x) {
      //point1 is to the right of point2
      start = point1;
      end = point2;
    } else {
      start = point2;
      end = point1;
    }
    startAngle = 0.5 * Math.PI;
    endAngle = Math.PI;
    center = { x: start.x, y: end.y };
    radiusX = Math.abs(center.x - end.x);
    radiusY = Math.abs(center.y - start.y);

  } else if (quarter === 4) {
    //center is to the right of the start point and below the end point
    //set start and end points, based on direction from center
    if (point1.x < point2.x) {
      //point1 is to the left of point2
      start = point1;
      end = point2;
    } else {
      start = point2;
      end = point1;
    }
    startAngle = 1 * Math.PI;
    endAngle = 1.5 * Math.PI;
    center = { x: end.x, y: start.y };
    radiusX = Math.abs(center.x - start.x);
    radiusY = Math.abs(center.y - end.y);
  }
  ctx.beginPath();
  //draw quarter ellipse from start to end, centered on center
  
  ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, startAngle, endAngle);
  ctx.stroke();
}

function drawArc(ctx, _status, pixelPattern, curve) {
  //assume part of a circle, with start, ent, and center points
  let start = pixelPattern.points[curve.points.s];
  let end = pixelPattern.points[curve.points.e];
  let center = pixelPattern.points[curve.points.c];
  let startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  let endAngle = Math.atan2(end.y - center.y, end.x - center.x);
  let radius = Math.sqrt(Math.pow(start.x - center.x, 2) + Math.pow(start.y - center.y, 2));
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle);
  ctx.stroke();
}

function drawBezierCubic(ctx, _status, pixelPattern, curve) {
  //first, fix curve to match what cubicBezier expects
    let fixedCurve = {
      s: pixelPattern.points[curve.points.s],
      e: pixelPattern.points[curve.points.e]
    }

  if (curve.points.c1 && curve.points.c2) {
    //if there are two control points, use them
    fixedCurve = {
      s: pixelPattern.points[curve.points.s],
      e: pixelPattern.points[curve.points.e],
      c1: pixelPattern.points[curve.points.c1],
      c2: pixelPattern.points[curve.points.c2]
    }
  } else {
    fixedCurve = {
      s: pixelPattern.points[curve.points.s],
      e: pixelPattern.points[curve.points.e],
      g1: pixelPattern.points[curve.points.g1],
      g2: pixelPattern.points[curve.points.g2],
      times: curve.times
    }
  }

  let bezierCurve = cubicBezier(fixedCurve);

  let s = bezierCurve.s;
  let e = bezierCurve.e;
  let c1 = bezierCurve.c1;
  let c2 = bezierCurve.c2;

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.moveTo(s.x, s.y);
  //wider line for bezier
  ctx.lineWidth = 1;
  ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, e.x, e.y);
  ctx.stroke();
  
  ctx.lineWidth = 1;
}

function getDistance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function drawBezierQuadratic(ctx, _status, pixelPattern, curve) {
  let start = pixelPattern.points[curve.points.s];
  let end = pixelPattern.points[curve.points.e];
  let touch = pixelPattern.points[curve.points.g];
  let time = curve.time;

  let cp1 = { x: 0, y: 0 };
  let distST = getDistance(start, touch);
  let distTE = getDistance(touch, end);
  let total = distST + distTE;
  let ratio = distST / total;

  //if there is no provided time, set it to 0.5
  if (time === undefined) {

      //if there is no touch point, set time to 0.5, and use midRatio to get a nice mid-line curve
      time = 0.5;
      
      let midRatio = (time + ratio) / 2;

      cp1 = ctrlFromSTE(start, touch, end, midRatio);
  } else {
    //if there is a provided time, use that
    cp1 = ctrlFromSTE(start, touch, end, time);
  }

  //draw the control point
  ctx.beginPath();

 
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.strokeStyle = 'black';
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(cp1.x, cp1.y, end.x, end.y);
  ctx.stroke();
}

function ctrlFromSTE(s, t, e, time) {
  let cx = ctrlFromSTE_single(s.x, t.x, e.x, time);
  let cy = ctrlFromSTE_single(s.y, t.y, e.y, time);
  let c = {label: 'c', x: cx, y: cy};
  
  return c;
}

function ctrlFromSTE_single(s, t, e, time) {
  //t = s * (1 - time) * (1 - time) + c * 2 * time * (1 - time) + e * time * time
  //t - e * time * time - s * (1 - time) * (1 - time) = c * 2 * time * (1 - time)
  //c = (t - e * time * time - s * (1 - time) * (1 - time)) / (2 * time * (1 - time))
  let c = (t - e * time * time - s * (1 - time) * (1 - time)) / (2 * time * (1 - time))

  return c;
}