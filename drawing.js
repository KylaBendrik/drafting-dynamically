import { makePixels } from './pixels.js';

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

    if (line.style === 'dashed') {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'gray';
    } else {  //solid
      ctx.setLineDash([]);
      ctx.strokeStyle = 'black';
    }
    if (line.length === 'defined') {
      drawLine(ctx, start, end);
    } else {
      drawLine(ctx, start, end, true);
    }
  }

  for (let curve of pixelPattern.curves) {
    console.log('drawing curve');
    console.log(curve);
    if (curve.style === 'dashed') {
      console.log('dashed');
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'gray';
    } else {  //solid
      ctx.setLineDash([]);
      ctx.strokeStyle = 'black';
    }
    if (curve.type === 'bezier') {
      drawBezier(ctx, status, pixelPattern, curve);
    } else {
      drawQuarterEllipse(ctx, status, pixelPattern, curve);
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
  }

}

function drawLine(ctx, start, end, continued = false) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  if (continued) {
    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    let scale = 400 / length;
    let offsetX = dx * scale;
    let offsetY = dy * scale;
    ctx.lineTo(end.x + offsetX, end.y + offsetY);
  } else {
    ctx.lineTo(end.x, end.y);
  }
  ctx.stroke();
}

function drawQuarterEllipse(ctx, _status, pixelPattern, curve) {
  //assume quarter of an ellipse
  let point1 = pixelPattern.points[curve.points.start];
  let point2 = pixelPattern.points[curve.points.end];
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

function drawBezier(ctx, _status, pixelPattern, curve) {
  let start = pixelPattern.points[curve.points.start];
  let end = pixelPattern.points[curve.points.end];
  let control = pixelPattern.points[curve.points.cp1];
  let touch = pixelPattern.points[curve.points.touch];
  let cp1 = { x: 0, y: 0 };

  if (control === undefined) {
    let cx = 0;
    let cy = 0;
  
    if (touch === undefined) {
      //if there is no touch point, control point is at the corner of start and end points
      cx = (start.x + end.x)/2
      cy = (start.y + end.y)/2
    } else {
      //if there is a touch point, control point is calculated so the line should be close to the touch point
      cx = 2 * touch.x - 0.5 * (start.x + end.x)
      cy = 2 * touch.y - 0.5 * (start.y + end.y)
    }
    cp1 = {
      x: cx,
      y: cy
    }
  } else {
    //if control point is defined, use that
    cp1 = control;
  }
  console.log(curve)

  console.log(`start: ${start.x}, ${start.y}`);
  console.log(`cp1: ${cp1.x}, ${cp1.y}`);
  console.log(`end: ${end.x}, ${end.y}`);

    ctx.moveTo(start.x, start.y);
    ctx.strokeStyle = 'black';
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(cp1.x, cp1.y, end.x, end.y);
    ctx.stroke();
}