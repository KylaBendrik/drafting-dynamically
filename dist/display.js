// pattern.js
function inchesToPrecision(status2, inches) {
  const precision = status2.precision;
  return Math.round(inches * precision);
}
function setPoint(x, y, guides) {
  let tempGuide = { u: false, d: false, l: false, r: false };
  if (guides === void 0) {
    guides = tempGuide;
  } else {
    guides = { ...tempGuide, ...guides };
  }
  let point = { x, y, guides };
  return point;
}
function setLine(status2, start, end, style = "solid", length = "defined") {
  let line = {
    start,
    end,
    style,
    length
    //either defined or continued (extending past end point)
  };
  status2.pattern.lines.push(line);
  return status2;
}
function setPointLineY(status2, point1, point2, y, guides) {
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let x = Math.round(x1 + (x2 - x1) * (y - y1) / (y2 - y1));
  let point = setPoint(x, y, guides);
  return point;
}
function setPointLineX(status2, point1, point2, x, guides) {
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let y = Math.round(y1 + (y2 - y1) * (x - x1) / (x2 - x1));
  let point = setPoint(x, y, guides);
  return point;
}
function setPointAlongLine(status2, point1, point2, to3inInches, guides) {
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let dist1to2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  let distance = to3inInches * status2.precision / dist1to2;
  let x = Math.round(x1 + (x2 - x1) * distance);
  let y = Math.round(y1 + (y2 - y1) * distance);
  status2 = setPoint(x, y, guides);
  return status2;
}
function setPointLineCircle(status2, point1, point2, center, radius) {
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let m = (y2 - y1) / (x2 - x1);
  let b = y1 - m * x1;
  let k = center.x;
  let h = center.y;
  let a = 1 + m * m;
  let b2 = 2 * (m * (b - h) - k);
  let c = k * k + (b - h) * (b - h) - radius * radius;
  let x = (-b2 - Math.sqrt(b2 * b2 - 4 * a * c)) / (2 * a);
  let y = m * x + b;
  status2 = setPoint(x, y);
  return status2;
}
function setCurve(status2, startPoint, endPoint, quarter) {
  let curve = {
    start: startPoint,
    end: endPoint,
    quarter
  };
  status2.pattern.curves.push(curve);
  return status2;
}
function perimeterEllipse(_status, center, point1, point2) {
  let dist1 = Math.abs(center.x - point1.x) + Math.abs(center.y - point1.y);
  let dist2 = Math.abs(center.x - point2.x) + Math.abs(center.y - point2.y);
  let a = 0;
  let b = 0;
  if (dist1 > dist2) {
    a = dist1;
    b = dist2;
  } else {
    a = dist2;
    b = dist1;
  }
  let h = Math.abs(a - b) * (a - b) / (Math.abs(a + b) * (a + b));
  let perimeter = Math.PI * (a + b) * (1 + 3 * h / (10 + Math.sqrt(4 - 3 * h)));
  return perimeter;
}
function distPointToPoint(point1, point2) {
  return Math.round(Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y)));
}
function distABC(status2, pointa, pointb, pointc) {
  const a = status2.pattern.points[pointa];
  const b = status2.pattern.points[pointb];
  const c = status2.pattern.points[pointc];
  return Math.abs(distPointToPoint(a, b) + distPointToPoint(b, c));
}
function formatFraction(numInput) {
  let num = parseFloat(numInput);
  let whole = Math.floor(num);
  let fraction = num - whole;
  let fractionString = "";
  const fractions = {
    "1/8": 0.125,
    "1/4": 0.25,
    "3/8": 0.375,
    "1/2": 0.5,
    "5/8": 0.625,
    "3/4": 0.75,
    "7/8": 0.875
  };
  if (fraction !== 0) {
    let bestFraction = "1/8";
    for (let key in fractions) {
      if (Math.abs(fraction - fractions[key]) < Math.abs(fraction - fractions[bestFraction])) {
        bestFraction = key;
      }
    }
    fractionString = bestFraction;
  }
  if (whole === 0) {
    return fractionString;
  } else if (fractionString === "") {
    return `${whole}`;
  } else {
    return `${whole} ${fractionString}`;
  }
}
function printMeasure(measure, math = 1) {
  return printNum(measure.value, math);
}
function printNum(num, math = 1) {
  return `(${formatFraction(num * math)} in.)`;
}
function createShapes(status2) {
  let stepFuncs = status2.design.steps;
  stepFuncs.forEach((step) => {
    let action = step.action;
    status2 = action(status2);
  });
  return status2;
}
function writeSteps(status2) {
  let steps2 = [];
  status2.design.steps.forEach((step) => {
    let description = step.description(status2);
    steps2.push(description);
  });
  status2.pattern.steps = steps2;
  return status2;
}
function makePattern(status2) {
  status2.pattern = {
    points: {},
    lines: [],
    curves: [],
    steps: []
  };
  status2 = writeSteps(status2);
  status2 = createShapes(status2);
  return status2;
}

// designs/keystone_single-breasted-vest.js
var design_info = {
  title: "Keystone - Single Breasted Vest",
  source: {
    link: "https://archive.org/details/keystonejacketdr00heck/page/66/mode/2up",
    label: "The Keystone Jacket and Dress Cutter (pg 66)"
  },
  designer: "Charles Hecklinger"
};
var measurements = {
  backLength: { label: "Back Length", value: 15 },
  frontLength: { label: "Front Length", value: 18.25 },
  blade: { label: "Blade", value: 10 },
  heightUnderArm: { label: "Height Under Arm", value: 7.5 },
  breast: { label: "Breast", value: 36 },
  waist: { label: "Waist", value: 25 },
  lengthOfFront: { label: "Length of Front", value: 23 },
  shoulder: { label: "Desired Shoulder Change", value: 1 },
  neckline: { label: "Neckline", value: 10 }
};
var steps = [
  {
    description: (_status) => {
      return "Set point O in upper right of canvas";
    },
    action: (status2) => {
      status2.pattern.points["O"] = setPoint(0, 0, { d: true, l: true });
      return status2;
    }
  },
  {
    description: (_status) => {
      return "Point 1 is 3/4 inch down from O";
    },
    action: (status2) => {
      status2.pattern.points["1"] = setPoint(0, inchesToPrecision(status2, 3 / 4));
      return status2;
    }
  },
  {
    description: (status2) => {
      return `From point 1, go down the back length ${printMeasure(status2.design.measurements.backLength)} to define point B`;
    },
    action: (status2) => {
      let point1 = status2.pattern.points["1"];
      let pointb_y = point1.y + inchesToPrecision(status2, parseFloat(status2.design.measurements.backLength.value));
      status2.pattern.points["B"] = setPoint(0, pointb_y, { l: true });
      return status2;
    }
  },
  {
    description: (status2) => {
      return `From point B, go up the height under arm ${printMeasure(status2.measurements.heightUnderArm)} to define point A`;
    },
    action: (status2) => {
      let pointB = status2.pattern.points["B"];
      status2.pattern.points["A"] = setPoint(0, pointB.y - inchesToPrecision(status2, parseFloat(status2.measurements.heightUnderArm.value)), { l: true });
      return status2;
    }
  },
  {
    description: (status2) => {
      return `B to D is 1/24 breast ${printMeasure(status2.measurements.breast, 1 / 24)} to the left of B`;
    },
    action: (status2) => {
      let pointB = status2.pattern.points["B"];
      status2.pattern.points["D"] = setPoint(pointB.x - inchesToPrecision(status2, parseFloat(status2.measurements.breast.value) / 24), pointB.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return "Draw back line from 1 to D";
    },
    action: (status2) => {
      status2 = setLine(status2, "1", "D");
      return status2;
    }
  },
  {
    description: (_status) => {
      return "Point A1 is where the line 1-D crosses line extending left from A";
    },
    action: (status2) => {
      let point1 = status2.pattern.points["1"];
      let pointA = status2.pattern.points["A"];
      let pointD = status2.pattern.points["D"];
      status2.pattern.points["A1"] = setPointLineY(status2, point1, pointD, pointA.y);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point K is the blade measure ${printMeasure(status2.measurements.blade)} left from A1`;
    },
    action: (status2) => {
      const blade = parseFloat(status2.measurements.blade.value);
      const pointA1 = status2.pattern.points["A1"];
      status2.pattern.points["K"] = setPoint(pointA1.x - inchesToPrecision(status2, blade), pointA1.y, { u: true, d: true });
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point L is 3/8 of the blade measure ${printMeasure(status2.measurements.blade, 3 / 8)} right of K`;
    },
    action: (status2) => {
      const blade = parseFloat(status2.measurements.blade.value);
      const pointK = status2.pattern.points["K"];
      status2.pattern.points["L"] = setPoint(pointK.x + inchesToPrecision(status2, blade * 3 / 8), pointK.y, { u: true, d: true });
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point J is at the intersection of the line down from K and the line left from B`;
    },
    action: (status2) => {
      const pointK = status2.pattern.points["K"];
      const pointB = status2.pattern.points["B"];
      status2.pattern.points["J"] = setPoint(pointK.x, pointB.y);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point 2 is 3/16 of the blade measure ${printMeasure(status2.measurements.blade, 3 / 16)} left from O`;
    },
    action: (status2) => {
      const blade = parseFloat(status2.measurements.blade.value);
      status2.pattern.points["2"] = setPoint(0 - inchesToPrecision(status2, blade * 3 / 16), 0);
      console.log(status2);
      status2 = setCurve(status2, "1", "2", 3);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point G is 1/2 the breast measure ${printMeasure(_status.measurements.breast, 1 / 2)} to the left of A1`;
    },
    action: (status2) => {
      const pointA1 = status2.pattern.points["A1"];
      status2.pattern.points["G"] = setPoint(pointA1.x - inchesToPrecision(status2, parseFloat(status2.measurements.breast.value) / 2), pointA1.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point P is halfway between points G and K. Draw guide up from P`;
    },
    action: (status2) => {
      const pointG = status2.pattern.points["G"];
      const pointK = status2.pattern.points["K"];
      const diffGK = Math.abs(pointG.x - pointK.x);
      status2.pattern.points["P"] = setPoint((pointG.x + pointK.x) / 2, pointG.y, { u: true });
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point E is found by going up the front length - the width of top of back from 1 inch to the left of J up to meet the line up from P. E may be above or below the top line.`;
    },
    action: (status2) => {
      const pointJ = status2.pattern.points["J"];
      const pointP = status2.pattern.points["P"];
      status2.pattern.points["E"] = findPointE(status2, pointJ, pointP);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point F is 1/12 breast ${printMeasure(status2.measurements.breast, 1 / 12)} to the left of E`;
    },
    action: (status2) => {
      const pointE = status2.pattern.points["E"];
      status2.pattern.points["F"] = setPoint(pointE.x - inchesToPrecision(status2, parseFloat(status2.measurements.breast.value) / 12), pointE.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Draw line from F through G, extending below the waist line`;
    },
    action: (status2) => {
      status2 = setLine(status2, "F", "G", "dashed", "continued");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point N is on this line from F to G, 1/12 of the breast down from F`;
    },
    action: (status2) => {
      const pointF = status2.pattern.points["F"];
      const pointG = status2.pattern.points["G"];
      const dist = parseFloat(status2.measurements.breast.value) / 12;
      status2.pattern.points["N"] = setPointAlongLine(status2, pointF, pointG, dist);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point Y is 3/4 ${printNum(distOtoA(status2) * 3 / 4)} of the way up from L to the line from O`;
    },
    action: (status2) => {
      const pointL = status2.pattern.points["L"];
      const pointO = status2.pattern.points["O"];
      const x = pointL.x;
      const y = pointO.y + (pointL.y - pointO.y) * 1 / 4;
      status2.pattern.points["Y"] = setPoint(x, y);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point Z is 5/8 ${printNum(distOtoA(status2) * 5 / 8)} of the way up from L to the line from O`;
    },
    action: (status2) => {
      const pointL = status2.pattern.points["L"];
      const pointO = status2.pattern.points["O"];
      const x = pointL.x;
      const y = pointO.y + (pointL.y - pointO.y) * 3 / 8;
      status2.pattern.points["Z"] = setPoint(x, y);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point 9 is 1/6 of the breast ${printMeasure(status2.measurements.breast, 1 / 6)} to the left of O`;
    },
    action: (status2) => {
      status2.pattern.points["9"] = setPoint(-inchesToPrecision(status2, parseFloat(status2.measurements.breast.value) / 6), 0, { d: true });
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Draw line from 2 to Z, and one from E to Y`;
    },
    action: (status2) => {
      status2 = setLine(status2, "2", "Z", "dashed");
      status2 = setLine(status2, "E", "Y", "dashed");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point X is where the line from 2 to Z crosses the line down from 9`;
    },
    action: (status2) => {
      const point2 = status2.pattern.points["2"];
      const pointZ = status2.pattern.points["Z"];
      const point9 = status2.pattern.points["9"];
      let x9 = 0 + point9.x;
      status2.pattern.points["X"] = setPointLineX(status2, point2, pointZ, x9);
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point 3 is the desired shoulder change ${printMeasure(status2.measurements.shoulder)} closer to point 2 along the line from 2 to X`;
    },
    action: (status2) => {
      const point2 = status2.pattern.points["2"];
      const pointX = status2.pattern.points["X"];
      status2.pattern.points["3"] = setPointAlongLine(status2, pointX, point2, parseFloat(status2.measurements.shoulder.value));
      status2 = setLine(status2, "2", "3");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point 14 is along the line from E to Y, the same distance as 3 to 2`;
    },
    action: (status2) => {
      const pointE = status2.pattern.points["E"];
      const pointY = status2.pattern.points["Y"];
      const point2 = status2.pattern.points["2"];
      const point3 = status2.pattern.points["3"];
      const a = Math.abs(point3.x - point2.x);
      const b = Math.abs(point3.y - point2.y);
      const c = a * a + b * b;
      const distance = Math.sqrt(c);
      status2.pattern.points["14"] = setPointAlongLine(status2, pointE, pointY, distance / status2.precision);
      status2 = setLine(status2, "14", "E");
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point 12 is 1/4 the breast measurement ${printMeasure(status2.measurements.breast, 1 / 4)} from A1 to G`;
    },
    action: (status2) => {
      const pointA1 = status2.pattern.points["A1"];
      const pointG = status2.pattern.points["G"];
      const dist = parseFloat(status2.measurements.breast.value) / 4;
      status2.pattern.points["12"] = setPointAlongLine(status2, pointA1, pointG, dist);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point 00 is the same distance as Z.x to X.x, left of K, and halfway between Z and K up from K`;
    },
    action: (status2) => {
      const pointZ = status2.pattern.points["Z"];
      const pointX = status2.pattern.points["X"];
      const pointK = status2.pattern.points["K"];
      const xdistance = Math.abs(pointZ.x - pointX.x);
      status2.pattern.points["00"] = setPoint(pointK.x - xdistance, (pointK.y + pointZ.y) / 2, { u: true, d: true });
      return status2;
    }
  },
  {
    description: (_status) => {
      return `curve the armhole from 00 to 12, from 14 to 12, and from 00 to 3`;
    },
    action: (status2) => {
      status2 = setCurve(status2, "12", "3", 2);
      status2 = setCurve(status2, "00", "12", 3);
      status2 = setLine(status2, "14", "00");
      return status2;
    }
  },
  {
    description: (status2) => {
      return `To start making the darts, divide the distance from G to K into 3 parts ${printNum((parseFloat(status2.measurements.breast.value) / 2 - parseFloat(status2.measurements.blade.value)) / 3)}, giving points S and T.`;
    },
    action: (status2) => {
      const pointG = status2.pattern.points["G"];
      const pointK = status2.pattern.points["K"];
      const dist = Math.round((pointG.x - pointK.x) / 3);
      status2.pattern.points["S"] = setPoint(pointG.x - dist, pointG.y);
      status2.pattern.points["T"] = setPoint(pointG.x - dist * 2, pointG.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point U is 1/2 inch right of S`;
    },
    action: (status2) => {
      const pointS = status2.pattern.points["S"];
      status2.pattern.points["U"] = setPoint(pointS.x + inchesToPrecision(status2, 0.5), pointS.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point H is at the height of B, where the line extends from F through G`;
    },
    action: (status2) => {
      const pointF = status2.pattern.points["F"];
      const pointG = status2.pattern.points["G"];
      const pointB = status2.pattern.points["B"];
      status2.pattern.points["H"] = setPointLineY(status2, pointF, pointG, pointB.y);
      status2 = setLine(status2, "G", "H", "dashed");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Also divide H to J into three parts to give points Q and R `;
    },
    action: (status2) => {
      const pointH = status2.pattern.points["H"];
      const pointJ = status2.pattern.points["J"];
      const dist = (pointH.x - pointJ.x) / 3;
      status2.pattern.points["Q"] = setPoint(pointH.x - dist, pointH.y);
      status2.pattern.points["R"] = setPoint(pointH.x - dist * 2, pointH.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Draw two lines, one from U to Q and one from T to R, continuing below the waist line`;
    },
    action: (status2) => {
      status2 = setLine(status2, "U", "Q", "dashed", "continued");
      status2 = setLine(status2, "T", "R", "dashed", "continued");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `To find the dart difference, measure along the waistline from D to H and subract 1 inch. Then subtract half the waist to get the difference. Each dart will get half of this equally on either side of points Q (which makes points 4 and 5) and R (to make points 6 and 7).`;
    },
    action: (status2) => {
      const pointD = status2.pattern.points["D"];
      const pointH = status2.pattern.points["H"];
      const pointQ = status2.pattern.points["Q"];
      const pointR = status2.pattern.points["R"];
      const dist = Math.abs(pointH.x - pointD.x) - inchesToPrecision(status2, 1);
      const waist = parseFloat(status2.measurements.waist.value) * status2.precision / 2;
      const diff = (dist - waist) / 4;
      console.log(`dist: ${dist}, waist: ${waist}, diff: ${diff}`);
      status2.pattern.points["4"] = setPoint(pointQ.x - diff, pointQ.y);
      status2.pattern.points["5"] = setPoint(pointQ.x + diff, pointQ.y);
      status2.pattern.points["6"] = setPoint(pointR.x - diff, pointR.y);
      status2.pattern.points["7"] = setPoint(pointR.x + diff, pointR.y);
      console.log(status2);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point V is 1/3 of the way from U to Q, and W between T and R a half an inch higher than V`;
    },
    action: (status2) => {
      const pointU = status2.pattern.points["U"];
      const pointQ = status2.pattern.points["Q"];
      const pointT = status2.pattern.points["T"];
      const pointR = status2.pattern.points["R"];
      const a = Math.abs(pointU.x - pointQ.x);
      const b = Math.abs(pointU.y - pointQ.y);
      const dist = Math.round(Math.sqrt(a * a + b * b) / 3) / status2.precision;
      status2.pattern.points["V"] = setPointAlongLine(status2, pointU, pointQ, dist);
      const wY = status2.pattern.points["V"].y - inchesToPrecision(status2, 0.5);
      status2.pattern.points["W"] = setPointLineY(status2, pointT, pointR, wY);
      status2 = setLine(status2, "V", "4");
      status2 = setLine(status2, "V", "5");
      status2 = setLine(status2, "W", "6");
      status2 = setLine(status2, "W", "7");
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point 9b is 1/4 of the waist ${printMeasure(status2.measurements.waist, -1 / 4)} + 1 inch  to the left of D`;
    },
    action: (status2) => {
      const pointD = status2.pattern.points["D"];
      const waist = parseFloat(status2.measurements.waist.value) / 4;
      const distD9 = inchesToPrecision(status2, waist + 1);
      console.log(`distD9 = ${waist} + 1 = ${distD9}`);
      status2.pattern.points["9b"] = setPoint(pointD.x - distD9, pointD.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `From the front at H to 4, 5 to 6, and 7 to 8, place another 1/4 of the waist - 1 inch to find point 8`;
    },
    action: (status2) => {
      const pointH = status2.pattern.points["H"];
      const point4 = status2.pattern.points["4"];
      const point5 = status2.pattern.points["5"];
      const point6 = status2.pattern.points["6"];
      const point7 = status2.pattern.points["7"];
      const distH4 = Math.abs(pointH.x - point4.x);
      const dist56 = Math.abs(point5.x - point6.x);
      const waist = (parseFloat(status2.measurements.waist.value) / 4 - 1.5) * status2.precision;
      const dist78 = Math.abs(waist - distH4 - dist56);
      status2.pattern.points["8"] = setPoint(point7.x + dist78, pointH.y);
      status2 = setLine(status2, "12", "8");
      status2 = setLine(status2, "12", "9b");
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point M is along the line from F to H, where the length of the front ${printMeasure(status2.measurements.lengthOfFront)} from E meets it.`;
    },
    action: (status2) => {
      const pointF = status2.pattern.points["F"];
      const pointH = status2.pattern.points["H"];
      const pointE = status2.pattern.points["E"];
      const wtb = widthTopBack(status2);
      const dist = parseFloat(status2.measurements.lengthOfFront.value) * status2.precision - wtb;
      status2.pattern.points["M"] = setPointLineCircle(status2, pointF, pointH, pointE, dist);
      status2 = setLine(status2, "H", "M", "dashed");
      return status2;
    }
  },
  {
    description: (status2) => {
      return `Point e is below point 12, 1/2 of the way between 8 and M's height`;
    },
    action: (status2) => {
      const point8 = status2.pattern.points["8"];
      const pointM = status2.pattern.points["M"];
      const point12 = status2.pattern.points["12"];
      const y = point8.y - (point8.y - pointM.y) / 2;
      status2.pattern.points["e"] = setPoint(point12.x, y, { r: true });
      status2 = setLine(status2, "e", "12", "dashed");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Lowest front point (M1) is 1/2 the distance between H and 4  to the right of M. Draw a dashed line from e to M1`;
    },
    action: (status2) => {
      const pointH = status2.pattern.points["H"];
      const point4 = status2.pattern.points["4"];
      const pointM = status2.pattern.points["M"];
      const x = pointM.x + Math.abs(pointH.x - point4.x) / 2;
      status2.pattern.points["M1"] = setPoint(x, pointM.y);
      status2 = setLine(status2, "e", "M1", "dashed");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `On the line from M1 to e, points B and D are at thirds.`;
    },
    action: (status2) => {
      const pointM1 = status2.pattern.points["M1"];
      const pointe = status2.pattern.points["e"];
      const dist = Math.round(distPointToPoint(pointM1, pointe) / 3) / status2.precision;
      status2.pattern.points["b"] = setPointAlongLine(status2, pointM1, pointe, dist);
      status2.pattern.points["d"] = setPointAlongLine(status2, pointM1, pointe, dist * 2);
      status2 = setLine(status2, "b", "5");
      status2 = setLine(status2, "d", "7");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `True up the other side of the dart from W to 6 to find c`;
    },
    action: (status2) => {
      let distdw = distABC(status2, "d", "7", "W");
      const pointW = status2.pattern.points["W"];
      const point6 = status2.pattern.points["6"];
      let disty = distdw - distPointToPoint(pointW, point6);
      let y = point6.y + disty;
      status2.pattern.points["c"] = setPoint(point6.x, y);
      status2 = setLine(status2, "6", "c");
      status2 = setLine(status2, "b", "c");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `True up the other side of the dart from V to 4 to find a. M2 is along the line from M to H, at the height halfway between b and c`;
    },
    action: (status2) => {
      let distbV = distABC(status2, "b", "5", "V");
      const pointV = status2.pattern.points["V"];
      const pointQ = status2.pattern.points["Q"];
      const point4 = status2.pattern.points["4"];
      const pointb = status2.pattern.points["b"];
      const m = (pointV.y - pointQ.y) / (pointV.x - pointQ.x);
      const b = point4.y - m * point4.x;
      const y = pointb.y;
      const x = (y - b) / m;
      status2.pattern.points["a"] = setPoint(x, y);
      status2 = setLine(status2, "4", "a");
      status2 = setLine(status2, "M1", "a");
      status2.pattern.points["M2"] = setPointLineY(status2, status2.pattern.points["M"], status2.pattern.points["H"], (status2.pattern.points["b"].y + status2.pattern.points["c"].y) / 2);
      status2 = setLine(status2, "M1", "M2");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point f is 1/2 inch right of e`;
    },
    action: (status2) => {
      const pointe = status2.pattern.points["e"];
      status2.pattern.points["f"] = setPoint(pointe.x + inchesToPrecision(status2, 0.5), pointe.y);
      status2 = setLine(status2, "9b", "f");
      status2 = setLine(status2, "8", "e");
      status2 = setLine(status2, "d", "e");
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point 15 is 12 of the blade measure left of A1 and 1/2 inch below V`;
    },
    action: (status2) => {
      const blade = parseFloat(status2.measurements.blade.value);
      const pointA1 = status2.pattern.points["A1"];
      const pointD = status2.pattern.points["D"];
      const point12 = status2.pattern.points["12"];
      const point9b = status2.pattern.points["9b"];
      const pointV = status2.pattern.points["V"];
      const point12_9bIntersect = setPointLineY(status2, point12, point9b, pointV.y);
      const pointA1_DIntersect = setPointLineY(status2, pointA1, pointD, pointV.y);
      status2.pattern.points["15"] = setPoint((pointA1_DIntersect.x + point12_9bIntersect.x) / 2, pointV.y + inchesToPrecision(status2, 0.5));
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point 16 is 1/3 of the way from f to D`;
    },
    action: (status2) => {
      const pointf = status2.pattern.points["f"];
      const pointD = status2.pattern.points["D"];
      const dist = Math.abs(pointf.x - pointD.x) / 3;
      status2.pattern.points["16"] = setPoint(pointf.x + dist, pointf.y);
      return status2;
    }
  },
  {
    description: (_status) => {
      return `Point D1 is right below D. Point g is right of f. D to D1 and D1 to g are the same distance`;
    },
    action: (status2) => {
      const pointD = status2.pattern.points["D"];
      const pointf = status2.pattern.points["f"];
      let angle = 50;
      const angleRad = angle * (Math.PI / 180);
      let r = (pointD.y - pointf.y) / (1 + Math.sin(angleRad));
      let xg = pointD.x + r * Math.cos(angleRad);
      let pointD1 = { x: pointD.x, y: pointD.y - r };
      let pointG = { x: xg, y: pointf.y };
      status2.pattern.points["D1"] = setPoint(pointD1.x, pointD1.y);
      status2.pattern.points["g"] = setPoint(pointG.x, pointG.y);
      status2 = setLine(status2, "D", "D1");
      status2 = setLine(status2, "D1", "g");
      status2 = setLine(status2, "15", "16", "dashed");
      status2 = setLine(status2, "g", "f", "dashed");
      return status2;
    }
  }
];
function widthTopBack(status2) {
  console.log(status2);
  const point1 = status2.pattern.points["1"];
  const point2 = status2.pattern.points["2"];
  const center = status2.pattern.points["O"];
  const p = perimeterEllipse(status2, center, point1, point2);
  return p / 4;
}
function findPointE(status2, pointJ, pointP) {
  const pointj = setPoint(pointJ.x - 1 * status2.precision, pointJ.y);
  const frontLength = parseFloat(status2.design.measurements.frontLength.value) * status2.precision;
  const wtb = widthTopBack(status2);
  const a = Math.abs(pointP.x - pointj.x);
  const c = frontLength - wtb;
  const b = Math.round(Math.sqrt(c * c - a * a));
  const ey = Math.round(pointJ.y - b);
  return setPoint(pointP.x, ey, { l: true });
}
function distOtoA(status2) {
  const b = status2.measurements.backLength.value + 0.75;
  const a = status2.measurements.heightUnderArm.value;
  return b - a;
}
var keystone_single_breasted_vest_default = { design_info, measurements, steps };

// designs/design_list.js
var designs = [
  keystone_single_breasted_vest_default
].map((design) => {
  return {
    label: design.design_info.title,
    design_info: design.design_info,
    measurements: design.measurements,
    points: design.points,
    steps: design.steps
  };
});

// pixels.js
function makePixels(status2) {
  const pattern = status2.pattern;
  const margin = status2.canvasInfo.margin;
  const pixelsPerInch = status2.canvasInfo.pixelsPerInch;
  const defaultSize = { ...status2.canvasInfo.defaultSize };
  const precision = status2.precision;
  let pixelPattern = {
    points: {},
    lines: [...pattern.lines],
    curves: [...pattern.curves],
    canvasSize: defaultSize
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
  let x = point.x / precision * pixelsPerInch;
  let y = point.y / precision * pixelsPerInch;
  return { label, x, y, guides: point.guides };
}

// drawing.js
function drawPattern(status2) {
  let pixelPattern = makePixels(status2);
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = pixelPattern.canvasSize.x;
  canvas.height = pixelPattern.canvasSize.y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "12px serif";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  let drawing = {
    points: [],
    lines: [],
    curves: []
  };
  for (let point in pixelPattern.points) {
    drawPoint(ctx, status2, pixelPattern, point);
  }
  for (let line of pixelPattern.lines) {
    let start = pixelPattern.points[line.start];
    let end = pixelPattern.points[line.end];
    if (line.style === "dashed") {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }
    if (line.length === "defined") {
      drawLine(ctx, start, end);
    } else {
      drawLine(ctx, start, end, true);
    }
  }
  for (let curve of pixelPattern.curves) {
    drawQuarterEllipse(ctx, status2, pixelPattern, curve);
  }
  status2.canvasInfo.drawing = drawing;
  return status2;
}
function drawPoint(ctx, status2, pixelPattern, pointLabel) {
  let point = pixelPattern.points[pointLabel];
  let pointSize = status2.canvasInfo.pointSize;
  let margin = status2.canvasInfo.margin;
  let x = point.x;
  let y = point.y;
  let guides = point.guides;
  ctx.beginPath();
  ctx.rect(x - pointSize / 2, y - pointSize / 2, pointSize, pointSize);
  ctx.fill();
  ctx.fillText(pointLabel, x + 5, y - 5);
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
function drawQuarterEllipse(ctx, _status, pixelPattern, curve, style = "solid") {
  let point1 = pixelPattern.points[curve.start];
  let point2 = pixelPattern.points[curve.end];
  let quarter = curve.quarter;
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };
  let center = { x: 0, y: 0 };
  let startAngle = 0;
  let endAngle = 0;
  let radiusX = 0;
  let radiusY = 0;
  if (quarter === 1) {
    if (point1.x < point2.x) {
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
    if (point1.x > point2.x) {
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
    if (point1.x > point2.x) {
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
    if (point1.x < point2.x) {
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
  if (curve.style === "dashed") {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, startAngle, endAngle);
  ctx.stroke();
}

// display.js
var defaultCanvasSize = { x: 500, y: 500 };
var defaultPixelsPerInch = 32;
var defaultCanvasMargin = defaultPixelsPerInch / 2;
var defaultDesign = designs[0];
var defaultPrecision = 8;
var status = {
  design: defaultDesign,
  measurements: defaultDesign.measurements,
  precision: defaultPrecision,
  canvasInfo: {
    defaultSize: defaultCanvasSize,
    size: { ...defaultCanvasSize },
    margin: defaultCanvasMargin,
    pixelsPerInch: defaultPixelsPerInch,
    drawing: {
      points: [],
      lines: [],
      curves: []
    },
    pointSize: 5
  },
  pattern: {
    points: {},
    lines: [],
    curves: [],
    steps: []
  }
};
var liMaxWidth = 0;
var measurementsList = document.getElementById("measurementsList");
var stepsList = document.getElementById("stepsList");
var designer = document.getElementById("designDesigner");
var designSource = document.getElementById("designSource");
var designSelect = document.getElementById("designSelect");
designs.forEach((design, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = design.label;
  designSelect.appendChild(option);
});
function inputDesign(design) {
  designer.textContent = design.design_info.designer;
  designSource.textContent = design.design_info.source.label;
  designSource.href = design.design_info.source.link;
  designSource.target = "_blank";
}
function inputMeasurements(measurements2) {
  for (const measurement in measurements2) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");
    label.for = measurement;
    label.textContent = measurements2[measurement].label;
    input.type = "number";
    input.id = measurement;
    input.value = `${measurements2[measurement].value}`;
    input.addEventListener("input", function() {
      redrawStepsFromMeasure(input, input.value);
    });
    li.appendChild(label);
    li.appendChild(input);
    measurementsList.appendChild(li);
    let liWidth = li.offsetWidth;
    if (liWidth > liMaxWidth) {
      liMaxWidth = liWidth;
    }
  }
}
function inputSteps(steps2) {
  let currentStep = 1;
  for (const step of steps2) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const instruction = document.createElement("p");
    label.textContent = `Step ${currentStep}.)`;
    instruction.textContent = step;
    li.appendChild(label);
    li.appendChild(instruction);
    stepsList.appendChild(li);
    currentStep++;
  }
}
function updateListLayout() {
  const doc_measurementsList = document.querySelector("#measurementsList");
  const liElements = doc_measurementsList.querySelectorAll("li");
  const listStyle = window.getComputedStyle(doc_measurementsList);
  const listPadding = parseFloat(listStyle.paddingLeft) + parseFloat(listStyle.paddingRight);
  liElements.forEach((li) => {
    const liWidth = li.offsetWidth;
    if (liWidth > liMaxWidth) {
      liMaxWidth = liWidth;
    }
  });
  if (doc_measurementsList.offsetWidth < liMaxWidth + listPadding) {
    doc_measurementsList.classList.add("narrow");
  } else {
    doc_measurementsList.classList.remove("narrow");
  }
}
window.onload = function() {
  var stepsList2 = document.querySelector("#stepsList");
  stepsList2.scrollTop = stepsList2.scrollHeight;
};
window.addEventListener("resize", updateListLayout);
updateListLayout();
inputDesign(status.design);
inputMeasurements(status.design.measurements);
status = makePattern(status);
inputSteps(status.pattern.steps);
drawPattern(status);
function redrawStepsFromMeasure(input, value) {
  stepsList.innerHTML = "";
  status.measurements[input.id].value = parseFloat(value);
  status = makePattern(status);
  inputSteps(status.pattern.steps);
  drawPattern(status);
}
designSelect.addEventListener("change", function() {
  status.design = designs[designSelect.value];
  status.measurements = status.design.measurements;
  status.steps_functions = status.design.steps;
  measurementsList.innerHTML = "";
  stepsList.innerHTML = "";
  inputDesign(status.design);
  inputMeasurements(status.design.measurements);
  status = makePattern(status);
  inputSteps(status.pattern.steps);
  drawPattern(status);
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGF0dGVybi5qcyIsICIuLi9kZXNpZ25zL2tleXN0b25lX3NpbmdsZS1icmVhc3RlZC12ZXN0LmpzIiwgIi4uL2Rlc2lnbnMvZGVzaWduX2xpc3QuanMiLCAiLi4vcGl4ZWxzLmpzIiwgIi4uL2RyYXdpbmcuanMiLCAiLi4vZGlzcGxheS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy90dXJuIGRlc2lnbiBpbnRvIHBhdHRlcm5cblxuZXhwb3J0IGZ1bmN0aW9uIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgaW5jaGVzKXtcbiAgY29uc3QgcHJlY2lzaW9uID0gc3RhdHVzLnByZWNpc2lvbjtcbiAgcmV0dXJuIE1hdGgucm91bmQoaW5jaGVzICogcHJlY2lzaW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBvaW50KHgsIHksIGd1aWRlcyl7XG4gIGxldCB0ZW1wR3VpZGUgPSB7dTogZmFsc2UsIGQ6IGZhbHNlLCBsOiBmYWxzZSwgcjogZmFsc2V9O1xuICBpZiAoZ3VpZGVzID09PSB1bmRlZmluZWQpe1xuICAgIGd1aWRlcyA9IHRlbXBHdWlkZTtcbiAgfSBlbHNlIHtcbiAgICBndWlkZXMgPSB7Li4udGVtcEd1aWRlLCAuLi5ndWlkZXN9O1xuICB9XG4gIGxldCBwb2ludCA9IHt4OiB4LCB5OiB5LCBndWlkZXM6IGd1aWRlc307XG4gIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldExpbmUoc3RhdHVzLCBzdGFydCwgZW5kLCBzdHlsZSA9ICdzb2xpZCcsIGxlbmd0aCA9ICdkZWZpbmVkJyl7XG4gIGxldCBsaW5lID0ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IGVuZCxcbiAgICBzdHlsZTogc3R5bGUsXG4gICAgbGVuZ3RoOiBsZW5ndGggLy9laXRoZXIgZGVmaW5lZCBvciBjb250aW51ZWQgKGV4dGVuZGluZyBwYXN0IGVuZCBwb2ludClcbiAgfTtcbiAgc3RhdHVzLnBhdHRlcm4ubGluZXMucHVzaChsaW5lKTtcblxuICByZXR1cm4gc3RhdHVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9pbnRMaW5lWShzdGF0dXMsIHBvaW50MSwgcG9pbnQyLCB5LCBndWlkZXMpe1xuICAvL2ZpbmQgeCB2YWx1ZSB3aGVyZSBsaW5lIGJldHdlZW4gcG9pbnQxIGFuZCBwb2ludDIgY3Jvc3NlcyB5XG5cbiAgbGV0IHgxID0gcG9pbnQxLng7XG4gIGxldCB5MSA9IHBvaW50MS55O1xuICBsZXQgeDIgPSBwb2ludDIueDtcbiAgbGV0IHkyID0gcG9pbnQyLnk7XG5cbiAgbGV0IHggPSBNYXRoLnJvdW5kKHgxICsgKHgyIC0geDEpICogKHkgLSB5MSkgLyAoeTIgLSB5MSkpO1xuICBsZXQgcG9pbnQgPSBzZXRQb2ludCh4LCB5LCBndWlkZXMpO1xuXG4gIHJldHVybiBwb2ludDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRQb2ludExpbmVYKHN0YXR1cywgcG9pbnQxLCBwb2ludDIsIHgsIGd1aWRlcyl7XG4gIC8vZmluZCB4IHZhbHVlIHdoZXJlIGxpbmUgYmV0d2VlbiBwb2ludDEgYW5kIHBvaW50MiBjcm9zc2VzIHlcbiAgbGV0IHgxID0gcG9pbnQxLng7XG4gIGxldCB5MSA9IHBvaW50MS55O1xuICBsZXQgeDIgPSBwb2ludDIueDtcbiAgbGV0IHkyID0gcG9pbnQyLnk7XG5cbiAgbGV0IHkgPSBNYXRoLnJvdW5kKHkxICsgKHkyIC0geTEpICogKHggLSB4MSkgLyAoeDIgLSB4MSkpO1xuICBsZXQgcG9pbnQgPSBzZXRQb2ludCh4LCB5LCBndWlkZXMpO1xuXG4gIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBvaW50QWxvbmdMaW5lKHN0YXR1cywgcG9pbnQxLCBwb2ludDIsIHRvM2luSW5jaGVzLCBndWlkZXMpe1xuICAvL2ZpbmQgcG9pbnQgZGlzdGFuY2UgZnJvbSBwb2ludDEgYWxvbmcgbGluZSB0byBwb2ludDJcbiAgbGV0IHgxID0gcG9pbnQxLng7XG4gIGxldCB5MSA9IHBvaW50MS55O1xuICBsZXQgeDIgPSBwb2ludDIueDtcbiAgbGV0IHkyID0gcG9pbnQyLnk7XG4gIC8vZGlzdGFuY2UgaXMgZXhwZWN0ZWQgdG8gYmUgYSBwZXJjZW50YWdlIG9mIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50MSBhbmQgcG9pbnQyXG4gIGxldCBkaXN0MXRvMiA9IE1hdGguc3FydCgoeDIgLSB4MSkgKiAoeDIgLSB4MSkgKyAoeTIgLSB5MSkgKiAoeTIgLSB5MSkpO1xuICBsZXQgZGlzdGFuY2UgPSAodG8zaW5JbmNoZXMgKiBzdGF0dXMucHJlY2lzaW9uICkgLyBkaXN0MXRvMjtcbiAgLy9sZXQgZGlzdGFuY2UgPSB0bzNpbkluY2hlcyAqIHN0YXR1cy5wcmVjaXNpb247XG5cbiAgbGV0IHggPSBNYXRoLnJvdW5kKHgxICsgKHgyIC0geDEpICogZGlzdGFuY2UpO1xuICBsZXQgeSA9IE1hdGgucm91bmQoeTEgKyAoeTIgLSB5MSkgKiBkaXN0YW5jZSk7XG4gIHN0YXR1cyA9IHNldFBvaW50KHgsIHksIGd1aWRlcyk7XG5cbiAgcmV0dXJuIHN0YXR1cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBvaW50TGluZUNpcmNsZShzdGF0dXMsIHBvaW50MSwgcG9pbnQyLCBjZW50ZXIsIHJhZGl1cyl7XG4gIC8vZmlyc3QsIGZpbmQgdGhlIHNsb3BlIG9mIHRoZSBsaW5lIGJldHdlZW4gcG9pbnQxIGFuZCBwb2ludDJcbiAgbGV0IHgxID0gcG9pbnQxLng7XG4gIGxldCB5MSA9IHBvaW50MS55O1xuICBsZXQgeDIgPSBwb2ludDIueDtcbiAgbGV0IHkyID0gcG9pbnQyLnk7XG4gIGxldCBtID0gKHkyIC0geTEpIC8gKHgyIC0geDEpO1xuICAvL3RoZW4sIGZpbmQgdGhlIGludGVyY2VwdFxuICBsZXQgYiA9IHkxIC0gbSAqIHgxO1xuXG4gIC8vdGhlbiwgZmluZCB0aGUgZXF1YXRpb24gb2YgdGhlIGNpcmNsZVxuICBsZXQgayA9IGNlbnRlci54O1xuICBsZXQgaCA9IGNlbnRlci55O1xuXG4gIC8vZXF1YXRpb24gb2YgY2lyY2xlIGlzICh4LWgpXjIgKyAoeS1rKV4yID0gcl4yXG4gIC8vd2hlcmUgaCBhbmQgayBhcmUgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlLCBhbmQgciBpcyB0aGUgcmFkaXVzXG4gIC8vc3Vic3RpdHV0ZSB5ID0gbXggKyBiIGludG8gdGhlIGNpcmNsZSBlcXVhdGlvblxuXG4gIGxldCBhID0gMSArIG0gKiBtO1xuICBsZXQgYjIgPSAyICogKG0gKiAoYiAtIGgpIC0gayk7XG4gIGxldCBjID0gayAqIGsgKyAoYiAtIGgpICogKGIgLSBoKSAtIHJhZGl1cyAqIHJhZGl1cztcblxuICAvL3NvbHZlIGZvciB4XG4gIGxldCB4ID0gKC1iMiAtIE1hdGguc3FydChiMiAqIGIyIC0gNCAqIGEgKiBjKSkgLyAoMiAqIGEpO1xuICBsZXQgeSA9IG0gKiB4ICsgYjtcbiAgc3RhdHVzID0gc2V0UG9pbnQoeCwgeSk7XG4gIC8vdGhlcmUgbWF5IGJlIHR3byBzb2x1dGlvbnMsIGJ1dCB3ZSdsbCBqdXN0IHVzZSB0aGUgZmlyc3Qgb25lIGZvciBub3dcblxuICByZXR1cm4gc3RhdHVzO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJ2ZShzdGF0dXMsIHN0YXJ0UG9pbnQsIGVuZFBvaW50LCBxdWFydGVyICl7XG4gIC8vcXVhcnRlciAxLCAyLCAzLCBvciA0LCBjbG9ja3dpc2UgZnJvbSAxMiBvJ2Nsb2NrIChzbyAxIGlzIHRvcCByaWdodCwgMiBpcyBib3R0b20gcmlnaHQsIDMgaXMgYm90dG9tIGxlZnQsIDQgaXMgdG9wIGxlZnQpXG4gIGxldCBjdXJ2ZSA9IHtcbiAgICBzdGFydDogc3RhcnRQb2ludCxcbiAgICBlbmQ6IGVuZFBvaW50LFxuICAgIHF1YXJ0ZXI6IHF1YXJ0ZXJcbiAgfTtcbiAgc3RhdHVzLnBhdHRlcm4uY3VydmVzLnB1c2goY3VydmUpO1xuICByZXR1cm4gc3RhdHVzO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwZXJpbWV0ZXJFbGxpcHNlKF9zdGF0dXMsIGNlbnRlciwgcG9pbnQxLCBwb2ludDIpe1xuICAvL2NhbGN1bGF0ZXMgMS80IG9mIHRoZSBlbGxpcHNlIGNpcmN1bWZlcmVuY2UsIGJhc2VkIG9uIHRoZSBxdWFydGVyXG4gIC8vcXVhcnRlciAxLCAyLCAzLCBvciA0LCBjbG9ja3dpc2UgZnJvbSAxMiBvJ2Nsb2NrIChzbyAxIGlzIHRvcCByaWdodCwgMiBpcyBib3R0b20gcmlnaHQsIDMgaXMgYm90dG9tIGxlZnQsIDQgaXMgdG9wIGxlZnQpXG4gIC8vY2FsY3VsYXRlIGNlbnRlciBmcm9tIHN0YXJ0LCBlbmQsIGFuZCBxdWFydGVyXG4gIC8vZmluZCBzZW1pIG1ham9yIGFuZCBzZW1pIG1pbm9yIGF4ZXMsIG5vdCBzdXJlIGlmIHBvaW50MSBvciBwb2ludDIgaXMgbGFyZ2VyXG4gIGxldCBkaXN0MSA9IE1hdGguYWJzKChjZW50ZXIueCAtIHBvaW50MS54KSkgKyBNYXRoLmFicygoY2VudGVyLnkgLSBwb2ludDEueSkpO1xuICBsZXQgZGlzdDIgPSBNYXRoLmFicygoY2VudGVyLnggLSBwb2ludDIueCkpICsgTWF0aC5hYnMoKGNlbnRlci55IC0gcG9pbnQyLnkpKTtcbiAgLy9hIGlzIHNlbWktbWFqb3IsIHRoZSBsYXJnZXIgZGlzdGFuY2VcbiAgLy9iIGlzIHNlbWktbWlub3IsIHRoZSBzbWFsbGVyIGRpc3RhbmNlXG4gIGxldCBhID0gMDtcbiAgbGV0IGIgPSAwO1xuICBpZiAoZGlzdDEgPiBkaXN0Mil7IFxuICAgIGEgPSBkaXN0MTtcbiAgICBiID0gZGlzdDI7XG4gIH0gZWxzZSB7XG4gICAgYSA9IGRpc3QyO1xuICAgIGIgPSBkaXN0MTtcbiAgfVxuICAvL2ggaXMgdGhlIGVjY2VudHJpY2l0eVxuICBsZXQgaCA9IE1hdGguYWJzKGEgLSBiKSAqIChhIC0gYikgLyAoTWF0aC5hYnMoYSArIGIpICogKGEgKyBiKSk7XG4gIGxldCBwZXJpbWV0ZXIgPSBNYXRoLlBJICogKGEgKyBiKSAqICgxICsgMyAqIGggLyAoMTAgKyBNYXRoLnNxcnQoNCAtIDMgKiBoKSkpO1xuICByZXR1cm4gcGVyaW1ldGVyO1xuICAvL3JldHVybiAxMDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkaXN0UG9pbnRUb1BvaW50KHBvaW50MSwgcG9pbnQyKXtcbiAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5zcXJ0KChwb2ludDEueCAtIHBvaW50Mi54KSAqIChwb2ludDEueCAtIHBvaW50Mi54KSArIChwb2ludDEueSAtIHBvaW50Mi55KSAqIChwb2ludDEueSAtIHBvaW50Mi55KSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzdEFCQyhzdGF0dXMsIHBvaW50YSwgcG9pbnRiLCBwb2ludGMpe1xuICBjb25zdCBhID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzW3BvaW50YV07XG4gIGNvbnN0IGIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbcG9pbnRiXTtcbiAgY29uc3QgYyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1twb2ludGNdO1xuXG5cbiAgcmV0dXJuIE1hdGguYWJzKGRpc3RQb2ludFRvUG9pbnQoYSwgYikgKyBkaXN0UG9pbnRUb1BvaW50KGIsIGMpKTtcbn1cbi8vY29udmVydCBudW1iZXJzIHRvIHByaW50YWJsZSBzdHJpbmdzXG5cbmZ1bmN0aW9uIGZvcm1hdEZyYWN0aW9uKG51bUlucHV0KXtcbiAgLy9udW0gY2FuIGJlIGEgc3RyaW5nIG9yIGEgbnVtYmVyXG4gIGxldCBudW0gPSBwYXJzZUZsb2F0KG51bUlucHV0KTtcbiAgLy9yZXR1cm4gYSB3aG9sZSBudW1iZXIgYW5kL29yIGEgZnJhY3Rpb24sIHVzaW5nIGhhbHZlcywgcXVhcnRlcnMsIG9yIGVpZ2h0aHNcbiAgbGV0IHdob2xlID0gTWF0aC5mbG9vcihudW0pO1xuICBsZXQgZnJhY3Rpb24gPSBudW0gLSB3aG9sZTtcbiAgbGV0IGZyYWN0aW9uU3RyaW5nID0gJyc7XG4gIGNvbnN0IGZyYWN0aW9ucyA9IHtcbiAgICAnMS84JzogMC4xMjUsXG4gICAgJzEvNCc6IDAuMjUsXG4gICAgJzMvOCc6IDAuMzc1LFxuICAgICcxLzInOiAwLjUsXG4gICAgJzUvOCc6IDAuNjI1LFxuICAgICczLzQnOiAwLjc1LFxuICAgICc3LzgnOiAwLjg3NVxuICB9XG5cbiAgaWYgKGZyYWN0aW9uICE9PSAwKXtcbiAgICBsZXQgYmVzdEZyYWN0aW9uID0gJzEvOCc7XG4gICAgZm9yIChsZXQga2V5IGluIGZyYWN0aW9ucyl7XG4gICAgICBpZiAoTWF0aC5hYnMoZnJhY3Rpb24gLSBmcmFjdGlvbnNba2V5XSkgPCBNYXRoLmFicyhmcmFjdGlvbiAtIGZyYWN0aW9uc1tiZXN0RnJhY3Rpb25dKSl7XG4gICAgICAgIGJlc3RGcmFjdGlvbiA9IGtleTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnJhY3Rpb25TdHJpbmcgPSBiZXN0RnJhY3Rpb247XG4gIH1cbiAgaWYgKHdob2xlID09PSAwKXtcbiAgICByZXR1cm4gZnJhY3Rpb25TdHJpbmc7XG4gIH0gZWxzZSBpZiAoZnJhY3Rpb25TdHJpbmcgPT09ICcnKXtcbiAgICByZXR1cm4gYCR7d2hvbGV9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCR7d2hvbGV9ICR7ZnJhY3Rpb25TdHJpbmd9YDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJpbnRNZWFzdXJlKG1lYXN1cmUsIG1hdGggPSAxKXtcbiAgcmV0dXJuIHByaW50TnVtKG1lYXN1cmUudmFsdWUsIG1hdGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJpbnROdW0obnVtLCBtYXRoID0gMSl7XG4gIHJldHVybiBgKCR7Zm9ybWF0RnJhY3Rpb24obnVtICogbWF0aCl9IGluLilgO1xufVxuXG4vL2NyZWF0ZSBzaGFwZXMgZm9yIHBhdHRlcm4gYmFzZWQgb24gc3RlcHMgYWN0aW9uc1xuZnVuY3Rpb24gY3JlYXRlU2hhcGVzKHN0YXR1cyl7XG4gIGxldCBzdGVwRnVuY3MgPSBzdGF0dXMuZGVzaWduLnN0ZXBzO1xuXG4gIHN0ZXBGdW5jcy5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgIGxldCBhY3Rpb24gPSBzdGVwLmFjdGlvbjtcbiAgICBzdGF0dXMgPSBhY3Rpb24oc3RhdHVzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHN0YXR1cztcbn1cblxuLy90dXJuIHN0ZXBzX2Z1bmN0aW9ucyBpbnRvIHN0ZXBzIHN0cmluZ3MsIHBvcHVsYXRlZCB3aXRoIHRoZSBuZWNlc3NhcnkgbnVtYmVyc1xuZnVuY3Rpb24gd3JpdGVTdGVwcyhzdGF0dXMpe1xuICBsZXQgc3RlcHMgPSBbXTtcbiAgc3RhdHVzLmRlc2lnbi5zdGVwcy5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgIGxldCBkZXNjcmlwdGlvbiA9IHN0ZXAuZGVzY3JpcHRpb24oc3RhdHVzKTtcbiAgICBzdGVwcy5wdXNoKGRlc2NyaXB0aW9uKTtcbiAgfSk7XG4gIHN0YXR1cy5wYXR0ZXJuLnN0ZXBzID0gc3RlcHM7XG4gIHJldHVybiBzdGF0dXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlUGF0dGVybihzdGF0dXMpe1xuICAvL2xvb3AgdGhyb3VnaCBkZXNpZ24ncyBzdGVwcyBmdW5jdGlvbnMsIHBhc3NpbmcgbWVhc3VyZW1lbnRzIHRvIGVhY2hcbiAgLy9jcmVhdGUgcGF0dGVybiwgd2l0aCBzdGVwcywgcG9pbnRzLCBsaW5lcywgYW5kIGN1cnZlc1xuICBzdGF0dXMucGF0dGVybiA9IHtcbiAgICBwb2ludHM6IHt9LFxuICAgIGxpbmVzOiBbXSxcbiAgICBjdXJ2ZXM6IFtdLFxuICAgIHN0ZXBzOiBbXVxuICB9O1xuICBzdGF0dXMgPSB3cml0ZVN0ZXBzKHN0YXR1cyk7XG4gIHN0YXR1cyA9IGNyZWF0ZVNoYXBlcyhzdGF0dXMpOyAvL3J1bnMgdGhyb3VnaCBzdGVwcy5hdGlvbnMsIHBvcHVsYXRpbmcgcG9pbnRzLCBsaW5lcywgYW5kIGN1cnZlc1xuXG4gIHJldHVybiBzdGF0dXM7XG59XG5cblxuIiwgImltcG9ydCB7XG4gIGluY2hlc1RvUHJlY2lzaW9uLFxuICBzZXRQb2ludCxcbiAgc2V0TGluZSxcbiAgc2V0UG9pbnRMaW5lWSxcbiAgc2V0UG9pbnRMaW5lWCxcbiAgc2V0UG9pbnRBbG9uZ0xpbmUsXG4gIHNldFBvaW50TGluZUNpcmNsZSxcbiAgc2V0Q3VydmUsXG4gIGRpc3RQb2ludFRvUG9pbnQsXG4gIGRpc3RBQkMsXG4gIHByaW50TnVtLFxuICBwcmludE1lYXN1cmUsXG4gIHBlcmltZXRlckVsbGlwc2Vcbn0gZnJvbSAnLi4vcGF0dGVybi5qcyc7XG5cbmNvbnN0IGRlc2lnbl9pbmZvID0ge1xuICB0aXRsZTogJ0tleXN0b25lIC0gU2luZ2xlIEJyZWFzdGVkIFZlc3QnLFxuICBzb3VyY2U6IHtcbiAgICBsaW5rOiAnaHR0cHM6Ly9hcmNoaXZlLm9yZy9kZXRhaWxzL2tleXN0b25lamFja2V0ZHIwMGhlY2svcGFnZS82Ni9tb2RlLzJ1cCcsXG4gICAgbGFiZWw6ICdUaGUgS2V5c3RvbmUgSmFja2V0IGFuZCBEcmVzcyBDdXR0ZXIgKHBnIDY2KSdcbiAgfSxcbiAgZGVzaWduZXI6ICdDaGFybGVzIEhlY2tsaW5nZXInXG59XG5cbmxldCBtZWFzdXJlbWVudHMgPSB7XG4gIGJhY2tMZW5ndGg6IHtsYWJlbDogXCJCYWNrIExlbmd0aFwiLCB2YWx1ZTogMTV9LFxuICBmcm9udExlbmd0aDoge2xhYmVsOiBcIkZyb250IExlbmd0aFwiLCB2YWx1ZTogMTguMjV9LFxuICBibGFkZToge2xhYmVsOiBcIkJsYWRlXCIsIHZhbHVlOiAxMH0sXG4gIGhlaWdodFVuZGVyQXJtOiB7bGFiZWw6IFwiSGVpZ2h0IFVuZGVyIEFybVwiLCB2YWx1ZTogNy41fSxcbiAgYnJlYXN0OiB7bGFiZWw6IFwiQnJlYXN0XCIsIHZhbHVlOiAzNn0sXG4gIHdhaXN0OiB7bGFiZWw6IFwiV2Fpc3RcIiwgdmFsdWU6IDI1fSxcbiAgbGVuZ3RoT2ZGcm9udDoge2xhYmVsOiBcIkxlbmd0aCBvZiBGcm9udFwiLCB2YWx1ZTogMjN9LFxuICBzaG91bGRlcjoge2xhYmVsOiBcIkRlc2lyZWQgU2hvdWxkZXIgQ2hhbmdlXCIsIHZhbHVlOiAxfSxcbiAgbmVja2xpbmU6IHtsYWJlbDogXCJOZWNrbGluZVwiLCB2YWx1ZTogMTB9XG59O1xuXG4vL2FsbCBkaXN0YW5jZXMgYXJlIGluIGluY2hlcyAqIHByZWNpc2lvblxuLy8gc3RhcnRpbmcgcG9pbnQgKGluIHRoaXMgY2FzZSAnTycpIGlzIGFsd2F5cyAwLDAuIEFsbCBvdGhlciBwb2ludHMgYXJlIGRlZmluZWQgaW4gcmVsYXRpb24gdG8gdGhpcyBwb2ludC4gTmVnYXRpdmVzIGFyZSBleHBlY3RlZFxuXG5jb25zdCBzdGVwcyA9IFtcbiAge1xuICAgICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuICdTZXQgcG9pbnQgTyBpbiB1cHBlciByaWdodCBvZiBjYW52YXMnfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTyddID0gc2V0UG9pbnQoMCwgMCx7IGQ6IHRydWUsIGw6IHRydWUgfSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgfSxcbiAge1xuICAgICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuICdQb2ludCAxIGlzIDMvNCBpbmNoIGRvd24gZnJvbSBPJ30sXG4gICAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzEnXSA9IHNldFBvaW50KDAsIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgMy80KSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgfSxcbiAge1xuICAgICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYEZyb20gcG9pbnQgMSwgZ28gZG93biB0aGUgYmFjayBsZW5ndGggJHtwcmludE1lYXN1cmUoc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHMuYmFja0xlbmd0aCl9IHRvIGRlZmluZSBwb2ludCBCYH0sXG4gICAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgICBsZXQgcG9pbnQxID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycxJ107XG4gICAgICAgICAgbGV0IHBvaW50Yl95ID0gcG9pbnQxLnkgKyBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIHBhcnNlRmxvYXQoc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHMuYmFja0xlbmd0aC52YWx1ZSkpO1xuICAgICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQiddID0gc2V0UG9pbnQoMCwgcG9pbnRiX3ksIHsgbDogdHJ1ZSB9KTtcbiAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuICB9LFxuICB7XG4gICAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgRnJvbSBwb2ludCBCLCBnbyB1cCB0aGUgaGVpZ2h0IHVuZGVyIGFybSAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmhlaWdodFVuZGVyQXJtKX0gdG8gZGVmaW5lIHBvaW50IEFgfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIGxldCBwb2ludEIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0InXTtcbiAgICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0EnXSA9IHNldFBvaW50KDAsIHBvaW50Qi55IC0gaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuaGVpZ2h0VW5kZXJBcm0udmFsdWUpKSwgeyBsOiB0cnVlIH0pO1xuICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gIH0sXG4gIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBCIHRvIEQgaXMgMS8yNCBicmVhc3QgJHtwcmludE1lYXN1cmUoc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QsIDEvMjQpfSB0byB0aGUgbGVmdCBvZiBCYH0sXG4gICAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgICBsZXQgcG9pbnRCID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydCJ107XG4gICAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEJ10gPSBzZXRQb2ludChwb2ludEIueCAtIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdC52YWx1ZSkgLyAyNCksIHBvaW50Qi55KTtcbiAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuICB9LFxuICB7XG4gICAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gJ0RyYXcgYmFjayBsaW5lIGZyb20gMSB0byBEJ30sXG4gICAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJzEnLCAnRCcpO1xuICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gIH0sXG4gIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiAnUG9pbnQgQTEgaXMgd2hlcmUgdGhlIGxpbmUgMS1EIGNyb3NzZXMgbGluZSBleHRlbmRpbmcgbGVmdCBmcm9tIEEnfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIGxldCBwb2ludDEgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzEnXTtcbiAgICAgICAgICBsZXQgcG9pbnRBID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydBJ107XG4gICAgICAgICAgbGV0IHBvaW50RCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRCddO1xuICAgICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQTEnXSA9IHNldFBvaW50TGluZVkoc3RhdHVzLCBwb2ludDEsIHBvaW50RCwgcG9pbnRBLnkpO1xuICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgSyBpcyB0aGUgYmxhZGUgbWVhc3VyZSAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlKX0gbGVmdCBmcm9tIEExYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsYWRlID0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLnZhbHVlKTtcbiAgICAgICAgY29uc3QgcG9pbnRBMSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQTEnXTtcbiAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydLJ10gPSBzZXRQb2ludChwb2ludEExLnggLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIGJsYWRlKSwgcG9pbnRBMS55LCB7dTogdHJ1ZSwgZDogdHJ1ZX0pO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBMIGlzIDMvOCBvZiB0aGUgYmxhZGUgbWVhc3VyZSAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLCAzLzgpfSByaWdodCBvZiBLYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsYWRlID0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLnZhbHVlKTtcbiAgICAgICAgY29uc3QgcG9pbnRLID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydLJ107XG4gICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTCddID0gc2V0UG9pbnQocG9pbnRLLnggKyBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIGJsYWRlICogMy84KSwgcG9pbnRLLnksIHt1OiB0cnVlLCBkOiB0cnVlfSk7XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBKIGlzIGF0IHRoZSBpbnRlcnNlY3Rpb24gb2YgdGhlIGxpbmUgZG93biBmcm9tIEsgYW5kIHRoZSBsaW5lIGxlZnQgZnJvbSBCYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvaW50SyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snSyddO1xuICAgICAgICBjb25zdCBwb2ludEIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0InXTtcbiAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydKJ10gPSBzZXRQb2ludChwb2ludEsueCwgcG9pbnRCLnkpO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAyIGlzIDMvMTYgb2YgdGhlIGJsYWRlIG1lYXN1cmUgJHtwcmludE1lYXN1cmUoc3RhdHVzLm1lYXN1cmVtZW50cy5ibGFkZSwgMy8xNil9IGxlZnQgZnJvbSBPYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsYWRlID0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLnZhbHVlKTtcbiAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycyJ10gPSBzZXRQb2ludCgwIC0gaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBibGFkZSAqIDMvMTYpLCAwKTtcbiAgICAgICAgLy9kcmF3IGN1cnZlIGZyb20gMiB0byAxLCBjZW50ZXJlZCBhcm91bmQgT1xuICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpXG4gICAgICAgIHN0YXR1cyA9IHNldEN1cnZlKHN0YXR1cywgJzEnLCAnMicsIDMpO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAgeyBcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEcgaXMgMS8yIHRoZSBicmVhc3QgbWVhc3VyZSAke3ByaW50TWVhc3VyZShfc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QsIDEvMil9IHRvIHRoZSBsZWZ0IG9mIEExYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvaW50QTEgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0ExJ107XG4gICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRyddID0gc2V0UG9pbnQocG9pbnRBMS54IC0gaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDIpLCBwb2ludEExLnkpO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgUCBpcyBoYWxmd2F5IGJldHdlZW4gcG9pbnRzIEcgYW5kIEsuIERyYXcgZ3VpZGUgdXAgZnJvbSBQYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHBvaW50RyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRyddO1xuICAgICAgICBjb25zdCBwb2ludEsgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0snXTtcbiAgICAgICAgY29uc3QgZGlmZkdLID0gTWF0aC5hYnMocG9pbnRHLnggLSBwb2ludEsueCk7XG4gICAgICAgIFxuICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1AnXSA9IHNldFBvaW50KChwb2ludEcueCArIHBvaW50Sy54KSAvIDIsIHBvaW50Ry55LCB7dTogdHJ1ZX0pO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge1xuICAgICAgcmV0dXJuIGBQb2ludCBFIGlzIGZvdW5kIGJ5IGdvaW5nIHVwIHRoZSBmcm9udCBsZW5ndGggLSB0aGUgd2lkdGggb2YgdG9wIG9mIGJhY2sgZnJvbSAxIGluY2ggdG8gdGhlIGxlZnQgb2YgSiB1cCB0byBtZWV0IHRoZSBsaW5lIHVwIGZyb20gUC4gRSBtYXkgYmUgYWJvdmUgb3IgYmVsb3cgdGhlIHRvcCBsaW5lLmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRKID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydKJ107XG4gICAgICBjb25zdCBwb2ludFAgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1AnXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRSddID0gZmluZFBvaW50RShzdGF0dXMsIHBvaW50SiwgcG9pbnRQKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEYgaXMgMS8xMiBicmVhc3QgJHtwcmludE1lYXN1cmUoc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QsIDEvMTIpfSB0byB0aGUgbGVmdCBvZiBFYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0UnXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRiddID0gc2V0UG9pbnQocG9pbnRFLnggLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QudmFsdWUpIC8gMTIpLCBwb2ludEUueSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgRHJhdyBsaW5lIGZyb20gRiB0aHJvdWdoIEcsIGV4dGVuZGluZyBiZWxvdyB0aGUgd2Fpc3QgbGluZWB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdGJywgJ0cnLCAnZGFzaGVkJywgJ2NvbnRpbnVlZCcpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHsgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgTiBpcyBvbiB0aGlzIGxpbmUgZnJvbSBGIHRvIEcsIDEvMTIgb2YgdGhlIGJyZWFzdCBkb3duIGZyb20gRmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRGID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydGJ107XG4gICAgICBjb25zdCBwb2ludEcgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0cnXTtcbiAgICAgIGNvbnN0IGRpc3QgPSBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDEyO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydOJ10gPSBzZXRQb2ludEFsb25nTGluZShzdGF0dXMsIHBvaW50RiwgcG9pbnRHLCBkaXN0KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IFkgaXMgMy80ICR7cHJpbnROdW0oZGlzdE90b0Eoc3RhdHVzKSAqIDMvNCl9IG9mIHRoZSB3YXkgdXAgZnJvbSBMIHRvIHRoZSBsaW5lIGZyb20gT2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRMID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydMJ107XG4gICAgICBjb25zdCBwb2ludE8gPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ08nXTtcbiAgICAgIGNvbnN0IHggPSBwb2ludEwueDtcbiAgICAgIGNvbnN0IHkgPSBwb2ludE8ueSArIChwb2ludEwueSAtIHBvaW50Ty55KSAqIDEvNDtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWSddID0gc2V0UG9pbnQoeCwgeSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBaIGlzIDUvOCAke3ByaW50TnVtKGRpc3RPdG9BKHN0YXR1cykgKiA1LzgpfSBvZiB0aGUgd2F5IHVwIGZyb20gTCB0byB0aGUgbGluZSBmcm9tIE9gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50TCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTCddO1xuICAgICAgY29uc3QgcG9pbnRPID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydPJ107XG4gICAgICBjb25zdCB4ID0gcG9pbnRMLng7XG4gICAgICBjb25zdCB5ID0gcG9pbnRPLnkgKyAocG9pbnRMLnkgLSBwb2ludE8ueSkgKiAzLzg7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1onXSA9IHNldFBvaW50KHgsIHkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgOSBpcyAxLzYgb2YgdGhlIGJyZWFzdCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdCwgMS82KX0gdG8gdGhlIGxlZnQgb2YgT2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc5J10gPSBzZXRQb2ludCgtaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDYpLCAwLCB7ZDogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYERyYXcgbGluZSBmcm9tIDIgdG8gWiwgYW5kIG9uZSBmcm9tIEUgdG8gWWB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICcyJywgJ1onLCAnZGFzaGVkJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ0UnLCAnWScsICdkYXNoZWQnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBYIGlzIHdoZXJlIHRoZSBsaW5lIGZyb20gMiB0byBaIGNyb3NzZXMgdGhlIGxpbmUgZG93biBmcm9tIDlgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50MiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMiddO1xuICAgICAgY29uc3QgcG9pbnRaID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydaJ107XG4gICAgICBjb25zdCBwb2ludDkgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzknXTtcbiAgICAgIGxldCB4OSA9IDAgKyBwb2ludDkueDtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWCddID0gc2V0UG9pbnRMaW5lWChzdGF0dXMsIHBvaW50MiwgcG9pbnRaLCB4OSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAzIGlzIHRoZSBkZXNpcmVkIHNob3VsZGVyIGNoYW5nZSAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLnNob3VsZGVyKX0gY2xvc2VyIHRvIHBvaW50IDIgYWxvbmcgdGhlIGxpbmUgZnJvbSAyIHRvIFhgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50MiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMiddO1xuICAgICAgY29uc3QgcG9pbnRYID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydYJ107XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzMnXSA9IHNldFBvaW50QWxvbmdMaW5lKHN0YXR1cywgcG9pbnRYLCBwb2ludDIsIHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5zaG91bGRlci52YWx1ZSkpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICcyJywgJzMnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAxNCBpcyBhbG9uZyB0aGUgbGluZSBmcm9tIEUgdG8gWSwgdGhlIHNhbWUgZGlzdGFuY2UgYXMgMyB0byAyYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0UnXTtcbiAgICAgIGNvbnN0IHBvaW50WSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWSddO1xuICAgICAgY29uc3QgcG9pbnQyID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycyJ107XG4gICAgICBjb25zdCBwb2ludDMgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzMnXTtcbiAgICAgIGNvbnN0IGEgPSBNYXRoLmFicyhwb2ludDMueCAtIHBvaW50Mi54KTtcbiAgICAgIGNvbnN0IGIgPSBNYXRoLmFicyhwb2ludDMueSAtIHBvaW50Mi55KTtcbiAgICAgIGNvbnN0IGMgPSBhICogYSArIGIgKiBiO1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoYyk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzE0J10gPSBzZXRQb2ludEFsb25nTGluZShzdGF0dXMsIHBvaW50RSwgcG9pbnRZLCBkaXN0YW5jZSAvIHN0YXR1cy5wcmVjaXNpb24pO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICcxNCcsICdFJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAxMiBpcyAxLzQgdGhlIGJyZWFzdCBtZWFzdXJlbWVudCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdCwgMS80KX0gZnJvbSBBMSB0byBHYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEExID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydBMSddO1xuICAgICAgY29uc3QgcG9pbnRHID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydHJ107XG4gICAgICBjb25zdCBkaXN0ID0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdC52YWx1ZSkgLyA0O1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycxMiddID0gc2V0UG9pbnRBbG9uZ0xpbmUoc3RhdHVzLCBwb2ludEExLCBwb2ludEcsIGRpc3QpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IDAwIGlzIHRoZSBzYW1lIGRpc3RhbmNlIGFzIFoueCB0byBYLngsIGxlZnQgb2YgSywgYW5kIGhhbGZ3YXkgYmV0d2VlbiBaIGFuZCBLIHVwIGZyb20gS2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRaID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydaJ107XG4gICAgICBjb25zdCBwb2ludFggPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1gnXTtcbiAgICAgIGNvbnN0IHBvaW50SyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snSyddO1xuICAgICAgY29uc3QgeGRpc3RhbmNlID0gTWF0aC5hYnMocG9pbnRaLnggLSBwb2ludFgueCk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzAwJ10gPSBzZXRQb2ludChwb2ludEsueCAtIHhkaXN0YW5jZSwgKHBvaW50Sy55ICsgcG9pbnRaLnkpLzIsIHt1OiB0cnVlLCBkOiB0cnVlfSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgY3VydmUgdGhlIGFybWhvbGUgZnJvbSAwMCB0byAxMiwgZnJvbSAxNCB0byAxMiwgYW5kIGZyb20gMDAgdG8gM2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzID0gc2V0Q3VydmUoc3RhdHVzLCAnMTInLCAnMycsIDIpO1xuICAgICAgc3RhdHVzID0gc2V0Q3VydmUoc3RhdHVzLCAnMDAnLCAnMTInLCAzKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnMTQnLCAnMDAnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFRvIHN0YXJ0IG1ha2luZyB0aGUgZGFydHMsIGRpdmlkZSB0aGUgZGlzdGFuY2UgZnJvbSBHIHRvIEsgaW50byAzIHBhcnRzICR7cHJpbnROdW0oKChwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDIpIC0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLnZhbHVlKSkgLyAzKX0sIGdpdmluZyBwb2ludHMgUyBhbmQgVC5gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRyddO1xuICAgICAgY29uc3QgcG9pbnRLID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydLJ107XG4gICAgICBjb25zdCBkaXN0ID0gTWF0aC5yb3VuZCgocG9pbnRHLnggLSBwb2ludEsueCkgLyAzKTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUyddID0gc2V0UG9pbnQocG9pbnRHLnggLSBkaXN0LCBwb2ludEcueSk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1QnXSA9IHNldFBvaW50KHBvaW50Ry54IC0gKGRpc3QgKiAyKSwgcG9pbnRHLnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHsgXG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBVIGlzIDEvMiBpbmNoIHJpZ2h0IG9mIFNgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50UyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUyddO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydVJ10gPSBzZXRQb2ludChwb2ludFMueCArIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgMC41KSwgcG9pbnRTLnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEggaXMgYXQgdGhlIGhlaWdodCBvZiBCLCB3aGVyZSB0aGUgbGluZSBleHRlbmRzIGZyb20gRiB0aHJvdWdoIEdgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRiddO1xuICAgICAgY29uc3QgcG9pbnRHID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydHJ107XG4gICAgICBjb25zdCBwb2ludEIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0InXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snSCddID0gc2V0UG9pbnRMaW5lWShzdGF0dXMsIHBvaW50RiwgcG9pbnRHLCBwb2ludEIueSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ0cnLCAnSCcsICdkYXNoZWQnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBBbHNvIGRpdmlkZSBIIHRvIEogaW50byB0aHJlZSBwYXJ0cyB0byBnaXZlIHBvaW50cyBRIGFuZCBSIGB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRIID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydIJ107XG4gICAgICBjb25zdCBwb2ludEogPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0onXTtcbiAgICAgIGNvbnN0IGRpc3QgPSAocG9pbnRILnggLSBwb2ludEoueCkgLyAzO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydRJ10gPSBzZXRQb2ludChwb2ludEgueCAtIGRpc3QsIHBvaW50SC55KTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUiddID0gc2V0UG9pbnQocG9pbnRILnggLSAoZGlzdCAqIDIpLCBwb2ludEgueSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgRHJhdyB0d28gbGluZXMsIG9uZSBmcm9tIFUgdG8gUSBhbmQgb25lIGZyb20gVCB0byBSLCBjb250aW51aW5nIGJlbG93IHRoZSB3YWlzdCBsaW5lYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1UnLCAnUScsICdkYXNoZWQnLCAnY29udGludWVkJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1QnLCAnUicsICdkYXNoZWQnLCAnY29udGludWVkJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgVG8gZmluZCB0aGUgZGFydCBkaWZmZXJlbmNlLCBtZWFzdXJlIGFsb25nIHRoZSB3YWlzdGxpbmUgZnJvbSBEIHRvIEggYW5kIHN1YnJhY3QgMSBpbmNoLiBUaGVuIHN1YnRyYWN0IGhhbGYgdGhlIHdhaXN0IHRvIGdldCB0aGUgZGlmZmVyZW5jZS4gRWFjaCBkYXJ0IHdpbGwgZ2V0IGhhbGYgb2YgdGhpcyBlcXVhbGx5IG9uIGVpdGhlciBzaWRlIG9mIHBvaW50cyBRICh3aGljaCBtYWtlcyBwb2ludHMgNCBhbmQgNSkgYW5kIFIgKHRvIG1ha2UgcG9pbnRzIDYgYW5kIDcpLmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnREID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEJ107XG4gICAgICBjb25zdCBwb2ludEggPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0gnXTtcbiAgICAgIGNvbnN0IHBvaW50USA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUSddO1xuICAgICAgY29uc3QgcG9pbnRSID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydSJ107XG4gICAgICBjb25zdCBkaXN0ID0gTWF0aC5hYnMocG9pbnRILnggLSBwb2ludEQueCkgLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIDEpO1xuXG4gICAgICBjb25zdCB3YWlzdCA9IChwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMud2Fpc3QudmFsdWUpICogc3RhdHVzLnByZWNpc2lvbikgLyAyO1xuICAgICAgY29uc3QgZGlmZiA9IChkaXN0IC0gd2Fpc3QpIC8gNDtcbiAgICAgIGNvbnNvbGUubG9nKGBkaXN0OiAke2Rpc3R9LCB3YWlzdDogJHt3YWlzdH0sIGRpZmY6ICR7ZGlmZn1gKTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNCddID0gc2V0UG9pbnQocG9pbnRRLnggLSBkaWZmLCBwb2ludFEueSk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzUnXSA9IHNldFBvaW50KHBvaW50US54ICsgZGlmZiwgcG9pbnRRLnkpO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc2J10gPSBzZXRQb2ludChwb2ludFIueCAtIGRpZmYsIHBvaW50Ui55KTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNyddID0gc2V0UG9pbnQocG9pbnRSLnggKyBkaWZmLCBwb2ludFIueSk7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IFYgaXMgMS8zIG9mIHRoZSB3YXkgZnJvbSBVIHRvIFEsIGFuZCBXIGJldHdlZW4gVCBhbmQgUiBhIGhhbGYgYW4gaW5jaCBoaWdoZXIgdGhhbiBWYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludFUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1UnXTtcbiAgICAgIGNvbnN0IHBvaW50USA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUSddO1xuICAgICAgY29uc3QgcG9pbnRUID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydUJ107XG4gICAgICBjb25zdCBwb2ludFIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1InXTtcbiAgICAgIGNvbnN0IGEgPSBNYXRoLmFicyhwb2ludFUueCAtIHBvaW50US54KTtcbiAgICAgIGNvbnN0IGIgPSBNYXRoLmFicyhwb2ludFUueSAtIHBvaW50US55KTtcbiAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnJvdW5kKE1hdGguc3FydChhICogYSArIGIgKiBiKSAvIDMpIC8gc3RhdHVzLnByZWNpc2lvbjtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snViddID0gc2V0UG9pbnRBbG9uZ0xpbmUoc3RhdHVzLCBwb2ludFUsIHBvaW50USwgZGlzdCk7XG4gICAgICBjb25zdCB3WSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snViddLnkgLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIDAuNSk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1cnXSA9IHNldFBvaW50TGluZVkoc3RhdHVzLCBwb2ludFQsIHBvaW50Uiwgd1kpO1xuICAgICAgXG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1YnLCAnNCcpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdWJywgJzUnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnVycsICc2Jyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1cnLCAnNycpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgOWIgaXMgMS80IG9mIHRoZSB3YWlzdCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLndhaXN0LCAgLSAxLzQpfSArIDEgaW5jaCAgdG8gdGhlIGxlZnQgb2YgRGB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnREID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEJ107XG4gICAgICBjb25zdCB3YWlzdCA9IHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy53YWlzdC52YWx1ZSkgLyA0O1xuICAgICAgY29uc3QgZGlzdEQ5ID0gaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCB3YWlzdCArIDEpXG4gICAgICBjb25zb2xlLmxvZyhgZGlzdEQ5ID0gJHt3YWlzdH0gKyAxID0gJHtkaXN0RDl9YCk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzliJ10gPSBzZXRQb2ludChwb2ludEQueCAtIGRpc3REOSwgcG9pbnRELnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYEZyb20gdGhlIGZyb250IGF0IEggdG8gNCwgNSB0byA2LCBhbmQgNyB0byA4LCBwbGFjZSBhbm90aGVyIDEvNCBvZiB0aGUgd2Fpc3QgLSAxIGluY2ggdG8gZmluZCBwb2ludCA4YH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEggPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0gnXTtcbiAgICAgIGNvbnN0IHBvaW50NCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNCddO1xuICAgICAgY29uc3QgcG9pbnQ1ID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc1J107XG4gICAgICBjb25zdCBwb2ludDYgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzYnXTtcbiAgICAgIGNvbnN0IHBvaW50NyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNyddO1xuICAgICAgY29uc3QgZGlzdEg0ID0gTWF0aC5hYnMocG9pbnRILnggLSBwb2ludDQueClcbiAgICAgIGNvbnN0IGRpc3Q1NiA9IE1hdGguYWJzKHBvaW50NS54IC0gcG9pbnQ2LngpXG4gICAgICBjb25zdCB3YWlzdCA9ICgocGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLndhaXN0LnZhbHVlKSAvIDQgLSAxLjUpICogc3RhdHVzLnByZWNpc2lvbik7XG4gICAgICBjb25zdCBkaXN0NzggPSBNYXRoLmFicyh3YWlzdCAtIGRpc3RINCAtIGRpc3Q1Nik7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzgnXSA9IHNldFBvaW50KHBvaW50Ny54ICsgZGlzdDc4LCBwb2ludEgueSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJzEyJywgJzgnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnMTInLCAnOWInKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IE0gaXMgYWxvbmcgdGhlIGxpbmUgZnJvbSBGIHRvIEgsIHdoZXJlIHRoZSBsZW5ndGggb2YgdGhlIGZyb250ICR7cHJpbnRNZWFzdXJlKHN0YXR1cy5tZWFzdXJlbWVudHMubGVuZ3RoT2ZGcm9udCl9IGZyb20gRSBtZWV0cyBpdC5gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRiddO1xuICAgICAgY29uc3QgcG9pbnRIID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydIJ107XG4gICAgICBjb25zdCBwb2ludEUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0UnXTtcbiAgICAgIC8vbWFrZSBhIGxpbmUgZnJvbSBwb2ludEUuIHdlIGRvbid0IGtub3cgdGhlIGFuZ2xlLCBidXQgd2Uga25vdyB0aGUgbGVuZ3RoLlxuICAgICAgY29uc3Qgd3RiID0gd2lkdGhUb3BCYWNrKHN0YXR1cyk7XG4gICAgICBjb25zdCBkaXN0ID0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmxlbmd0aE9mRnJvbnQudmFsdWUpICogc3RhdHVzLnByZWNpc2lvbiAtIHd0YjtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTSddID0gc2V0UG9pbnRMaW5lQ2lyY2xlKHN0YXR1cywgcG9pbnRGLCBwb2ludEgsIHBvaW50RSwgZGlzdCk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ0gnLCAnTScsICdkYXNoZWQnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IGUgaXMgYmVsb3cgcG9pbnQgMTIsIDEvMiBvZiB0aGUgd2F5IGJldHdlZW4gOCBhbmQgTSdzIGhlaWdodGB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnQ4ID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc4J107XG4gICAgICBjb25zdCBwb2ludE0gPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ00nXTtcbiAgICAgIGNvbnN0IHBvaW50MTIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzEyJ107XG4gICAgICBjb25zdCB5ID0gcG9pbnQ4LnkgLSAocG9pbnQ4LnkgLSBwb2ludE0ueSkgLyAyO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydlJ10gPSBzZXRQb2ludChwb2ludDEyLngsIHksIHtyOiB0cnVlfSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ2UnLCAnMTInLCAnZGFzaGVkJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgTG93ZXN0IGZyb250IHBvaW50IChNMSkgaXMgMS8yIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIEggYW5kIDQgIHRvIHRoZSByaWdodCBvZiBNLiBEcmF3IGEgZGFzaGVkIGxpbmUgZnJvbSBlIHRvIE0xYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEggPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0gnXTtcbiAgICAgIGNvbnN0IHBvaW50NCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNCddO1xuICAgICAgY29uc3QgcG9pbnRNID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydNJ107XG4gICAgICBjb25zdCB4ID0gcG9pbnRNLnggKyBNYXRoLmFicyhwb2ludEgueCAtIHBvaW50NC54KSAvIDI7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ00xJ10gPSBzZXRQb2ludCh4LCBwb2ludE0ueSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ2UnLCAnTTEnLCAnZGFzaGVkJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgT24gdGhlIGxpbmUgZnJvbSBNMSB0byBlLCBwb2ludHMgQiBhbmQgRCBhcmUgYXQgdGhpcmRzLmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRNMSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTTEnXTtcbiAgICAgIGNvbnN0IHBvaW50ZSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snZSddO1xuICAgICAgY29uc3QgZGlzdCA9IE1hdGgucm91bmQoZGlzdFBvaW50VG9Qb2ludChwb2ludE0xLCBwb2ludGUpIC8gMykgLyBzdGF0dXMucHJlY2lzaW9uO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydiJ10gPSBzZXRQb2ludEFsb25nTGluZShzdGF0dXMsIHBvaW50TTEsIHBvaW50ZSwgZGlzdCk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ2QnXSA9IHNldFBvaW50QWxvbmdMaW5lKHN0YXR1cywgcG9pbnRNMSwgcG9pbnRlLCBkaXN0ICogMik7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ2InLCAnNScpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdkJywgJzcnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBUcnVlIHVwIHRoZSBvdGhlciBzaWRlIG9mIHRoZSBkYXJ0IGZyb20gVyB0byA2IHRvIGZpbmQgY2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgbGV0IGRpc3RkdyA9IGRpc3RBQkMoc3RhdHVzLCAnZCcsICc3JywgJ1cnKTtcbiAgICAgIGNvbnN0IHBvaW50VyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snVyddO1xuICAgICAgY29uc3QgcG9pbnQ2ID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc2J107XG4gICAgICBsZXQgZGlzdHkgPSBkaXN0ZHcgLSBkaXN0UG9pbnRUb1BvaW50KHBvaW50VywgcG9pbnQ2KTtcbiAgICAgIGxldCB5ID0gcG9pbnQ2LnkgKyBkaXN0eTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snYyddID0gc2V0UG9pbnQocG9pbnQ2LngsIHkpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICc2JywgJ2MnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnYicsICdjJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgVHJ1ZSB1cCB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgZGFydCBmcm9tIFYgdG8gNCB0byBmaW5kIGEuIE0yIGlzIGFsb25nIHRoZSBsaW5lIGZyb20gTSB0byBILCBhdCB0aGUgaGVpZ2h0IGhhbGZ3YXkgYmV0d2VlbiBiIGFuZCBjYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBsZXQgZGlzdGJWID0gZGlzdEFCQyhzdGF0dXMsICdiJywgJzUnLCAnVicpO1xuICAgICAgY29uc3QgcG9pbnRWID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydWJ107XG4gICAgICBjb25zdCBwb2ludFEgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1EnXTtcbiAgICAgIGNvbnN0IHBvaW50NCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNCddO1xuICAgICAgY29uc3QgcG9pbnRiID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydiJ107XG4gICAgICAvLyBjb25zdCBkaXN0eSA9IGRpc3RiViAtIGRpc3RQb2ludFRvUG9pbnQocG9pbnRWLCBwb2ludDQpO1xuICAgICAgLy8gLy9jb25zdCB5ID0gcG9pbnQ0LnkgKyBkaXN0eTtcbiAgICAgIC8vIC8vaXNudGVhZCBvZiBzdHJhaWdodCBkb3duLCB1c2Ugc2xvcGUgZnJvbSBsaW5lIFZfUVxuICAgICAgLy8gLy95ID0gbXggKyBiXG4gICAgICAvLyAvL20gaXMgc2xvcGUsIGIgaXMgeSBpbnRlcmNlcHRcbiAgICAgIC8vYSBpcyBhY3Jvc3MgZnJvbSBcbiAgICAgIGNvbnN0IG0gPSAocG9pbnRWLnkgLSBwb2ludFEueSkgLyAocG9pbnRWLnggLSBwb2ludFEueCk7XG4gICAgICBjb25zdCBiID0gcG9pbnQ0LnkgLSBtICogcG9pbnQ0Lng7IC8vP1xuICAgICAgY29uc3QgeSA9IHBvaW50Yi55XG4gICAgICBjb25zdCB4ID0gKHkgLSBiKSAvIG07XG5cbiAgICAgIFxuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydhJ10gPSBzZXRQb2ludCh4LCB5KTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnNCcsICdhJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ00xJywgJ2EnKTtcblxuICAgIFxuICAgICAgLy9mcm9udCBteXN0ZXJpb3VzIHBvaW50XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ00yJ10gPSBzZXRQb2ludExpbmVZKHN0YXR1cywgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydNJ10sIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snSCddLCAoc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydiJ10ueSArIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snYyddLnkpIC8gMik7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ00xJywgJ00yJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgZiBpcyAxLzIgaW5jaCByaWdodCBvZiBlYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludGUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ2UnXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snZiddID0gc2V0UG9pbnQocG9pbnRlLnggKyBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIDAuNSksIHBvaW50ZS55KTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnOWInLCAnZicpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICc4JywgJ2UnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnZCcsICdlJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgMTUgaXMgMTIgb2YgdGhlIGJsYWRlIG1lYXN1cmUgbGVmdCBvZiBBMSBhbmQgMS8yIGluY2ggYmVsb3cgVmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgYmxhZGUgPSBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYmxhZGUudmFsdWUpO1xuICAgICAgY29uc3QgcG9pbnRBMSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQTEnXTtcbiAgICAgIGNvbnN0IHBvaW50RCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRCddO1xuICAgICAgY29uc3QgcG9pbnQxMiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMTInXTtcbiAgICAgIGNvbnN0IHBvaW50OWIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzliJ107XG4gICAgICBjb25zdCBwb2ludFYgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1YnXTtcbiAgICAgIGNvbnN0IHBvaW50MTJfOWJJbnRlcnNlY3QgPSBzZXRQb2ludExpbmVZKHN0YXR1cywgcG9pbnQxMiwgcG9pbnQ5YiwgcG9pbnRWLnkpO1xuICAgICAgY29uc3QgcG9pbnRBMV9ESW50ZXJzZWN0ID0gc2V0UG9pbnRMaW5lWShzdGF0dXMsIHBvaW50QTEsIHBvaW50RCwgcG9pbnRWLnkpO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycxNSddID0gc2V0UG9pbnQoKHBvaW50QTFfREludGVyc2VjdC54ICsgcG9pbnQxMl85YkludGVyc2VjdC54KSAvIDIsIHBvaW50Vi55ICsgaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCAwLjUpKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAxNiBpcyAxLzMgb2YgdGhlIHdheSBmcm9tIGYgdG8gRGB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRmID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydmJ107XG4gICAgICBjb25zdCBwb2ludEQgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0QnXTtcbiAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmFicyhwb2ludGYueCAtIHBvaW50RC54KSAvIDM7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzE2J10gPSBzZXRQb2ludChwb2ludGYueCArIGRpc3QsIHBvaW50Zi55KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBEMSBpcyByaWdodCBiZWxvdyBELiBQb2ludCBnIGlzIHJpZ2h0IG9mIGYuIEQgdG8gRDEgYW5kIEQxIHRvIGcgYXJlIHRoZSBzYW1lIGRpc3RhbmNlYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEQgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0QnXTtcbiAgICAgIGNvbnN0IHBvaW50ZiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snZiddO1xuICAgICAgXG4gICAgICAvL0QxIGlzIGluIHRoZSBjZW50ZXIsIGcgYW5kIEQgYXJlIG9uIHRoZSBjaXJjdW1mZXJlbmNlLiB0aGUgbGluZSBmcm9tIEQxIHRvIEQgaXMgYXQgMTIgbydjbG9jaywgdGhlIGxpbmUgZnJvbSBEMSB0byBHIGlzIGF0IDggbydjbG9ja1xuICAgICAgbGV0IGFuZ2xlID0gNTA7XG4gICAgICBjb25zdCBhbmdsZVJhZCA9IGFuZ2xlICogKE1hdGguUEkgLyAxODApO1xuICAgICAgbGV0IHIgPSAocG9pbnRELnkgLSBwb2ludGYueSkvKDEgKyBNYXRoLnNpbihhbmdsZVJhZCkpO1xuICAgICAgbGV0IHhnID0gcG9pbnRELnggKyByICogTWF0aC5jb3MoYW5nbGVSYWQpO1xuXG4gICAgICBsZXQgcG9pbnREMSA9IHt4OiBwb2ludEQueCwgeTogcG9pbnRELnkgLSByfTtcbiAgICAgIGxldCBwb2ludEcgPSB7eDogeGcsIHk6IHBvaW50Zi55fTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRDEnXSA9IHNldFBvaW50KHBvaW50RDEueCwgcG9pbnREMS55KTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snZyddID0gc2V0UG9pbnQocG9pbnRHLngsIHBvaW50Ry55KTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnRCcsICdEMScpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdEMScsICdnJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJzE1JywgJzE2JywgJ2Rhc2hlZCcpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdnJywgJ2YnLCAnZGFzaGVkJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfVxuXTtcbmZ1bmN0aW9uIHdpZHRoVG9wQmFjayhzdGF0dXMpe1xuICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAvL3JldHVybnMgdGhlIHdpZHRoIG9mIHRoZSB0b3Agb2YgdGhlIGJhY2ssIHRoZSBxdWFydGVyIGVsbGlwc2UgMS0yIGFyb3VuZCBPXG4gIGNvbnN0IHBvaW50MSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMSddO1xuXG4gIC8vY29uc3QgcG9pbnQxID0ge3g6IDIwLCB5OiAwfTtcbiAgY29uc3QgcG9pbnQyID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycyJ107IFxuICBjb25zdCBjZW50ZXIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ08nXTtcbiAgY29uc3QgcCA9IHBlcmltZXRlckVsbGlwc2Uoc3RhdHVzLCBjZW50ZXIsIHBvaW50MSwgcG9pbnQyKTtcbiAgcmV0dXJuIHAgLyA0O1xufVxuXG5mdW5jdGlvbiBmaW5kUG9pbnRFKHN0YXR1cywgcG9pbnRKLCBwb2ludFApe1xuICBjb25zdCBwb2ludGogPSBzZXRQb2ludChwb2ludEoueCAtICgxICogc3RhdHVzLnByZWNpc2lvbiksIHBvaW50Si55KTtcbiAgY29uc3QgZnJvbnRMZW5ndGggPSBwYXJzZUZsb2F0KHN0YXR1cy5kZXNpZ24ubWVhc3VyZW1lbnRzLmZyb250TGVuZ3RoLnZhbHVlKSAqIHN0YXR1cy5wcmVjaXNpb247XG5cbiAgLy90aGUgXCJ3aWR0aCBvZiB0b3AgYmFja1wiIG5vdCBjbGVhciBpbiB0aGUgaW5zdHJ1Y3Rpb25zLiBCdXQgaXQgc2VlbXMgdGhhdCAxLzEyIG9mIHRoZSBicmVhc3QgdmFsdWUgZ2V0cyB0aGUgcmlnaHQgcmVzdWx0XG4gIC8vSSBkaWQgdHJ5IGZyb20gTyB0byAyLCBhcyB3ZWxsIGFzIGZpbmRpbmcgdGhlIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGVsbGlwc2UsIGJ1dCBuZWl0aGVyIHNlZW1lZCB0byB3b3JrLlxuICAvL2NvbnN0IHd0YiA9IE1hdGguYWJzKHBhcnNlRmxvYXQoc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDEyICogc3RhdHVzLnByZWNpc2lvbik7XG4gIFxuICAvL28tMiBpcyB0aGUgd2lkdGggb2YgdGhlIHRvcCBiYWNrXG4gIGNvbnN0IHd0YiA9IHdpZHRoVG9wQmFjayhzdGF0dXMpO1xuICBcbiAgXG4gIC8vd2UgbmVlZCB0byBmaW5kIHRoZSB5IGZvciBwb2ludCBFXG4gIC8vd2UgaGF2ZSBhIHRyaWFuZ2xlLCB3aXRoIGxpbmVzIGEsIGIsIGFuZCBjLlxuICAvL2EgaXMgYWxvbmcgeCwgZnJvbSBwb2ludGogdG8gcG9pbnRQXG4gIGNvbnN0IGEgPSBNYXRoLmFicyhwb2ludFAueCAtIHBvaW50ai54KTtcbiAgY29uc3QgYyA9IGZyb250TGVuZ3RoIC0gd3RiO1xuICAvL2IgaXMgYWxvbmcgeSwgb24geCBvZiBwb2ludCBQLlxuICAvL2FeMiArIGJeMiA9IGNeMlxuICAvL2IgPSBzcXJ0KGNeMiAtIGFeMilcbiAgY29uc3QgYiA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KGMgKiBjIC0gYSAqIGEpKTtcbiAgY29uc3QgZXkgPSBNYXRoLnJvdW5kKHBvaW50Si55IC0gYik7XG4gIHJldHVybiBzZXRQb2ludChwb2ludFAueCwgZXksIHtsOiB0cnVlfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3RPdG9BKHN0YXR1cyl7XG4gIGNvbnN0IGIgPSBzdGF0dXMubWVhc3VyZW1lbnRzLmJhY2tMZW5ndGgudmFsdWUgKyAwLjc1O1xuICBjb25zdCBhID0gc3RhdHVzLm1lYXN1cmVtZW50cy5oZWlnaHRVbmRlckFybS52YWx1ZTtcbiAgcmV0dXJuIGIgLSBhO1xufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgeyBkZXNpZ25faW5mbywgbWVhc3VyZW1lbnRzLCBzdGVwcyB9O1xuIiwgImltcG9ydCBrZXlzdG9uZV9zaW5nbGUgZnJvbSAnLi9rZXlzdG9uZV9zaW5nbGUtYnJlYXN0ZWQtdmVzdC5qcyc7XG5cbmNvbnN0IGRlc2lnbnMgPSBbXG4gIGtleXN0b25lX3NpbmdsZVxuXS5tYXAoKGRlc2lnbikgPT4ge1xuICByZXR1cm4ge1xuICAgIGxhYmVsOiBkZXNpZ24uZGVzaWduX2luZm8udGl0bGUsXG4gICAgZGVzaWduX2luZm86IGRlc2lnbi5kZXNpZ25faW5mbyxcbiAgICBtZWFzdXJlbWVudHM6IGRlc2lnbi5tZWFzdXJlbWVudHMsXG4gICAgcG9pbnRzOiBkZXNpZ24ucG9pbnRzLFxuICAgIHN0ZXBzOiBkZXNpZ24uc3RlcHNcbiAgfTtcbn0pO1xuXG5leHBvcnQgeyBkZXNpZ25zIH07XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG1ha2VQaXhlbHMoc3RhdHVzKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBzdGF0dXMucGF0dGVybjtcbiAgY29uc3QgbWFyZ2luID0gc3RhdHVzLmNhbnZhc0luZm8ubWFyZ2luO1xuICBjb25zdCBwaXhlbHNQZXJJbmNoID0gc3RhdHVzLmNhbnZhc0luZm8ucGl4ZWxzUGVySW5jaDtcbiAgY29uc3QgZGVmYXVsdFNpemUgPSB7Li4uc3RhdHVzLmNhbnZhc0luZm8uZGVmYXVsdFNpemV9O1xuICBjb25zdCBwcmVjaXNpb24gPSBzdGF0dXMucHJlY2lzaW9uO1xuICBsZXQgcGl4ZWxQYXR0ZXJuID0ge1xuICAgIHBvaW50czoge30sXG4gICAgbGluZXM6IFsuLi5wYXR0ZXJuLmxpbmVzXSxcbiAgICBjdXJ2ZXM6IFsuLi5wYXR0ZXJuLmN1cnZlc10sXG4gICAgY2FudmFzU2l6ZTogZGVmYXVsdFNpemUsXG4gIH07XG5cbiAgbGV0IHNtYWxsZXN0WCA9IG1hcmdpbjtcbiAgbGV0IHNtYWxsZXN0WSA9IG1hcmdpbjtcbiAgbGV0IGxhcmdlc3RYID0gbWFyZ2luO1xuICBsZXQgbGFyZ2VzdFkgPSBtYXJnaW47XG5cbiAgZm9yIChsZXQgcG9pbnQgaW4gcGF0dGVybi5wb2ludHMpIHtcbiAgICBsZXQgcGl4ZWxQb2ludCA9IGNvbnZlcnRQb2ludChwb2ludCwgcGF0dGVybi5wb2ludHNbcG9pbnRdLCBwaXhlbHNQZXJJbmNoLCBwcmVjaXNpb24pO1xuICAgIHBpeGVsUGF0dGVybi5wb2ludHNbcG9pbnRdID0gcGl4ZWxQb2ludDtcblxuICAgIGxldCB4ID0gcGl4ZWxQb2ludC54O1xuICAgIGxldCB5ID0gcGl4ZWxQb2ludC55O1xuXG4gICAgaWYgKHggPCBzbWFsbGVzdFgpIHtcbiAgICAgIHNtYWxsZXN0WCA9IHg7XG4gICAgfVxuICAgIGlmICh5IDwgc21hbGxlc3RZKSB7XG4gICAgICBzbWFsbGVzdFkgPSB5O1xuICAgIH1cbiAgICBpZiAoeCA+IGxhcmdlc3RYKSB7XG4gICAgICBsYXJnZXN0WCA9IHg7XG4gICAgfVxuICAgIGlmICh5ID4gbGFyZ2VzdFkpIHtcbiAgICAgIGxhcmdlc3RZID0geTtcbiAgICB9XG4gIH1cblxuICBsZXQgeE9mZnNldCA9IDA7XG4gIGxldCB5T2Zmc2V0ID0gMDtcbiAgaWYgKHNtYWxsZXN0WCA8IG1hcmdpbikge1xuICAgIHhPZmZzZXQgPSBtYXJnaW4gLSBzbWFsbGVzdFg7XG4gIH1cbiAgaWYgKHNtYWxsZXN0WSA8IG1hcmdpbikge1xuICAgIHlPZmZzZXQgPSBtYXJnaW4gLSBzbWFsbGVzdFk7XG4gIH1cblxuICBmb3IgKGxldCBwb2ludCBpbiBwaXhlbFBhdHRlcm4ucG9pbnRzKSB7XG4gICAgcGl4ZWxQYXR0ZXJuLnBvaW50c1twb2ludF0ueCArPSB4T2Zmc2V0O1xuICAgIHBpeGVsUGF0dGVybi5wb2ludHNbcG9pbnRdLnkgKz0geU9mZnNldDtcbiAgfVxuXG4gIGxldCBuZXdMYXJnZXN0WCA9IGxhcmdlc3RYICsgeE9mZnNldDtcbiAgbGV0IG5ld0xhcmdlc3RZID0gbGFyZ2VzdFkgKyB5T2Zmc2V0O1xuXG4gIGxldCB3aWR0aCA9IG5ld0xhcmdlc3RYICsgbWFyZ2luO1xuICBsZXQgaGVpZ2h0ID0gbmV3TGFyZ2VzdFkgKyBtYXJnaW47XG5cbiAgaWYgKHdpZHRoID4gZGVmYXVsdFNpemUueCkge1xuICAgIHBpeGVsUGF0dGVybi5jYW52YXNTaXplLnggPSB3aWR0aDtcbiAgfVxuICBpZiAoaGVpZ2h0ID4gZGVmYXVsdFNpemUueSkge1xuICAgIHBpeGVsUGF0dGVybi5jYW52YXNTaXplLnkgPSBoZWlnaHQ7XG4gIH1cblxuICByZXR1cm4gcGl4ZWxQYXR0ZXJuO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UG9pbnQobGFiZWwsIHBvaW50LCBwaXhlbHNQZXJJbmNoLCBwcmVjaXNpb24pIHtcbiAgbGV0IHggPSAocG9pbnQueCAvIHByZWNpc2lvbikgKiBwaXhlbHNQZXJJbmNoO1xuICBsZXQgeSA9IChwb2ludC55IC8gcHJlY2lzaW9uKSAqIHBpeGVsc1BlckluY2g7XG4gIHJldHVybiB7IGxhYmVsOiBsYWJlbCwgeDogeCwgeTogeSwgZ3VpZGVzOiBwb2ludC5ndWlkZXMgfTtcbn1cbiIsICJpbXBvcnQgeyBtYWtlUGl4ZWxzIH0gZnJvbSAnLi9waXhlbHMuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZHJhd1BhdHRlcm4oc3RhdHVzKSB7XG4gIGxldCBwaXhlbFBhdHRlcm4gPSBtYWtlUGl4ZWxzKHN0YXR1cyk7XG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgY2FudmFzLndpZHRoID0gcGl4ZWxQYXR0ZXJuLmNhbnZhc1NpemUueDtcbiAgY2FudmFzLmhlaWdodCA9IHBpeGVsUGF0dGVybi5jYW52YXNTaXplLnk7XG4gIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgY3R4LmZvbnQgPSAnMTJweCBzZXJpZic7XG4gIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICBjdHguc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICBjdHgubGluZVdpZHRoID0gMTtcblxuICBsZXQgZHJhd2luZyA9IHtcbiAgICBwb2ludHM6IFtdLFxuICAgIGxpbmVzOiBbXSxcbiAgICBjdXJ2ZXM6IFtdXG4gIH07XG5cbiAgZm9yIChsZXQgcG9pbnQgaW4gcGl4ZWxQYXR0ZXJuLnBvaW50cykge1xuICAgIGRyYXdQb2ludChjdHgsIHN0YXR1cywgcGl4ZWxQYXR0ZXJuLCBwb2ludCk7XG4gIH1cblxuICBmb3IgKGxldCBsaW5lIG9mIHBpeGVsUGF0dGVybi5saW5lcykge1xuXG4gICAgbGV0IHN0YXJ0ID0gcGl4ZWxQYXR0ZXJuLnBvaW50c1tsaW5lLnN0YXJ0XTtcbiAgICBsZXQgZW5kID0gcGl4ZWxQYXR0ZXJuLnBvaW50c1tsaW5lLmVuZF07XG5cbiAgICBpZiAobGluZS5zdHlsZSA9PT0gJ2Rhc2hlZCcpIHtcbiAgICAgIGN0eC5zZXRMaW5lRGFzaChbNSwgNV0pO1xuICAgIH0gZWxzZSB7ICAvL3NvbGlkXG4gICAgICBjdHguc2V0TGluZURhc2goW10pO1xuICAgIH1cbiAgICBpZiAobGluZS5sZW5ndGggPT09ICdkZWZpbmVkJykge1xuICAgICAgZHJhd0xpbmUoY3R4LCBzdGFydCwgZW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJhd0xpbmUoY3R4LCBzdGFydCwgZW5kLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBjdXJ2ZSBvZiBwaXhlbFBhdHRlcm4uY3VydmVzKSB7XG4gICAgZHJhd1F1YXJ0ZXJFbGxpcHNlKGN0eCwgc3RhdHVzLCBwaXhlbFBhdHRlcm4sIGN1cnZlKTtcbiAgICBcbiAgfVxuXG4gIHN0YXR1cy5jYW52YXNJbmZvLmRyYXdpbmcgPSBkcmF3aW5nO1xuICByZXR1cm4gc3RhdHVzO1xufVxuXG5mdW5jdGlvbiBkcmF3UG9pbnQoY3R4LCBzdGF0dXMsIHBpeGVsUGF0dGVybiwgcG9pbnRMYWJlbCkge1xuICBsZXQgcG9pbnQgPSBwaXhlbFBhdHRlcm4ucG9pbnRzW3BvaW50TGFiZWxdO1xuICBsZXQgcG9pbnRTaXplID0gc3RhdHVzLmNhbnZhc0luZm8ucG9pbnRTaXplO1xuICBsZXQgbWFyZ2luID0gc3RhdHVzLmNhbnZhc0luZm8ubWFyZ2luO1xuICBsZXQgeCA9IHBvaW50Lng7XG4gIGxldCB5ID0gcG9pbnQueTtcbiAgbGV0IGd1aWRlcyA9IHBvaW50Lmd1aWRlcztcblxuICBjdHguYmVnaW5QYXRoKCk7XG4gIC8vbWFrZSBhIHNtYWxsIHNvbGlkIGJsYWNrIHNxdWFyZSBmb3IgdGhlIHBvaW50XG5cbiAgY3R4LnJlY3QoeCAtIHBvaW50U2l6ZSAvIDIsIHkgLSBwb2ludFNpemUgLyAyLCBwb2ludFNpemUsIHBvaW50U2l6ZSk7XG4gIGN0eC5maWxsKCk7XG4gIC8vc2V0IGxhYmVsIHRvIHRoZSB1cHBlciByaWdodCBieSAxNSBwaXhlbHNcbiAgY3R4LmZpbGxUZXh0KHBvaW50TGFiZWwsIHggKyA1LCB5IC0gNSk7XG5cbiAgY3R4LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gIGlmIChndWlkZXMudSkge1xuICAgIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgY3R4LmxpbmVUbyh4LCBtYXJnaW4pO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfVxuICBpZiAoZ3VpZGVzLmQpIHtcbiAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgIGN0eC5saW5lVG8oeCwgcGl4ZWxQYXR0ZXJuLmNhbnZhc1NpemUueSAtIG1hcmdpbik7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG4gIGlmIChndWlkZXMubCkge1xuICAgIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgY3R4LmxpbmVUbyhtYXJnaW4sIHkpO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfVxuICBpZiAoZ3VpZGVzLnIpIHtcbiAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgIGN0eC5saW5lVG8ocGl4ZWxQYXR0ZXJuLmNhbnZhc1NpemUueCAtIG1hcmdpbiwgeSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdMaW5lKGN0eCwgc3RhcnQsIGVuZCwgY29udGludWVkID0gZmFsc2UpIHtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHgubW92ZVRvKHN0YXJ0LngsIHN0YXJ0LnkpO1xuICBpZiAoY29udGludWVkKSB7XG4gICAgbGV0IGR4ID0gZW5kLnggLSBzdGFydC54O1xuICAgIGxldCBkeSA9IGVuZC55IC0gc3RhcnQueTtcbiAgICBsZXQgbGVuZ3RoID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICBsZXQgc2NhbGUgPSA0MDAgLyBsZW5ndGg7XG4gICAgbGV0IG9mZnNldFggPSBkeCAqIHNjYWxlO1xuICAgIGxldCBvZmZzZXRZID0gZHkgKiBzY2FsZTtcbiAgICBjdHgubGluZVRvKGVuZC54ICsgb2Zmc2V0WCwgZW5kLnkgKyBvZmZzZXRZKTtcbiAgfSBlbHNlIHtcbiAgICBjdHgubGluZVRvKGVuZC54LCBlbmQueSk7XG4gIH1cbiAgY3R4LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3UXVhcnRlckVsbGlwc2UoY3R4LCBfc3RhdHVzLCBwaXhlbFBhdHRlcm4sIGN1cnZlLCBzdHlsZSA9ICdzb2xpZCcpIHtcbiAgLy9hc3N1bWUgcXVhcnRlciBvZiBhbiBlbGxpcHNlXG4gIGxldCBwb2ludDEgPSBwaXhlbFBhdHRlcm4ucG9pbnRzW2N1cnZlLnN0YXJ0XTtcbiAgbGV0IHBvaW50MiA9IHBpeGVsUGF0dGVybi5wb2ludHNbY3VydmUuZW5kXTtcbiAgbGV0IHF1YXJ0ZXIgPSBjdXJ2ZS5xdWFydGVyO1xuICAvL3F1YXJ0ZXIgMSwgMiwgMywgb3IgNCwgY2xvY2t3aXNlIGZyb20gMTIgbydjbG9jayAoc28gMSBpcyB0b3AgcmlnaHQsIDIgaXMgYm90dG9tIHJpZ2h0LCAzIGlzIGJvdHRvbSBsZWZ0LCA0IGlzIHRvcCBsZWZ0KVxuICAvL2NhbGN1bGF0ZSBjZW50ZXIgZnJvbSBzdGFydCwgZW5kLCBhbmQgcXVhcnRlclxuICBsZXQgc3RhcnQgPSB7IHg6IDAsIHk6IDAgfTtcbiAgbGV0IGVuZCA9IHsgeDogMCwgeTogMCB9O1xuICBsZXQgY2VudGVyID0geyB4OiAwLCB5OiAwIH07XG4gIGxldCBzdGFydEFuZ2xlID0gMDtcbiAgbGV0IGVuZEFuZ2xlID0gMDtcbiAgbGV0IHJhZGl1c1ggPSAwO1xuICBsZXQgcmFkaXVzWSA9IDA7XG5cblxuXG4gIGlmIChxdWFydGVyID09PSAxKSB7XG4gICAgLy9jZW50ZXIgaXMgYmVsb3cgdGhlIHN0YXJ0IHBvaW50IGFuZCB0byB0aGUgbGVmdCBvZiB0aGUgZW5kIHBvaW50XG4gICAgLy9zZXQgc3RhcnQgYW5kIGVuZCBwb2ludHMsIGJhc2VkIG9uIGRpcmVjdGlvbiBmcm9tIGNlbnRlclxuICAgIGlmIChwb2ludDEueCA8IHBvaW50Mi54KSB7XG4gICAgICAvL3BvaW50MSBpcyB0byB0aGUgbGVmdCBvZiBwb2ludDJcbiAgICAgIHN0YXJ0ID0gcG9pbnQxO1xuICAgICAgZW5kID0gcG9pbnQyO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IHBvaW50MjtcbiAgICAgIGVuZCA9IHBvaW50MTtcbiAgICB9XG4gICAgc3RhcnRBbmdsZSA9IDEgKiBNYXRoLlBJO1xuICAgIGVuZEFuZ2xlID0gMC41ICogTWF0aC5QSTtcbiAgICBjZW50ZXIgPSB7IHg6IHN0YXJ0LngsIHk6IGVuZC55IH07XG4gICAgcmFkaXVzWCA9IE1hdGguYWJzKGNlbnRlci54IC0gc3RhcnQueCk7XG4gICAgcmFkaXVzWSA9IE1hdGguYWJzKGNlbnRlci55IC0gc3RhcnQueSk7XG5cbiAgfSBlbHNlIGlmIChxdWFydGVyID09PSAyKSB7XG4gICAgLy9jZW50ZXIgaXMgdG8gdGhlIGxlZnQgb2YgdGhlIHN0YXJ0IHBvaW50IGFuZCBhYm92ZSB0aGUgZW5kIHBvaW50XG4gICAgLy9zZXQgc3RhcnQgYW5kIGVuZCBwb2ludHMsIGJhc2VkIG9uIGRpcmVjdGlvbiBmcm9tIGNlbnRlclxuICAgIGlmIChwb2ludDEueCA+IHBvaW50Mi54KSB7XG4gICAgICAvL3BvaW50MSBpcyB0byB0aGUgcmlnaHQgb2YgcG9pbnQyXG4gICAgICBzdGFydCA9IHBvaW50MTtcbiAgICAgIGVuZCA9IHBvaW50MjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSBwb2ludDI7XG4gICAgICBlbmQgPSBwb2ludDE7XG4gICAgfVxuICAgIHN0YXJ0QW5nbGUgPSAyICogTWF0aC5QSTtcbiAgICBlbmRBbmdsZSA9IDAuNSAqIE1hdGguUEk7XG4gICAgY2VudGVyID0geyB4OiBlbmQueCwgeTogc3RhcnQueSB9O1xuICAgIHJhZGl1c1ggPSBNYXRoLmFicyhjZW50ZXIueCAtIHN0YXJ0LngpO1xuICAgIHJhZGl1c1kgPSBNYXRoLmFicyhjZW50ZXIueSAtIGVuZC55KTtcbiAgfSBlbHNlIGlmIChxdWFydGVyID09PSAzKSB7XG4gICAgLy9jZW50ZXIgaXMgYWJvdmUgdGhlIHN0YXJ0IHBvaW50IGFuZCB0byB0aGUgcmlnaHQgb2YgdGhlIGVuZCBwb2ludFxuICAgIC8vc2V0IHN0YXJ0IGFuZCBlbmQgcG9pbnRzLCBiYXNlZCBvbiBkaXJlY3Rpb24gZnJvbSBjZW50ZXJcbiAgICBpZiAocG9pbnQxLnggPiBwb2ludDIueCkge1xuICAgICAgLy9wb2ludDEgaXMgdG8gdGhlIHJpZ2h0IG9mIHBvaW50MlxuICAgICAgc3RhcnQgPSBwb2ludDE7XG4gICAgICBlbmQgPSBwb2ludDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gcG9pbnQyO1xuICAgICAgZW5kID0gcG9pbnQxO1xuICAgIH1cbiAgICBzdGFydEFuZ2xlID0gMC41ICogTWF0aC5QSTtcbiAgICBlbmRBbmdsZSA9IE1hdGguUEk7XG4gICAgY2VudGVyID0geyB4OiBzdGFydC54LCB5OiBlbmQueSB9O1xuICAgIHJhZGl1c1ggPSBNYXRoLmFicyhjZW50ZXIueCAtIGVuZC54KTtcbiAgICByYWRpdXNZID0gTWF0aC5hYnMoY2VudGVyLnkgLSBzdGFydC55KTtcblxuICB9IGVsc2UgaWYgKHF1YXJ0ZXIgPT09IDQpIHtcbiAgICAvL2NlbnRlciBpcyB0byB0aGUgcmlnaHQgb2YgdGhlIHN0YXJ0IHBvaW50IGFuZCBiZWxvdyB0aGUgZW5kIHBvaW50XG4gICAgLy9zZXQgc3RhcnQgYW5kIGVuZCBwb2ludHMsIGJhc2VkIG9uIGRpcmVjdGlvbiBmcm9tIGNlbnRlclxuICAgIGlmIChwb2ludDEueCA8IHBvaW50Mi54KSB7XG4gICAgICAvL3BvaW50MSBpcyB0byB0aGUgbGVmdCBvZiBwb2ludDJcbiAgICAgIHN0YXJ0ID0gcG9pbnQxO1xuICAgICAgZW5kID0gcG9pbnQyO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IHBvaW50MjtcbiAgICAgIGVuZCA9IHBvaW50MTtcbiAgICB9XG4gICAgc3RhcnRBbmdsZSA9IDEgKiBNYXRoLlBJO1xuICAgIGVuZEFuZ2xlID0gMS41ICogTWF0aC5QSTtcbiAgICBjZW50ZXIgPSB7IHg6IGVuZC54LCB5OiBzdGFydC55IH07XG4gICAgcmFkaXVzWCA9IE1hdGguYWJzKGNlbnRlci54IC0gc3RhcnQueCk7XG4gICAgcmFkaXVzWSA9IE1hdGguYWJzKGNlbnRlci55IC0gZW5kLnkpO1xuICB9XG4gICAgLy9kcmF3IHF1YXJ0ZXIgZWxsaXBzZSBmcm9tIHN0YXJ0IHRvIGVuZCwgY2VudGVyZWQgb24gY2VudGVyXG4gICAgaWYgKGN1cnZlLnN0eWxlID09PSAnZGFzaGVkJykge1xuICAgICAgY3R4LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgfSBlbHNlIHsgIC8vc29saWRcbiAgICAgIGN0eC5zZXRMaW5lRGFzaChbXSk7XG4gICAgfVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguZWxsaXBzZShjZW50ZXIueCwgY2VudGVyLnksIHJhZGl1c1gsIHJhZGl1c1ksIDAsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKTtcbiAgICBjdHguc3Ryb2tlKCk7XG59IiwgImltcG9ydCB7IGRlc2lnbnMgfSBmcm9tICcuL2Rlc2lnbnMvZGVzaWduX2xpc3QuanMnO1xuaW1wb3J0IHsgbWFrZVBhdHRlcm4gfSBmcm9tICcuL3BhdHRlcm4uanMnO1xuaW1wb3J0IHsgZHJhd1BhdHRlcm4gfSBmcm9tICcuL2RyYXdpbmcuanMnO1xuXG5jb25zdCBkZWZhdWx0Q2FudmFzU2l6ZSA9IHsgeDogNTAwLCB5OiA1MDAgfTtcbmNvbnN0IGRlZmF1bHRQaXhlbHNQZXJJbmNoID0gMzI7XG5jb25zdCBkZWZhdWx0Q2FudmFzTWFyZ2luID0gZGVmYXVsdFBpeGVsc1BlckluY2ggLyAyO1xuY29uc3QgZGVmYXVsdERlc2lnbiA9IGRlc2lnbnNbMF07XG5jb25zdCBkZWZhdWx0UHJlY2lzaW9uID0gODsgLy8xLzggb2YgYW4gaW5jaFxuXG5sZXQgc3RhdHVzID0ge1xuICBkZXNpZ246IGRlZmF1bHREZXNpZ24sXG4gIG1lYXN1cmVtZW50czogZGVmYXVsdERlc2lnbi5tZWFzdXJlbWVudHMsXG4gIHByZWNpc2lvbjogZGVmYXVsdFByZWNpc2lvbiwgXG4gIGNhbnZhc0luZm86IHtcbiAgICBkZWZhdWx0U2l6ZTogZGVmYXVsdENhbnZhc1NpemUsXG4gICAgc2l6ZTogey4uLmRlZmF1bHRDYW52YXNTaXplfSxcbiAgICBtYXJnaW46IGRlZmF1bHRDYW52YXNNYXJnaW4sXG4gICAgcGl4ZWxzUGVySW5jaDogZGVmYXVsdFBpeGVsc1BlckluY2gsXG4gICAgZHJhd2luZzoge1xuICAgICAgcG9pbnRzOiBbXSxcbiAgICAgIGxpbmVzOiBbXSxcbiAgICAgIGN1cnZlczogW11cbiAgICB9LFxuICAgIHBvaW50U2l6ZTogNSxcbiAgfSxcbiAgcGF0dGVybjoge1xuICAgIHBvaW50czoge30sXG4gICAgbGluZXM6IFtdLFxuICAgIGN1cnZlczogW10sXG4gICAgc3RlcHM6IFtdXG4gIH1cbn1cblxubGV0IGxpTWF4V2lkdGggPSAwO1xuXG5sZXQgbWVhc3VyZW1lbnRzTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZWFzdXJlbWVudHNMaXN0Jyk7XG5sZXQgc3RlcHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0ZXBzTGlzdCcpO1xubGV0IGRlc2lnbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnbkRlc2lnbmVyJyk7XG5sZXQgZGVzaWduU291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnblNvdXJjZScpO1xubGV0IGRlc2lnblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZXNpZ25TZWxlY3QnKTtcblxuZGVzaWducy5mb3JFYWNoKChkZXNpZ24sIGluZGV4KSA9PiB7XG4gIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICBvcHRpb24udmFsdWUgPSBpbmRleDtcbiAgb3B0aW9uLnRleHRDb250ZW50ID0gZGVzaWduLmxhYmVsO1xuICBkZXNpZ25TZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbn0pO1xuXG5mdW5jdGlvbiBpbnB1dERlc2lnbihkZXNpZ24pe1xuICBkZXNpZ25lci50ZXh0Q29udGVudCA9IGRlc2lnbi5kZXNpZ25faW5mby5kZXNpZ25lcjtcbiAgZGVzaWduU291cmNlLnRleHRDb250ZW50ID0gZGVzaWduLmRlc2lnbl9pbmZvLnNvdXJjZS5sYWJlbDtcbiAgZGVzaWduU291cmNlLmhyZWYgPSBkZXNpZ24uZGVzaWduX2luZm8uc291cmNlLmxpbms7XG4gIGRlc2lnblNvdXJjZS50YXJnZXQgPSBcIl9ibGFua1wiO1xufVxuXG5mdW5jdGlvbiBpbnB1dE1lYXN1cmVtZW50cyhtZWFzdXJlbWVudHMpe1xuICBmb3IgKGNvbnN0IG1lYXN1cmVtZW50IGluIG1lYXN1cmVtZW50cykge1xuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGxhYmVsLmZvciA9IG1lYXN1cmVtZW50O1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gbWVhc3VyZW1lbnRzW21lYXN1cmVtZW50XS5sYWJlbDtcbiAgICBpbnB1dC50eXBlID0gXCJudW1iZXJcIjtcbiAgICBpbnB1dC5pZCA9IG1lYXN1cmVtZW50O1xuICAgIGlucHV0LnZhbHVlID0gYCR7bWVhc3VyZW1lbnRzW21lYXN1cmVtZW50XS52YWx1ZX1gO1xuXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJlZHJhd1N0ZXBzRnJvbU1lYXN1cmUoaW5wdXQsIGlucHV0LnZhbHVlKTtcbiAgICB9KTtcblxuICAgIGxpLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBsaS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgbWVhc3VyZW1lbnRzTGlzdC5hcHBlbmRDaGlsZChsaSk7XG4gICAgbGV0IGxpV2lkdGggPSBsaS5vZmZzZXRXaWR0aDtcbiAgICBpZiAobGlXaWR0aCA+IGxpTWF4V2lkdGgpIHtcbiAgICAgIGxpTWF4V2lkdGggPSBsaVdpZHRoO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpbnB1dFN0ZXBzKHN0ZXBzKXtcbiAgbGV0IGN1cnJlbnRTdGVwID0gMTtcbiAgZm9yIChjb25zdCBzdGVwIG9mIHN0ZXBzKSB7XG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBjb25zdCBpbnN0cnVjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IGBTdGVwICR7Y3VycmVudFN0ZXB9LilgO1xuICAgIGluc3RydWN0aW9uLnRleHRDb250ZW50ID0gc3RlcDtcbiAgICBsaS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgbGkuYXBwZW5kQ2hpbGQoaW5zdHJ1Y3Rpb24pO1xuICAgIHN0ZXBzTGlzdC5hcHBlbmRDaGlsZChsaSk7XG4gICAgY3VycmVudFN0ZXArKztcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaXN0TGF5b3V0KCkge1xuICBjb25zdCBkb2NfbWVhc3VyZW1lbnRzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZWFzdXJlbWVudHNMaXN0Jyk7XG4gIGNvbnN0IGxpRWxlbWVudHMgPSBkb2NfbWVhc3VyZW1lbnRzTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuXG4gIGNvbnN0IGxpc3RTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY19tZWFzdXJlbWVudHNMaXN0KTtcbiAgY29uc3QgbGlzdFBhZGRpbmcgPSBwYXJzZUZsb2F0KGxpc3RTdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KGxpc3RTdHlsZS5wYWRkaW5nUmlnaHQpO1xuXG4gIGxpRWxlbWVudHMuZm9yRWFjaCgobGkpID0+IHtcbiAgICBjb25zdCBsaVdpZHRoID0gbGkub2Zmc2V0V2lkdGg7XG4gICAgaWYgKGxpV2lkdGggPiBsaU1heFdpZHRoKSB7XG4gICAgICBsaU1heFdpZHRoID0gbGlXaWR0aDtcbiAgICB9XG4gIH0pO1xuICBcbiAgaWYgKGRvY19tZWFzdXJlbWVudHNMaXN0Lm9mZnNldFdpZHRoIDwgbGlNYXhXaWR0aCArIGxpc3RQYWRkaW5nKSB7XG4gICAgZG9jX21lYXN1cmVtZW50c0xpc3QuY2xhc3NMaXN0LmFkZCgnbmFycm93Jyk7XG4gIH0gZWxzZSB7XG4gICAgZG9jX21lYXN1cmVtZW50c0xpc3QuY2xhc3NMaXN0LnJlbW92ZSgnbmFycm93Jyk7XG4gIH1cbn1cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RlcHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0ZXBzTGlzdCcpO1xuICBzdGVwc0xpc3Quc2Nyb2xsVG9wID0gc3RlcHNMaXN0LnNjcm9sbEhlaWdodDtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZUxpc3RMYXlvdXQpO1xudXBkYXRlTGlzdExheW91dCgpO1xuXG5pbnB1dERlc2lnbihzdGF0dXMuZGVzaWduKTtcbmlucHV0TWVhc3VyZW1lbnRzKHN0YXR1cy5kZXNpZ24ubWVhc3VyZW1lbnRzKTtcbnN0YXR1cyA9IG1ha2VQYXR0ZXJuKHN0YXR1cyk7XG5pbnB1dFN0ZXBzKHN0YXR1cy5wYXR0ZXJuLnN0ZXBzKTtcbmRyYXdQYXR0ZXJuKHN0YXR1cyk7XG5cbmZ1bmN0aW9uIHJlZHJhd1N0ZXBzRnJvbU1lYXN1cmUoaW5wdXQsIHZhbHVlKSB7XG4gIHN0ZXBzTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgc3RhdHVzLm1lYXN1cmVtZW50c1tpbnB1dC5pZF0udmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgc3RhdHVzID0gbWFrZVBhdHRlcm4oc3RhdHVzKTtcbiAgaW5wdXRTdGVwcyhzdGF0dXMucGF0dGVybi5zdGVwcyk7XG4gIGRyYXdQYXR0ZXJuKHN0YXR1cyk7XG59XG5cbmRlc2lnblNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgc3RhdHVzLmRlc2lnbiA9IGRlc2lnbnNbZGVzaWduU2VsZWN0LnZhbHVlXTtcbiAgc3RhdHVzLm1lYXN1cmVtZW50cyA9IHN0YXR1cy5kZXNpZ24ubWVhc3VyZW1lbnRzO1xuICBzdGF0dXMuc3RlcHNfZnVuY3Rpb25zID0gc3RhdHVzLmRlc2lnbi5zdGVwcztcbiAgbWVhc3VyZW1lbnRzTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgc3RlcHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICBpbnB1dERlc2lnbihzdGF0dXMuZGVzaWduKTtcbiAgaW5wdXRNZWFzdXJlbWVudHMoc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHMpO1xuICBzdGF0dXMgPSBtYWtlUGF0dGVybihzdGF0dXMpO1xuICBpbnB1dFN0ZXBzKHN0YXR1cy5wYXR0ZXJuLnN0ZXBzKTtcbiAgZHJhd1BhdHRlcm4oc3RhdHVzKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVPLFNBQVMsa0JBQWtCQSxTQUFRLFFBQU87QUFDL0MsUUFBTSxZQUFZQSxRQUFPO0FBQ3pCLFNBQU8sS0FBSyxNQUFNLFNBQVMsU0FBUztBQUN0QztBQUVPLFNBQVMsU0FBUyxHQUFHLEdBQUcsUUFBTztBQUNwQyxNQUFJLFlBQVksRUFBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFHLE1BQUs7QUFDdkQsTUFBSSxXQUFXLFFBQVU7QUFDdkIsYUFBUztBQUFBLEVBQ1gsT0FBTztBQUNMLGFBQVMsRUFBQyxHQUFHLFdBQVcsR0FBRyxPQUFNO0FBQUEsRUFDbkM7QUFDQSxNQUFJLFFBQVEsRUFBQyxHQUFNLEdBQU0sT0FBYztBQUN2QyxTQUFPO0FBQ1Q7QUFFTyxTQUFTLFFBQVFBLFNBQVEsT0FBTyxLQUFLLFFBQVEsU0FB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LE1BQU07QUFDM0IsV0FBVyxPQUFPLFFBQVEsS0FBSztBQUMvQixZQUFZLE1BQU07QUFFbEIsU0FBUyx1QkFBdUIsT0FBTyxPQUFPO0FBQzVDLFlBQVUsWUFBWTtBQUN0QixTQUFPLGFBQWEsTUFBTSxFQUFFLEVBQUUsUUFBUSxXQUFXLEtBQUs7QUFDdEQsV0FBUyxZQUFZLE1BQU07QUFDM0IsYUFBVyxPQUFPLFFBQVEsS0FBSztBQUMvQixjQUFZLE1BQU07QUFDcEI7QUFFQSxhQUFhLGlCQUFpQixVQUFVLFdBQVc7QUFDakQsU0FBTyxTQUFTLFFBQVEsYUFBYSxLQUFLO0FBQzFDLFNBQU8sZUFBZSxPQUFPLE9BQU87QUFDcEMsU0FBTyxrQkFBa0IsT0FBTyxPQUFPO0FBQ3ZDLG1CQUFpQixZQUFZO0FBQzdCLFlBQVUsWUFBWTtBQUN0QixjQUFZLE9BQU8sTUFBTTtBQUN6QixvQkFBa0IsT0FBTyxPQUFPLFlBQVk7QUFDNUMsV0FBUyxZQUFZLE1BQU07QUFDM0IsYUFBVyxPQUFPLFFBQVEsS0FBSztBQUMvQixjQUFZLE1BQU07QUFDcEIsQ0FBQzsiLAogICJuYW1lcyI6IFsic3RhdHVzIiwgInN0ZXBzIiwgInN0YXR1cyIsICJzdGF0dXMiLCAic3RhdHVzIiwgIm1lYXN1cmVtZW50cyIsICJzdGVwcyIsICJzdGVwc0xpc3QiXQp9Cg==
