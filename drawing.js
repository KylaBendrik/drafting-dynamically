import {makePixels} from './pixels.js';
//turns pixel version of pattern into drawing instructions

export function drawPattern(status){
//first, turn pattern into pixels
  let pixelPattern = makePixels(status);
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px serif';
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;

//then, turn pixels into drawing instructions
  let drawing = {
    points: [],
    lines: [],
    curves: []
  };

  //draw points and their guides
  for (let point in pixelPattern.points){
    console.log(`drawPattern point:`, point);
    
    drawPoint(ctx, status, pixelPattern, point);
  }

  status.canvasInfo.drawing = drawing;
  console.log(`drawPattern`);
  return status;
}

//draws a point on the canvas
function drawPoint(ctx, status, pixelPattern, pointLabel){
  console.log('drawPoint pixelPattern');
  console.log(pixelPattern);
  let point = pixelPattern.points[pointLabel]
  console.log(point);
  let pointSize = status.canvasInfo.pointSize;
  let margin = status.canvasInfo.margin;
  let x = point.x;
  let y = point.y;
  let guides = point.guides;
  //draw point
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
  ctx.stroke();
  //draw point label
  ctx.fillText(`${point.label}`, x, y);

  //draw guides
  //guides are dashed
  ctx.setLineDash([5, 5]);
  if (guides.u){
    ctx.moveTo(x, y);
    ctx.lineTo(x, margin);
    ctx.stroke();
  }
  if (guides.d){
    ctx.moveTo(x, y);
    ctx.lineTo(x, pixelPattern.canvasSize.y - margin);
    ctx.stroke();
  }
  if (guides.l){
    ctx.moveTo(x, y);
    ctx.lineTo(margin, y);
    ctx.stroke();
  }
  if (guides.r){
    ctx.moveTo(x, y);
    ctx.lineTo(pixelPattern.canvasSize.x - margin, y);
    ctx.stroke();
  }

}
