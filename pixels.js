export function makePixels(status) {
  const pattern = status.pattern;
  const margin = status.canvasInfo.margin;
  const pixelsPerInch = status.canvasInfo.pixelsPerInch;
  const defaultSize = {...status.canvasInfo.defaultSize};
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
    pixelPattern.canvasSize.x = width;
  }
  if (height > defaultSize.y) {
    pixelPattern.canvasSize.y = height;
  }

  return pixelPattern;
}

function convertPoint(label, point, pixelsPerInch, precision) {
  let x = (point.x / precision) * pixelsPerInch;
  let y = (point.y / precision) * pixelsPerInch;
  return { label: label, x: x, y: y, guides: point.guides };
}
