import {makePixels} from './pixels.js';
//turns pixel version of pattern into drawing instructions

export function drawPattern(status){
//first, turn pattern into pixels
  let pixelPattern = makePixels(status);
//then, turn pixels into drawing instructions
  let drawing = {
    points: [],
    lines: [],
    curves: []
  };
  status.canvasInfo.drawing = drawing;
  console.log(`drawPattern(${status})`);
  return status;
}

//draws a point on the canvas
function drawPoint(ctx, point){
  let x = point.x;
  let y = point.y;
  let guides = point.guides;
  //draw point
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.stroke();
  //draw point label
  ctx.fillText(`(${point.label})`, x, y);

  //draw guides

}
