
//turn pattern into pixels
export function makePixels(status){
  pattern = status.pattern;
  const margin = status.canvasInfo.margin;
  const pixelsPerInch = status.canvasInfo.pixelsPerInch;
  const defaultSize = status.canvasInfo.size;
  const precision = status.precision;
  let pixelPattern = {
    points: {},
    lines: pattern.lines,
    curves: pattern.curves
  };
  //convert points to pixels
  for (let point in pattern.points){
    let pixelPoint = convertPoint(point, pattern.points[point], pixelsPerInch, precision);
    pixelPattern.points[point] = pixelPoint;
  }
  //move points so everything is in the right place
    //some points may be negative. In that case, move everything so that the smallest x and y are within the canvas margin.
    //most points will be negative x, but some may also have negative y
  let smallestX = margin.x;
  let smallestY = margin.y;
  for (let point in pixelPattern.points){
    let x = pixelPattern.points[point].x;
    let y = pixelPattern.points[point].y;
    if (x < smallestX){
      smallestX = x;
    }
    if (y < smallestY){
      smallestY = y;
    }
  }
  let xOffset = 0;
  let yOffset = 0;
  if (smallestX < margin){
    xOffset = margin - smallestX;
  }
  if (smallestY < margin){
    yOffset = margin - smallestY;
  }
  for (let point in pixelPattern.points){
    pixelPattern.points[point].x += xOffset;
    pixelPattern.points[point].y += yOffset;
  }
  //resize canvas if necessary
  let largestX = margin;  
  let largestY = margin;
  for (let point in pixelPattern.points){
    let x = pixelPattern.points[point].x;
    let y = pixelPattern.points[point].y;
    if (x > largestX){
      largestX = x;
    }
    if (y > largestY){
      largestY = y;
    }
  }
  let width = largestX + margin;
  let height = largestY + margin;
  if (width > defaultSize.x){
    defaultSize.x = width;
  }
  if (height > defaultSize.y){
    defaultSize.y = height;
  }

  //export status with updated drawing object
  return pixelPattern;
}

function convertPoint(label, point, pixelsPerInch, precision){
  let x = point.x * precision * pixelsPerInch;
  let y = point.y * precision * pixelsPerInch;
  return {label: label, x: x, y: y, guides: point.guides};
}