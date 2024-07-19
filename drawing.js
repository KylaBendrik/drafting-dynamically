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

  status.canvasInfo.drawing = drawing;
  return status;
}

function drawPoint(ctx, status, pixelPattern, pointLabel) {
  let point = pixelPattern.points[pointLabel];
  let pointSize = status.canvasInfo.pointSize;
  let margin = status.canvasInfo.margin;
  let x = point.x;
  let y = point.y;
  let guides = point.guides;

  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillText(`${point.label}`, x, y);

  ctx.setLineDash([5, 5]);
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
