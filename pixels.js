export function makePixels(status) {
  console.log('makePixels');
  console.log(status);
  const pattern = status.pattern;
  const margin = status.canvasInfo.margin;
  const pixelsPerInch = status.canvasInfo.pixelsPerInch;
  const defaultSize = status.canvasInfo.defaultSize;
  console.log(`defaultSize:`);
  console.log(defaultSize);
  const precision = status.precision;
  let pixelPattern = {
    points: {},
    lines: pattern.lines,
    curves: pattern.curves,
    canvasSize: defaultSize,
  };

  let smallestX = margin;
  let smallestY = margin;
  let largestX = margin;
  let largestY = margin;

  for (let point in pattern.points) {
    let pixelPoint = convertPoint(point, pattern.points[point], pixelsPerInch, precision);
    pixelPattern.points[point] = pixelPoint;

    let x = pixelPoint.x;
    let y = pixelPoint.y;

    if (x < smallestX) {
      smallestX = x;
    }
    if (y < smallestY) {
      smallestY = y;
    }
    if (x > largestX) {
      largestX = x;
    }
    if (y > largestY) {
      largestY = y;
    }
  }

  let xOffset = 0;
  let yOffset = 0;
  if (smallestX < margin) {
    xOffset = margin - smallestX;
  }
  if (smallestY < margin) {
    yOffset = margin - smallestY;
  }

  for (let point in pixelPattern.points) {
    pixelPattern.points[point].x += xOffset;
    pixelPattern.points[point].y += yOffset;
  }

  let newLargestX = largestX + xOffset;
  let newLargestY = largestY + yOffset;

  let width = newLargestX + margin;
  let height = newLargestY + margin;
  
  if (width > defaultSize.x) {
    
    console.log(`width ${width} is greater than defaultSize.x ${defaultSize.x}`);
    pixelPattern.canvasSize.x = width;
  } else {
    console.log(`width ${width} is less than defaultSize.x ${defaultSize.x}`);
  }
  if (height > defaultSize.y) {
    console.log(`height ${height} is greater than defaultSize.y ${defaultSize.y}`);
    pixelPattern.canvasSize.y = height;
  } else {
    console.log(`height ${height} is less than defaultSize.y ${defaultSize.y}`);
  }
  console.log('pixelPattern');
  console.log(pixelPattern);
  return pixelPattern;
}

function convertPoint(label, point, pixelsPerInch, precision) {
  let x = (point.x / precision) * pixelsPerInch;
  let y = (point.y / precision) * pixelsPerInch;
  return { label: label, x: x, y: y, guides: point.guides };
}
