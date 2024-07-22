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
  status2 = setPoint(x, y, guides);
  return status2;
}
function setPointLineX(status2, point1, point2, x, guides) {
  let x1 = point1.x;
  let y1 = point1.y;
  let x2 = point2.x;
  let y2 = point2.y;
  let y = Math.round(y1 + (y2 - y1) * (x - x1) / (x2 - x1));
  status2 = setPoint(x, y, guides);
  return status2;
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
      status2.pattern.points["B"] = setPoint(0, inchesToPrecision(status2, parseFloat(status2.design.measurements.backLength.value)), { l: true });
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
      return `Point 00 is the same distance as Z to X, left of K, and halfway between Z and K up from K`;
    },
    action: (status2) => {
      const pointZ = status2.pattern.points["Z"];
      const pointX = status2.pattern.points["X"];
      const pointK = status2.pattern.points["K"];
      const a = Math.abs(pointZ.x - pointX.x);
      const b = Math.abs(pointZ.y - pointX.y);
      const c = a * a + b * b;
      const xdistance = Math.sqrt(c);
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
      status2 = setCurve(status2, "14", "00", 4);
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
      const dist = parseFloat(status2.measurements.lengthOfFront.value) * status2.precision;
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
      return `True up the other side of the dart from V to 4 to find a`;
    },
    action: (status2) => {
      let distbV = distABC(status2, "b", "5", "V");
      const pointV = status2.pattern.points["V"];
      const point4 = status2.pattern.points["4"];
      const disty = distbV - distPointToPoint(pointV, point4);
      const y = point4.y + disty;
      status2.pattern.points["a"] = setPoint(point4.x, y);
      status2 = setLine(status2, "4", "a");
      status2 = setLine(status2, "M1", "a");
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
      return `Point 15 is 3/8 of the blade measure left of A1 and 1/2 inch below V`;
    },
    action: (status2) => {
      const blade = parseFloat(status2.measurements.blade.value);
      const pointA1 = status2.pattern.points["A1"];
      const pointV = status2.pattern.points["V"];
      status2.pattern.points["15"] = setPoint(pointA1.x - inchesToPrecision(status2, blade * 3 / 8), pointV.y + inchesToPrecision(status2, 0.5));
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
function findPointE(status2, pointJ, pointP) {
  const pointj = setPoint(pointJ.x - 1 * status2.precision, pointJ.y);
  const frontLength = parseFloat(status2.design.measurements.frontLength.value) * status2.precision;
  const wtb2 = Math.abs(parseFloat(status2.design.measurements.breast.value) / 12 * status2.precision);
  const a = Math.abs(pointP.x - pointj.x);
  const c = frontLength - wtb2;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGF0dGVybi5qcyIsICIuLi9kZXNpZ25zL2tleXN0b25lX3NpbmdsZS1icmVhc3RlZC12ZXN0LmpzIiwgIi4uL2Rlc2lnbnMvZGVzaWduX2xpc3QuanMiLCAiLi4vcGl4ZWxzLmpzIiwgIi4uL2RyYXdpbmcuanMiLCAiLi4vZGlzcGxheS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy90dXJuIGRlc2lnbiBpbnRvIHBhdHRlcm5cblxuZXhwb3J0IGZ1bmN0aW9uIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgaW5jaGVzKXtcbiAgY29uc3QgcHJlY2lzaW9uID0gc3RhdHVzLnByZWNpc2lvbjtcbiAgcmV0dXJuIE1hdGgucm91bmQoaW5jaGVzICogcHJlY2lzaW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFBvaW50KHgsIHksIGd1aWRlcyl7XG4gIGxldCB0ZW1wR3VpZGUgPSB7dTogZmFsc2UsIGQ6IGZhbHNlLCBsOiBmYWxzZSwgcjogZmFsc2V9O1xuICBpZiAoZ3VpZGVzID09PSB1bmRlZmluZWQpe1xuICAgIGd1aWRlcyA9IHRlbXBHdWlkZTtcbiAgfSBlbHNlIHtcbiAgICBndWlkZXMgPSB7Li4udGVtcEd1aWRlLCAuLi5ndWlkZXN9O1xuICB9XG4gIGxldCBwb2ludCA9IHt4OiB4LCB5OiB5LCBndWlkZXM6IGd1aWRlc307XG4gIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldExpbmUoc3RhdHVzLCBzdGFydCwgZW5kLCBzdHlsZSA9ICdzb2xpZCcsIGxlbmd0aCA9ICdkZWZpbmVkJyl7XG4gIGxldCBsaW5lID0ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IGVuZCxcbiAgICBzdHlsZTogc3R5bGUsXG4gICAgbGVuZ3RoOiBsZW5ndGggLy9laXRoZXIgZGVmaW5lZCBvciBjb250aW51ZWQgKGV4dGVuZGluZyBwYXN0IGVuZCBwb2ludClcbiAgfTtcbiAgc3RhdHVzLnBhdHRlcm4ubGluZXMucHVzaChsaW5lKTtcblxuICByZXR1cm4gc3RhdHVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9pbnRMaW5lWShzdGF0dXMsIHBvaW50MSwgcG9pbnQyLCB5LCBndWlkZXMpe1xuICAvL2ZpbmQgeCB2YWx1ZSB3aGVyZSBsaW5lIGJldHdlZW4gcG9pbnQxIGFuZCBwb2ludDIgY3Jvc3NlcyB5XG5cbiAgbGV0IHgxID0gcG9pbnQxLng7XG4gIGxldCB5MSA9IHBvaW50MS55O1xuICBsZXQgeDIgPSBwb2ludDIueDtcbiAgbGV0IHkyID0gcG9pbnQyLnk7XG5cbiAgbGV0IHggPSBNYXRoLnJvdW5kKHgxICsgKHgyIC0geDEpICogKHkgLSB5MSkgLyAoeTIgLSB5MSkpO1xuICBzdGF0dXMgPSBzZXRQb2ludCh4LCB5LCBndWlkZXMpO1xuXG4gIHJldHVybiBzdGF0dXM7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0UG9pbnRMaW5lWChzdGF0dXMsIHBvaW50MSwgcG9pbnQyLCB4LCBndWlkZXMpe1xuICAvL2ZpbmQgeCB2YWx1ZSB3aGVyZSBsaW5lIGJldHdlZW4gcG9pbnQxIGFuZCBwb2ludDIgY3Jvc3NlcyB5XG4gIGxldCB4MSA9IHBvaW50MS54O1xuICBsZXQgeTEgPSBwb2ludDEueTtcbiAgbGV0IHgyID0gcG9pbnQyLng7XG4gIGxldCB5MiA9IHBvaW50Mi55O1xuXG4gIGxldCB5ID0gTWF0aC5yb3VuZCh5MSArICh5MiAtIHkxKSAqICh4IC0geDEpIC8gKHgyIC0geDEpKTtcbiAgc3RhdHVzID0gc2V0UG9pbnQoeCwgeSwgZ3VpZGVzKTtcblxuICByZXR1cm4gc3RhdHVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9pbnRBbG9uZ0xpbmUoc3RhdHVzLCBwb2ludDEsIHBvaW50MiwgdG8zaW5JbmNoZXMsIGd1aWRlcyl7XG4gIC8vZmluZCBwb2ludCBkaXN0YW5jZSBmcm9tIHBvaW50MSBhbG9uZyBsaW5lIHRvIHBvaW50MlxuICBsZXQgeDEgPSBwb2ludDEueDtcbiAgbGV0IHkxID0gcG9pbnQxLnk7XG4gIGxldCB4MiA9IHBvaW50Mi54O1xuICBsZXQgeTIgPSBwb2ludDIueTtcbiAgLy9kaXN0YW5jZSBpcyBleHBlY3RlZCB0byBiZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIGRpc3RhbmNlIGJldHdlZW4gcG9pbnQxIGFuZCBwb2ludDJcbiAgbGV0IGRpc3QxdG8yID0gTWF0aC5zcXJ0KCh4MiAtIHgxKSAqICh4MiAtIHgxKSArICh5MiAtIHkxKSAqICh5MiAtIHkxKSk7XG4gIGxldCBkaXN0YW5jZSA9ICh0bzNpbkluY2hlcyAqIHN0YXR1cy5wcmVjaXNpb24gKSAvIGRpc3QxdG8yO1xuICAvL2xldCBkaXN0YW5jZSA9IHRvM2luSW5jaGVzICogc3RhdHVzLnByZWNpc2lvbjtcblxuICBsZXQgeCA9IE1hdGgucm91bmQoeDEgKyAoeDIgLSB4MSkgKiBkaXN0YW5jZSk7XG4gIGxldCB5ID0gTWF0aC5yb3VuZCh5MSArICh5MiAtIHkxKSAqIGRpc3RhbmNlKTtcbiAgc3RhdHVzID0gc2V0UG9pbnQoeCwgeSwgZ3VpZGVzKTtcblxuICByZXR1cm4gc3RhdHVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UG9pbnRMaW5lQ2lyY2xlKHN0YXR1cywgcG9pbnQxLCBwb2ludDIsIGNlbnRlciwgcmFkaXVzKXtcbiAgLy9maXJzdCwgZmluZCB0aGUgc2xvcGUgb2YgdGhlIGxpbmUgYmV0d2VlbiBwb2ludDEgYW5kIHBvaW50MlxuICBsZXQgeDEgPSBwb2ludDEueDtcbiAgbGV0IHkxID0gcG9pbnQxLnk7XG4gIGxldCB4MiA9IHBvaW50Mi54O1xuICBsZXQgeTIgPSBwb2ludDIueTtcbiAgbGV0IG0gPSAoeTIgLSB5MSkgLyAoeDIgLSB4MSk7XG4gIC8vdGhlbiwgZmluZCB0aGUgaW50ZXJjZXB0XG4gIGxldCBiID0geTEgLSBtICogeDE7XG5cbiAgLy90aGVuLCBmaW5kIHRoZSBlcXVhdGlvbiBvZiB0aGUgY2lyY2xlXG4gIGxldCBrID0gY2VudGVyLng7XG4gIGxldCBoID0gY2VudGVyLnk7XG5cbiAgLy9lcXVhdGlvbiBvZiBjaXJjbGUgaXMgKHgtaCleMiArICh5LWspXjIgPSByXjJcbiAgLy93aGVyZSBoIGFuZCBrIGFyZSB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGUsIGFuZCByIGlzIHRoZSByYWRpdXNcbiAgLy9zdWJzdGl0dXRlIHkgPSBteCArIGIgaW50byB0aGUgY2lyY2xlIGVxdWF0aW9uXG5cbiAgbGV0IGEgPSAxICsgbSAqIG07XG4gIGxldCBiMiA9IDIgKiAobSAqIChiIC0gaCkgLSBrKTtcbiAgbGV0IGMgPSBrICogayArIChiIC0gaCkgKiAoYiAtIGgpIC0gcmFkaXVzICogcmFkaXVzO1xuXG4gIC8vc29sdmUgZm9yIHhcbiAgbGV0IHggPSAoLWIyIC0gTWF0aC5zcXJ0KGIyICogYjIgLSA0ICogYSAqIGMpKSAvICgyICogYSk7XG4gIGxldCB5ID0gbSAqIHggKyBiO1xuICBzdGF0dXMgPSBzZXRQb2ludCh4LCB5KTtcbiAgLy90aGVyZSBtYXkgYmUgdHdvIHNvbHV0aW9ucywgYnV0IHdlJ2xsIGp1c3QgdXNlIHRoZSBmaXJzdCBvbmUgZm9yIG5vd1xuXG4gIHJldHVybiBzdGF0dXM7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnZlKHN0YXR1cywgc3RhcnRQb2ludCwgZW5kUG9pbnQsIHF1YXJ0ZXIgKXtcbiAgLy9xdWFydGVyIDEsIDIsIDMsIG9yIDQsIGNsb2Nrd2lzZSBmcm9tIDEyIG8nY2xvY2sgKHNvIDEgaXMgdG9wIHJpZ2h0LCAyIGlzIGJvdHRvbSByaWdodCwgMyBpcyBib3R0b20gbGVmdCwgNCBpcyB0b3AgbGVmdClcbiAgbGV0IGN1cnZlID0ge1xuICAgIHN0YXJ0OiBzdGFydFBvaW50LFxuICAgIGVuZDogZW5kUG9pbnQsXG4gICAgcXVhcnRlcjogcXVhcnRlclxuICB9O1xuICBzdGF0dXMucGF0dGVybi5jdXJ2ZXMucHVzaChjdXJ2ZSk7XG4gIHJldHVybiBzdGF0dXM7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcmltZXRlckVsbGlwc2UoX3N0YXR1cywgY2VudGVyLCBwb2ludDEsIHBvaW50Mil7XG4gIC8vY2FsY3VsYXRlcyAxLzQgb2YgdGhlIGVsbGlwc2UgY2lyY3VtZmVyZW5jZSwgYmFzZWQgb24gdGhlIHF1YXJ0ZXJcbiAgLy9xdWFydGVyIDEsIDIsIDMsIG9yIDQsIGNsb2Nrd2lzZSBmcm9tIDEyIG8nY2xvY2sgKHNvIDEgaXMgdG9wIHJpZ2h0LCAyIGlzIGJvdHRvbSByaWdodCwgMyBpcyBib3R0b20gbGVmdCwgNCBpcyB0b3AgbGVmdClcbiAgLy9jYWxjdWxhdGUgY2VudGVyIGZyb20gc3RhcnQsIGVuZCwgYW5kIHF1YXJ0ZXJcbiAgLy9maW5kIHNlbWkgbWFqb3IgYW5kIHNlbWkgbWlub3IgYXhlcywgbm90IHN1cmUgaWYgcG9pbnQxIG9yIHBvaW50MiBpcyBsYXJnZXJcbiAgbGV0IGRpc3QxID0gTWF0aC5hYnMoKGNlbnRlci54IC0gcG9pbnQxLngpKSArIE1hdGguYWJzKChjZW50ZXIueSAtIHBvaW50MS55KSk7XG4gIGxldCBkaXN0MiA9IE1hdGguYWJzKChjZW50ZXIueCAtIHBvaW50Mi54KSkgKyBNYXRoLmFicygoY2VudGVyLnkgLSBwb2ludDIueSkpO1xuICAvL2EgaXMgc2VtaS1tYWpvciwgdGhlIGxhcmdlciBkaXN0YW5jZVxuICAvL2IgaXMgc2VtaS1taW5vciwgdGhlIHNtYWxsZXIgZGlzdGFuY2VcbiAgbGV0IGEgPSAwO1xuICBsZXQgYiA9IDA7XG4gIGlmIChkaXN0MSA+IGRpc3QyKXsgXG4gICAgYSA9IGRpc3QxO1xuICAgIGIgPSBkaXN0MjtcbiAgfSBlbHNlIHtcbiAgICBhID0gZGlzdDI7XG4gICAgYiA9IGRpc3QxO1xuICB9XG4gIC8vaCBpcyB0aGUgZWNjZW50cmljaXR5XG4gIGxldCBoID0gTWF0aC5hYnMoYSAtIGIpICogKGEgLSBiKSAvIChNYXRoLmFicyhhICsgYikgKiAoYSArIGIpKTtcbiAgbGV0IHBlcmltZXRlciA9IE1hdGguUEkgKiAoYSArIGIpICogKDEgKyAzICogaCAvICgxMCArIE1hdGguc3FydCg0IC0gMyAqIGgpKSk7XG4gIHJldHVybiBwZXJpbWV0ZXI7XG4gIC8vcmV0dXJuIDEwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RQb2ludFRvUG9pbnQocG9pbnQxLCBwb2ludDIpe1xuICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnNxcnQoKHBvaW50MS54IC0gcG9pbnQyLngpICogKHBvaW50MS54IC0gcG9pbnQyLngpICsgKHBvaW50MS55IC0gcG9pbnQyLnkpICogKHBvaW50MS55IC0gcG9pbnQyLnkpKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0QUJDKHN0YXR1cywgcG9pbnRhLCBwb2ludGIsIHBvaW50Yyl7XG4gIGNvbnN0IGEgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbcG9pbnRhXTtcbiAgY29uc3QgYiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1twb2ludGJdO1xuICBjb25zdCBjID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzW3BvaW50Y107XG5cblxuICByZXR1cm4gTWF0aC5hYnMoZGlzdFBvaW50VG9Qb2ludChhLCBiKSArIGRpc3RQb2ludFRvUG9pbnQoYiwgYykpO1xufVxuLy9jb252ZXJ0IG51bWJlcnMgdG8gcHJpbnRhYmxlIHN0cmluZ3NcblxuZnVuY3Rpb24gZm9ybWF0RnJhY3Rpb24obnVtSW5wdXQpe1xuICAvL251bSBjYW4gYmUgYSBzdHJpbmcgb3IgYSBudW1iZXJcbiAgbGV0IG51bSA9IHBhcnNlRmxvYXQobnVtSW5wdXQpO1xuICAvL3JldHVybiBhIHdob2xlIG51bWJlciBhbmQvb3IgYSBmcmFjdGlvbiwgdXNpbmcgaGFsdmVzLCBxdWFydGVycywgb3IgZWlnaHRoc1xuICBsZXQgd2hvbGUgPSBNYXRoLmZsb29yKG51bSk7XG4gIGxldCBmcmFjdGlvbiA9IG51bSAtIHdob2xlO1xuICBsZXQgZnJhY3Rpb25TdHJpbmcgPSAnJztcbiAgY29uc3QgZnJhY3Rpb25zID0ge1xuICAgICcxLzgnOiAwLjEyNSxcbiAgICAnMS80JzogMC4yNSxcbiAgICAnMy84JzogMC4zNzUsXG4gICAgJzEvMic6IDAuNSxcbiAgICAnNS84JzogMC42MjUsXG4gICAgJzMvNCc6IDAuNzUsXG4gICAgJzcvOCc6IDAuODc1XG4gIH1cblxuICBpZiAoZnJhY3Rpb24gIT09IDApe1xuICAgIGxldCBiZXN0RnJhY3Rpb24gPSAnMS84JztcbiAgICBmb3IgKGxldCBrZXkgaW4gZnJhY3Rpb25zKXtcbiAgICAgIGlmIChNYXRoLmFicyhmcmFjdGlvbiAtIGZyYWN0aW9uc1trZXldKSA8IE1hdGguYWJzKGZyYWN0aW9uIC0gZnJhY3Rpb25zW2Jlc3RGcmFjdGlvbl0pKXtcbiAgICAgICAgYmVzdEZyYWN0aW9uID0ga2V5O1xuICAgICAgfVxuICAgIH1cbiAgICBmcmFjdGlvblN0cmluZyA9IGJlc3RGcmFjdGlvbjtcbiAgfVxuICBpZiAod2hvbGUgPT09IDApe1xuICAgIHJldHVybiBmcmFjdGlvblN0cmluZztcbiAgfSBlbHNlIGlmIChmcmFjdGlvblN0cmluZyA9PT0gJycpe1xuICAgIHJldHVybiBgJHt3aG9sZX1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgJHt3aG9sZX0gJHtmcmFjdGlvblN0cmluZ31gO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmludE1lYXN1cmUobWVhc3VyZSwgbWF0aCA9IDEpe1xuICByZXR1cm4gcHJpbnROdW0obWVhc3VyZS52YWx1ZSwgbWF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmludE51bShudW0sIG1hdGggPSAxKXtcbiAgcmV0dXJuIGAoJHtmb3JtYXRGcmFjdGlvbihudW0gKiBtYXRoKX0gaW4uKWA7XG59XG5cbi8vY3JlYXRlIHNoYXBlcyBmb3IgcGF0dGVybiBiYXNlZCBvbiBzdGVwcyBhY3Rpb25zXG5mdW5jdGlvbiBjcmVhdGVTaGFwZXMoc3RhdHVzKXtcbiAgbGV0IHN0ZXBGdW5jcyA9IHN0YXR1cy5kZXNpZ24uc3RlcHM7XG5cbiAgc3RlcEZ1bmNzLmZvckVhY2goc3RlcCA9PiB7XG4gICAgbGV0IGFjdGlvbiA9IHN0ZXAuYWN0aW9uO1xuICAgIHN0YXR1cyA9IGFjdGlvbihzdGF0dXMpO1xuICB9KTtcblxuICByZXR1cm4gc3RhdHVzO1xufVxuXG4vL3R1cm4gc3RlcHNfZnVuY3Rpb25zIGludG8gc3RlcHMgc3RyaW5ncywgcG9wdWxhdGVkIHdpdGggdGhlIG5lY2Vzc2FyeSBudW1iZXJzXG5mdW5jdGlvbiB3cml0ZVN0ZXBzKHN0YXR1cyl7XG4gIGxldCBzdGVwcyA9IFtdO1xuICBzdGF0dXMuZGVzaWduLnN0ZXBzLmZvckVhY2goc3RlcCA9PiB7XG4gICAgbGV0IGRlc2NyaXB0aW9uID0gc3RlcC5kZXNjcmlwdGlvbihzdGF0dXMpO1xuICAgIHN0ZXBzLnB1c2goZGVzY3JpcHRpb24pO1xuICB9KTtcbiAgc3RhdHVzLnBhdHRlcm4uc3RlcHMgPSBzdGVwcztcbiAgcmV0dXJuIHN0YXR1cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VQYXR0ZXJuKHN0YXR1cyl7XG4gIC8vbG9vcCB0aHJvdWdoIGRlc2lnbidzIHN0ZXBzIGZ1bmN0aW9ucywgcGFzc2luZyBtZWFzdXJlbWVudHMgdG8gZWFjaFxuICAvL2NyZWF0ZSBwYXR0ZXJuLCB3aXRoIHN0ZXBzLCBwb2ludHMsIGxpbmVzLCBhbmQgY3VydmVzXG4gIHN0YXR1cy5wYXR0ZXJuID0ge1xuICAgIHBvaW50czoge30sXG4gICAgbGluZXM6IFtdLFxuICAgIGN1cnZlczogW10sXG4gICAgc3RlcHM6IFtdXG4gIH07XG4gIHN0YXR1cyA9IHdyaXRlU3RlcHMoc3RhdHVzKTtcbiAgc3RhdHVzID0gY3JlYXRlU2hhcGVzKHN0YXR1cyk7IC8vcnVucyB0aHJvdWdoIHN0ZXBzLmF0aW9ucywgcG9wdWxhdGluZyBwb2ludHMsIGxpbmVzLCBhbmQgY3VydmVzXG5cbiAgcmV0dXJuIHN0YXR1cztcbn1cblxuXG4iLCAiaW1wb3J0IHtcbiAgaW5jaGVzVG9QcmVjaXNpb24sXG4gIHNldFBvaW50LFxuICBzZXRMaW5lLFxuICBzZXRQb2ludExpbmVZLFxuICBzZXRQb2ludExpbmVYLFxuICBzZXRQb2ludEFsb25nTGluZSxcbiAgc2V0UG9pbnRMaW5lQ2lyY2xlLFxuICBzZXRDdXJ2ZSxcbiAgZGlzdFBvaW50VG9Qb2ludCxcbiAgZGlzdEFCQyxcbiAgcHJpbnROdW0sXG4gIHByaW50TWVhc3VyZSxcbiAgcGVyaW1ldGVyRWxsaXBzZVxufSBmcm9tICcuLi9wYXR0ZXJuLmpzJztcblxuY29uc3QgZGVzaWduX2luZm8gPSB7XG4gIHRpdGxlOiAnS2V5c3RvbmUgLSBTaW5nbGUgQnJlYXN0ZWQgVmVzdCcsXG4gIHNvdXJjZToge1xuICAgIGxpbms6ICdodHRwczovL2FyY2hpdmUub3JnL2RldGFpbHMva2V5c3RvbmVqYWNrZXRkcjAwaGVjay9wYWdlLzY2L21vZGUvMnVwJyxcbiAgICBsYWJlbDogJ1RoZSBLZXlzdG9uZSBKYWNrZXQgYW5kIERyZXNzIEN1dHRlciAocGcgNjYpJ1xuICB9LFxuICBkZXNpZ25lcjogJ0NoYXJsZXMgSGVja2xpbmdlcidcbn1cblxubGV0IG1lYXN1cmVtZW50cyA9IHtcbiAgYmFja0xlbmd0aDoge2xhYmVsOiBcIkJhY2sgTGVuZ3RoXCIsIHZhbHVlOiAxNX0sXG4gIGZyb250TGVuZ3RoOiB7bGFiZWw6IFwiRnJvbnQgTGVuZ3RoXCIsIHZhbHVlOiAxOC4yNX0sXG4gIGJsYWRlOiB7bGFiZWw6IFwiQmxhZGVcIiwgdmFsdWU6IDEwfSxcbiAgaGVpZ2h0VW5kZXJBcm06IHtsYWJlbDogXCJIZWlnaHQgVW5kZXIgQXJtXCIsIHZhbHVlOiA3LjV9LFxuICBicmVhc3Q6IHtsYWJlbDogXCJCcmVhc3RcIiwgdmFsdWU6IDM2fSxcbiAgd2Fpc3Q6IHtsYWJlbDogXCJXYWlzdFwiLCB2YWx1ZTogMjV9LFxuICBsZW5ndGhPZkZyb250OiB7bGFiZWw6IFwiTGVuZ3RoIG9mIEZyb250XCIsIHZhbHVlOiAyM30sXG4gIHNob3VsZGVyOiB7bGFiZWw6IFwiRGVzaXJlZCBTaG91bGRlciBDaGFuZ2VcIiwgdmFsdWU6IDF9LFxuICBuZWNrbGluZToge2xhYmVsOiBcIk5lY2tsaW5lXCIsIHZhbHVlOiAxMH1cbn07XG5cbi8vYWxsIGRpc3RhbmNlcyBhcmUgaW4gaW5jaGVzICogcHJlY2lzaW9uXG4vLyBzdGFydGluZyBwb2ludCAoaW4gdGhpcyBjYXNlICdPJykgaXMgYWx3YXlzIDAsMC4gQWxsIG90aGVyIHBvaW50cyBhcmUgZGVmaW5lZCBpbiByZWxhdGlvbiB0byB0aGlzIHBvaW50LiBOZWdhdGl2ZXMgYXJlIGV4cGVjdGVkXG5cbmNvbnN0IHN0ZXBzID0gW1xuICB7XG4gICAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gJ1NldCBwb2ludCBPIGluIHVwcGVyIHJpZ2h0IG9mIGNhbnZhcyd9LFxuICAgICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydPJ10gPSBzZXRQb2ludCgwLCAwLHsgZDogdHJ1ZSwgbDogdHJ1ZSB9KTtcbiAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuICB9LFxuICB7XG4gICAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gJ1BvaW50IDEgaXMgMy80IGluY2ggZG93biBmcm9tIE8nfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMSddID0gc2V0UG9pbnQoMCwgaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCAzLzQpKTtcbiAgICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuICB9LFxuICB7XG4gICAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgRnJvbSBwb2ludCAxLCBnbyBkb3duIHRoZSBiYWNrIGxlbmd0aCAke3ByaW50TWVhc3VyZShzdGF0dXMuZGVzaWduLm1lYXN1cmVtZW50cy5iYWNrTGVuZ3RoKX0gdG8gZGVmaW5lIHBvaW50IEJgfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQiddID0gc2V0UG9pbnQoMCwgaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBwYXJzZUZsb2F0KHN0YXR1cy5kZXNpZ24ubWVhc3VyZW1lbnRzLmJhY2tMZW5ndGgudmFsdWUpKSwgeyBsOiB0cnVlIH0pO1xuICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gIH0sXG4gIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBGcm9tIHBvaW50IEIsIGdvIHVwIHRoZSBoZWlnaHQgdW5kZXIgYXJtICR7cHJpbnRNZWFzdXJlKHN0YXR1cy5tZWFzdXJlbWVudHMuaGVpZ2h0VW5kZXJBcm0pfSB0byBkZWZpbmUgcG9pbnQgQWB9LFxuICAgICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgICAgbGV0IHBvaW50QiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQiddO1xuICAgICAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQSddID0gc2V0UG9pbnQoMCwgcG9pbnRCLnkgLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5oZWlnaHRVbmRlckFybS52YWx1ZSkpLCB7IGw6IHRydWUgfSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgfSxcbiAge1xuICAgICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYEIgdG8gRCBpcyAxLzI0IGJyZWFzdCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdCwgMS8yNCl9IHRvIHRoZSBsZWZ0IG9mIEJgfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIGxldCBwb2ludEIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0InXTtcbiAgICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0QnXSA9IHNldFBvaW50KHBvaW50Qi54IC0gaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDI0KSwgcG9pbnRCLnkpO1xuICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gIH0sXG4gIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiAnRHJhdyBiYWNrIGxpbmUgZnJvbSAxIHRvIEQnfSxcbiAgICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnMScsICdEJyk7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgfSxcbiAge1xuICAgICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuICdQb2ludCBBMSBpcyB3aGVyZSB0aGUgbGluZSAxLUQgY3Jvc3NlcyBsaW5lIGV4dGVuZGluZyBsZWZ0IGZyb20gQSd9LFxuICAgICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICAgICAgbGV0IHBvaW50MSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMSddO1xuICAgICAgICAgIGxldCBwb2ludEEgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0EnXTtcbiAgICAgICAgICBsZXQgcG9pbnREID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEJ107XG4gICAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydBMSddID0gc2V0UG9pbnRMaW5lWShzdGF0dXMsIHBvaW50MSwgcG9pbnRELCBwb2ludEEueSk7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBLIGlzIHRoZSBibGFkZSBtZWFzdXJlICR7cHJpbnRNZWFzdXJlKHN0YXR1cy5tZWFzdXJlbWVudHMuYmxhZGUpfSBsZWZ0IGZyb20gQTFgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgYmxhZGUgPSBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYmxhZGUudmFsdWUpO1xuICAgICAgICBjb25zdCBwb2ludEExID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydBMSddO1xuICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0snXSA9IHNldFBvaW50KHBvaW50QTEueCAtIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgYmxhZGUpLCBwb2ludEExLnksIHt1OiB0cnVlLCBkOiB0cnVlfSk7XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEwgaXMgMy84IG9mIHRoZSBibGFkZSBtZWFzdXJlICR7cHJpbnRNZWFzdXJlKHN0YXR1cy5tZWFzdXJlbWVudHMuYmxhZGUsIDMvOCl9IHJpZ2h0IG9mIEtgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgYmxhZGUgPSBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYmxhZGUudmFsdWUpO1xuICAgICAgICBjb25zdCBwb2ludEsgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0snXTtcbiAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydMJ10gPSBzZXRQb2ludChwb2ludEsueCArIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgYmxhZGUgKiAzLzgpLCBwb2ludEsueSwge3U6IHRydWUsIGQ6IHRydWV9KTtcbiAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEogaXMgYXQgdGhlIGludGVyc2VjdGlvbiBvZiB0aGUgbGluZSBkb3duIGZyb20gSyBhbmQgdGhlIGxpbmUgbGVmdCBmcm9tIEJgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgcG9pbnRLID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydLJ107XG4gICAgICAgIGNvbnN0IHBvaW50QiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQiddO1xuICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0onXSA9IHNldFBvaW50KHBvaW50Sy54LCBwb2ludEIueSk7XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IDIgaXMgMy8xNiBvZiB0aGUgYmxhZGUgbWVhc3VyZSAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLCAzLzE2KX0gbGVmdCBmcm9tIE9gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgYmxhZGUgPSBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYmxhZGUudmFsdWUpO1xuICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzInXSA9IHNldFBvaW50KDAgLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIGJsYWRlICogMy8xNiksIDApO1xuICAgICAgICAvL2RyYXcgY3VydmUgZnJvbSAyIHRvIDEsIGNlbnRlcmVkIGFyb3VuZCBPXG4gICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgc3RhdHVzID0gc2V0Q3VydmUoc3RhdHVzLCAnMScsICcyJywgMyk7XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7IFxuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgRyBpcyAxLzIgdGhlIGJyZWFzdCBtZWFzdXJlICR7cHJpbnRNZWFzdXJlKF9zdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdCwgMS8yKX0gdG8gdGhlIGxlZnQgb2YgQTFgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgcG9pbnRBMSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snQTEnXTtcbiAgICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydHJ10gPSBzZXRQb2ludChwb2ludEExLnggLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QudmFsdWUpIC8gMiksIHBvaW50QTEueSk7XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBQIGlzIGhhbGZ3YXkgYmV0d2VlbiBwb2ludHMgRyBhbmQgSy4gRHJhdyBndWlkZSB1cCBmcm9tIFBgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgcG9pbnRHID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydHJ107XG4gICAgICAgIGNvbnN0IHBvaW50SyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snSyddO1xuICAgICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1AnXSA9IHNldFBvaW50KChwb2ludEcueCArIHBvaW50Sy54KSAvIDIsIHBvaW50Ry55LCB7dTogdHJ1ZX0pO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge1xuICAgICAgcmV0dXJuIGBQb2ludCBFIGlzIGZvdW5kIGJ5IGdvaW5nIHVwIHRoZSBmcm9udCBsZW5ndGggLSB0aGUgd2lkdGggb2YgdG9wIG9mIGJhY2sgZnJvbSAxIGluY2ggdG8gdGhlIGxlZnQgb2YgSiB1cCB0byBtZWV0IHRoZSBsaW5lIHVwIGZyb20gUC4gRSBtYXkgYmUgYWJvdmUgb3IgYmVsb3cgdGhlIHRvcCBsaW5lLmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRKID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydKJ107XG4gICAgICBjb25zdCBwb2ludFAgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1AnXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRSddID0gZmluZFBvaW50RShzdGF0dXMsIHBvaW50SiwgcG9pbnRQKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEYgaXMgMS8xMiBicmVhc3QgJHtwcmludE1lYXN1cmUoc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QsIDEvMTIpfSB0byB0aGUgbGVmdCBvZiBFYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0UnXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRiddID0gc2V0UG9pbnQocG9pbnRFLnggLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5icmVhc3QudmFsdWUpIC8gMTIpLCBwb2ludEUueSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgRHJhdyBsaW5lIGZyb20gRiB0aHJvdWdoIEcsIGV4dGVuZGluZyBiZWxvdyB0aGUgd2Fpc3QgbGluZWB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdGJywgJ0cnLCAnZGFzaGVkJywgJ2NvbnRpbnVlZCcpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHsgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgTiBpcyBvbiB0aGlzIGxpbmUgZnJvbSBGIHRvIEcsIDEvMTIgb2YgdGhlIGJyZWFzdCBkb3duIGZyb20gRmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRGID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydGJ107XG4gICAgICBjb25zdCBwb2ludEcgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0cnXTtcbiAgICAgIGNvbnN0IGRpc3QgPSBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDEyO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydOJ10gPSBzZXRQb2ludEFsb25nTGluZShzdGF0dXMsIHBvaW50RiwgcG9pbnRHLCBkaXN0KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IFkgaXMgMy80ICR7cHJpbnROdW0oZGlzdE90b0Eoc3RhdHVzKSAqIDMvNCl9IG9mIHRoZSB3YXkgdXAgZnJvbSBMIHRvIHRoZSBsaW5lIGZyb20gT2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRMID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydMJ107XG4gICAgICBjb25zdCBwb2ludE8gPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ08nXTtcbiAgICAgIGNvbnN0IHggPSBwb2ludEwueDtcbiAgICAgIGNvbnN0IHkgPSBwb2ludE8ueSArIChwb2ludEwueSAtIHBvaW50Ty55KSAqIDEvNDtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWSddID0gc2V0UG9pbnQoeCwgeSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBaIGlzIDUvOCAke3ByaW50TnVtKGRpc3RPdG9BKHN0YXR1cykgKiA1LzgpfSBvZiB0aGUgd2F5IHVwIGZyb20gTCB0byB0aGUgbGluZSBmcm9tIE9gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50TCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTCddO1xuICAgICAgY29uc3QgcG9pbnRPID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydPJ107XG4gICAgICBjb25zdCB4ID0gcG9pbnRMLng7XG4gICAgICBjb25zdCB5ID0gcG9pbnRPLnkgKyAocG9pbnRMLnkgLSBwb2ludE8ueSkgKiAzLzg7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1onXSA9IHNldFBvaW50KHgsIHkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgOSBpcyAxLzYgb2YgdGhlIGJyZWFzdCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdCwgMS82KX0gdG8gdGhlIGxlZnQgb2YgT2B9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc5J10gPSBzZXRQb2ludCgtaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCBwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDYpLCAwLCB7ZDogdHJ1ZX0pO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYERyYXcgbGluZSBmcm9tIDIgdG8gWiwgYW5kIG9uZSBmcm9tIEUgdG8gWWB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICcyJywgJ1onLCAnZGFzaGVkJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ0UnLCAnWScsICdkYXNoZWQnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBYIGlzIHdoZXJlIHRoZSBsaW5lIGZyb20gMiB0byBaIGNyb3NzZXMgdGhlIGxpbmUgZG93biBmcm9tIDlgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50MiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMiddO1xuICAgICAgY29uc3QgcG9pbnRaID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydaJ107XG4gICAgICBjb25zdCBwb2ludDkgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzknXTtcbiAgICAgIGxldCB4OSA9IDAgKyBwb2ludDkueDtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWCddID0gc2V0UG9pbnRMaW5lWChzdGF0dXMsIHBvaW50MiwgcG9pbnRaLCB4OSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAzIGlzIHRoZSBkZXNpcmVkIHNob3VsZGVyIGNoYW5nZSAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLnNob3VsZGVyKX0gY2xvc2VyIHRvIHBvaW50IDIgYWxvbmcgdGhlIGxpbmUgZnJvbSAyIHRvIFhgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50MiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMiddO1xuICAgICAgY29uc3QgcG9pbnRYID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydYJ107XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzMnXSA9IHNldFBvaW50QWxvbmdMaW5lKHN0YXR1cywgcG9pbnRYLCBwb2ludDIsIHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5zaG91bGRlci52YWx1ZSkpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICcyJywgJzMnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAxNCBpcyBhbG9uZyB0aGUgbGluZSBmcm9tIEUgdG8gWSwgdGhlIHNhbWUgZGlzdGFuY2UgYXMgMyB0byAyYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0UnXTtcbiAgICAgIGNvbnN0IHBvaW50WSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWSddO1xuICAgICAgY29uc3QgcG9pbnQyID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycyJ107XG4gICAgICBjb25zdCBwb2ludDMgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzMnXTtcbiAgICAgIGNvbnN0IGEgPSBNYXRoLmFicyhwb2ludDMueCAtIHBvaW50Mi54KTtcbiAgICAgIGNvbnN0IGIgPSBNYXRoLmFicyhwb2ludDMueSAtIHBvaW50Mi55KTtcbiAgICAgIGNvbnN0IGMgPSBhICogYSArIGIgKiBiO1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoYyk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzE0J10gPSBzZXRQb2ludEFsb25nTGluZShzdGF0dXMsIHBvaW50RSwgcG9pbnRZLCBkaXN0YW5jZSAvIHN0YXR1cy5wcmVjaXNpb24pO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICcxNCcsICdFJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCAxMiBpcyAxLzQgdGhlIGJyZWFzdCBtZWFzdXJlbWVudCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdCwgMS80KX0gZnJvbSBBMSB0byBHYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEExID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydBMSddO1xuICAgICAgY29uc3QgcG9pbnRHID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydHJ107XG4gICAgICBjb25zdCBkaXN0ID0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJyZWFzdC52YWx1ZSkgLyA0O1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycxMiddID0gc2V0UG9pbnRBbG9uZ0xpbmUoc3RhdHVzLCBwb2ludEExLCBwb2ludEcsIGRpc3QpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IDAwIGlzIHRoZSBzYW1lIGRpc3RhbmNlIGFzIFogdG8gWCwgbGVmdCBvZiBLLCBhbmQgaGFsZndheSBiZXR3ZWVuIFogYW5kIEsgdXAgZnJvbSBLYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludFogPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1onXTtcbiAgICAgIGNvbnN0IHBvaW50WCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snWCddO1xuICAgICAgY29uc3QgcG9pbnRLID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydLJ107XG4gICAgICBjb25zdCBhID0gTWF0aC5hYnMocG9pbnRaLnggLSBwb2ludFgueCk7XG4gICAgICBjb25zdCBiID0gTWF0aC5hYnMocG9pbnRaLnkgLSBwb2ludFgueSk7XG4gICAgICBjb25zdCBjID0gYSAqIGEgKyBiICogYjtcbiAgICAgIGNvbnN0IHhkaXN0YW5jZSA9IE1hdGguc3FydChjKTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMDAnXSA9IHNldFBvaW50KHBvaW50Sy54IC0geGRpc3RhbmNlLCAocG9pbnRLLnkgKyBwb2ludFoueSkvMiwge3U6IHRydWUsIGQ6IHRydWV9KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBjdXJ2ZSB0aGUgYXJtaG9sZSBmcm9tIDAwIHRvIDEyLCBmcm9tIDE0IHRvIDEyLCBhbmQgZnJvbSAwMCB0byAzYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBzdGF0dXMgPSBzZXRDdXJ2ZShzdGF0dXMsICcxMicsICczJywgMik7XG4gICAgICBzdGF0dXMgPSBzZXRDdXJ2ZShzdGF0dXMsICcwMCcsICcxMicsIDMpO1xuICAgICAgc3RhdHVzID0gc2V0Q3VydmUoc3RhdHVzLCAnMTQnLCAnMDAnLCA0KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFRvIHN0YXJ0IG1ha2luZyB0aGUgZGFydHMsIGRpdmlkZSB0aGUgZGlzdGFuY2UgZnJvbSBHIHRvIEsgaW50byAzIHBhcnRzICR7cHJpbnROdW0oKChwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMuYnJlYXN0LnZhbHVlKSAvIDIpIC0gcGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLmJsYWRlLnZhbHVlKSkgLyAzKX0sIGdpdmluZyBwb2ludHMgUyBhbmQgVC5gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRyddO1xuICAgICAgY29uc3QgcG9pbnRLID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydLJ107XG4gICAgICBjb25zdCBkaXN0ID0gTWF0aC5yb3VuZCgocG9pbnRHLnggLSBwb2ludEsueCkgLyAzKTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUyddID0gc2V0UG9pbnQocG9pbnRHLnggLSBkaXN0LCBwb2ludEcueSk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1QnXSA9IHNldFBvaW50KHBvaW50Ry54IC0gKGRpc3QgKiAyKSwgcG9pbnRHLnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHsgXG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBVIGlzIDEvMiBpbmNoIHJpZ2h0IG9mIFNgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50UyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUyddO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydVJ10gPSBzZXRQb2ludChwb2ludFMueCArIGluY2hlc1RvUHJlY2lzaW9uKHN0YXR1cywgMC41KSwgcG9pbnRTLnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEggaXMgYXQgdGhlIGhlaWdodCBvZiBCLCB3aGVyZSB0aGUgbGluZSBleHRlbmRzIGZyb20gRiB0aHJvdWdoIEdgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRiddO1xuICAgICAgY29uc3QgcG9pbnRHID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydHJ107XG4gICAgICBjb25zdCBwb2ludEIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0InXTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snSCddID0gc2V0UG9pbnRMaW5lWShzdGF0dXMsIHBvaW50RiwgcG9pbnRHLCBwb2ludEIueSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ0cnLCAnSCcsICdkYXNoZWQnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChfc3RhdHVzKSA9PiB7cmV0dXJuIGBBbHNvIGRpdmlkZSBIIHRvIEogaW50byB0aHJlZSBwYXJ0cyB0byBnaXZlIHBvaW50cyBRIGFuZCBSIGB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRIID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydIJ107XG4gICAgICBjb25zdCBwb2ludEogPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0onXTtcbiAgICAgIGNvbnN0IGRpc3QgPSAocG9pbnRILnggLSBwb2ludEoueCkgLyAzO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydRJ10gPSBzZXRQb2ludChwb2ludEgueCAtIGRpc3QsIHBvaW50SC55KTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUiddID0gc2V0UG9pbnQocG9pbnRILnggLSAoZGlzdCAqIDIpLCBwb2ludEgueSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgRHJhdyB0d28gbGluZXMsIG9uZSBmcm9tIFUgdG8gUSBhbmQgb25lIGZyb20gVCB0byBSLCBjb250aW51aW5nIGJlbG93IHRoZSB3YWlzdCBsaW5lYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1UnLCAnUScsICdkYXNoZWQnLCAnY29udGludWVkJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1QnLCAnUicsICdkYXNoZWQnLCAnY29udGludWVkJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgVG8gZmluZCB0aGUgZGFydCBkaWZmZXJlbmNlLCBtZWFzdXJlIGFsb25nIHRoZSB3YWlzdGxpbmUgZnJvbSBEIHRvIEggYW5kIHN1YnJhY3QgMSBpbmNoLiBUaGVuIHN1YnRyYWN0IGhhbGYgdGhlIHdhaXN0IHRvIGdldCB0aGUgZGlmZmVyZW5jZS4gRWFjaCBkYXJ0IHdpbGwgZ2V0IGhhbGYgb2YgdGhpcyBlcXVhbGx5IG9uIGVpdGhlciBzaWRlIG9mIHBvaW50cyBRICh3aGljaCBtYWtlcyBwb2ludHMgNCBhbmQgNSkgYW5kIFIgKHRvIG1ha2UgcG9pbnRzIDYgYW5kIDcpLmB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnREID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEJ107XG4gICAgICBjb25zdCBwb2ludEggPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0gnXTtcbiAgICAgIGNvbnN0IHBvaW50USA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUSddO1xuICAgICAgY29uc3QgcG9pbnRSID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydSJ107XG4gICAgICBjb25zdCBkaXN0ID0gTWF0aC5hYnMocG9pbnRILnggLSBwb2ludEQueCkgLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIDEpO1xuXG4gICAgICBjb25zdCB3YWlzdCA9IChwYXJzZUZsb2F0KHN0YXR1cy5tZWFzdXJlbWVudHMud2Fpc3QudmFsdWUpICogc3RhdHVzLnByZWNpc2lvbikgLyAyO1xuICAgICAgY29uc3QgZGlmZiA9IChkaXN0IC0gd2Fpc3QpIC8gNDtcbiAgICAgIGNvbnNvbGUubG9nKGBkaXN0OiAke2Rpc3R9LCB3YWlzdDogJHt3YWlzdH0sIGRpZmY6ICR7ZGlmZn1gKTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNCddID0gc2V0UG9pbnQocG9pbnRRLnggLSBkaWZmLCBwb2ludFEueSk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzUnXSA9IHNldFBvaW50KHBvaW50US54ICsgZGlmZiwgcG9pbnRRLnkpO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc2J10gPSBzZXRQb2ludChwb2ludFIueCAtIGRpZmYsIHBvaW50Ui55KTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNyddID0gc2V0UG9pbnQocG9pbnRSLnggKyBkaWZmLCBwb2ludFIueSk7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IFYgaXMgMS8zIG9mIHRoZSB3YXkgZnJvbSBVIHRvIFEsIGFuZCBXIGJldHdlZW4gVCBhbmQgUiBhIGhhbGYgYW4gaW5jaCBoaWdoZXIgdGhhbiBWYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludFUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1UnXTtcbiAgICAgIGNvbnN0IHBvaW50USA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snUSddO1xuICAgICAgY29uc3QgcG9pbnRUID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydUJ107XG4gICAgICBjb25zdCBwb2ludFIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1InXTtcbiAgICAgIGNvbnN0IGEgPSBNYXRoLmFicyhwb2ludFUueCAtIHBvaW50US54KTtcbiAgICAgIGNvbnN0IGIgPSBNYXRoLmFicyhwb2ludFUueSAtIHBvaW50US55KTtcbiAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnJvdW5kKE1hdGguc3FydChhICogYSArIGIgKiBiKSAvIDMpIC8gc3RhdHVzLnByZWNpc2lvbjtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snViddID0gc2V0UG9pbnRBbG9uZ0xpbmUoc3RhdHVzLCBwb2ludFUsIHBvaW50USwgZGlzdCk7XG4gICAgICBjb25zdCB3WSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snViddLnkgLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIDAuNSk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1cnXSA9IHNldFBvaW50TGluZVkoc3RhdHVzLCBwb2ludFQsIHBvaW50Uiwgd1kpO1xuICAgICAgXG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1YnLCAnNCcpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdWJywgJzUnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnVycsICc2Jyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ1cnLCAnNycpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKHN0YXR1cykgPT4ge3JldHVybiBgUG9pbnQgOWIgaXMgMS80IG9mIHRoZSB3YWlzdCAke3ByaW50TWVhc3VyZShzdGF0dXMubWVhc3VyZW1lbnRzLndhaXN0LCAgLSAxLzQpfSArIDEgaW5jaCAgdG8gdGhlIGxlZnQgb2YgRGB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnREID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEJ107XG4gICAgICBjb25zdCB3YWlzdCA9IHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy53YWlzdC52YWx1ZSkgLyA0O1xuICAgICAgY29uc3QgZGlzdEQ5ID0gaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCB3YWlzdCArIDEpXG4gICAgICBjb25zb2xlLmxvZyhgZGlzdEQ5ID0gJHt3YWlzdH0gKyAxID0gJHtkaXN0RDl9YCk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzliJ10gPSBzZXRQb2ludChwb2ludEQueCAtIGRpc3REOSwgcG9pbnRELnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYEZyb20gdGhlIGZyb250IGF0IEggdG8gNCwgNSB0byA2LCBhbmQgNyB0byA4LCBwbGFjZSBhbm90aGVyIDEvNCBvZiB0aGUgd2Fpc3QgLSAxIGluY2ggdG8gZmluZCBwb2ludCA4YH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludEggPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0gnXTtcbiAgICAgIGNvbnN0IHBvaW50NCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNCddO1xuICAgICAgY29uc3QgcG9pbnQ1ID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWyc1J107XG4gICAgICBjb25zdCBwb2ludDYgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzYnXTtcbiAgICAgIGNvbnN0IHBvaW50NyA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNyddO1xuICAgICAgY29uc3QgZGlzdEg0ID0gTWF0aC5hYnMocG9pbnRILnggLSBwb2ludDQueClcbiAgICAgIGNvbnN0IGRpc3Q1NiA9IE1hdGguYWJzKHBvaW50NS54IC0gcG9pbnQ2LngpXG4gICAgICBjb25zdCB3YWlzdCA9ICgocGFyc2VGbG9hdChzdGF0dXMubWVhc3VyZW1lbnRzLndhaXN0LnZhbHVlKSAvIDQgLSAxLjUpICogc3RhdHVzLnByZWNpc2lvbik7XG4gICAgICBjb25zdCBkaXN0NzggPSBNYXRoLmFicyh3YWlzdCAtIGRpc3RINCAtIGRpc3Q1Nik7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzgnXSA9IHNldFBvaW50KHBvaW50Ny54ICsgZGlzdDc4LCBwb2ludEgueSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJzEyJywgJzgnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnMTInLCAnOWInKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9LFxuICB7XG4gICAgZGVzY3JpcHRpb246IChzdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IE0gaXMgYWxvbmcgdGhlIGxpbmUgZnJvbSBGIHRvIEgsIHdoZXJlIHRoZSBsZW5ndGggb2YgdGhlIGZyb250ICR7cHJpbnRNZWFzdXJlKHN0YXR1cy5tZWFzdXJlbWVudHMubGVuZ3RoT2ZGcm9udCl9IGZyb20gRSBtZWV0cyBpdC5gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRiddO1xuICAgICAgY29uc3QgcG9pbnRIID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydIJ107XG4gICAgICBjb25zdCBwb2ludEUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ0UnXTtcbiAgICAgIC8vbWFrZSBhIGxpbmUgZnJvbSBwb2ludEUuIHdlIGRvbid0IGtub3cgdGhlIGFuZ2xlLCBidXQgd2Uga25vdyB0aGUgbGVuZ3RoLlxuICAgICAgY29uc3QgZGlzdCA9IHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5sZW5ndGhPZkZyb250LnZhbHVlKSAqIHN0YXR1cy5wcmVjaXNpb247XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ00nXSA9IHNldFBvaW50TGluZUNpcmNsZShzdGF0dXMsIHBvaW50RiwgcG9pbnRILCBwb2ludEUsIGRpc3QpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdIJywgJ00nLCAnZGFzaGVkJyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoc3RhdHVzKSA9PiB7cmV0dXJuIGBQb2ludCBlIGlzIGJlbG93IHBvaW50IDEyLCAxLzIgb2YgdGhlIHdheSBiZXR3ZWVuIDggYW5kIE0ncyBoZWlnaHRgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50OCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snOCddO1xuICAgICAgY29uc3QgcG9pbnRNID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydNJ107XG4gICAgICBjb25zdCBwb2ludDEyID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycxMiddO1xuICAgICAgY29uc3QgeSA9IHBvaW50OC55IC0gKHBvaW50OC55IC0gcG9pbnRNLnkpIC8gMjtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snZSddID0gc2V0UG9pbnQocG9pbnQxMi54LCB5LCB7cjogdHJ1ZX0pO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdlJywgJzEyJywgJ2Rhc2hlZCcpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYExvd2VzdCBmcm9udCBwb2ludCAoTTEpIGlzIDEvMiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBIIGFuZCA0ICB0byB0aGUgcmlnaHQgb2YgTS4gRHJhdyBhIGRhc2hlZCBsaW5lIGZyb20gZSB0byBNMWB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRIID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydIJ107XG4gICAgICBjb25zdCBwb2ludDQgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzQnXTtcbiAgICAgIGNvbnN0IHBvaW50TSA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTSddO1xuICAgICAgY29uc3QgeCA9IHBvaW50TS54ICsgTWF0aC5hYnMocG9pbnRILnggLSBwb2ludDQueCkgLyAyO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydNMSddID0gc2V0UG9pbnQoeCwgcG9pbnRNLnkpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdlJywgJ00xJywgJ2Rhc2hlZCcpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYE9uIHRoZSBsaW5lIGZyb20gTTEgdG8gZSwgcG9pbnRzIEIgYW5kIEQgYXJlIGF0IHRoaXJkcy5gfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50TTEgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ00xJ107XG4gICAgICBjb25zdCBwb2ludGUgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ2UnXTtcbiAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnJvdW5kKGRpc3RQb2ludFRvUG9pbnQocG9pbnRNMSwgcG9pbnRlKSAvIDMpIC8gc3RhdHVzLnByZWNpc2lvbjtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snYiddID0gc2V0UG9pbnRBbG9uZ0xpbmUoc3RhdHVzLCBwb2ludE0xLCBwb2ludGUsIGRpc3QpO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydkJ10gPSBzZXRQb2ludEFsb25nTGluZShzdGF0dXMsIHBvaW50TTEsIHBvaW50ZSwgZGlzdCAqIDIpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdiJywgJzUnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnZCcsICc3Jyk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH1cbiAgfSxcbiAge1xuICAgIGRlc2NyaXB0aW9uOiAoX3N0YXR1cykgPT4ge3JldHVybiBgVHJ1ZSB1cCB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgZGFydCBmcm9tIFcgdG8gNiB0byBmaW5kIGNgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGxldCBkaXN0ZHcgPSBkaXN0QUJDKHN0YXR1cywgJ2QnLCAnNycsICdXJyk7XG4gICAgICBjb25zdCBwb2ludFcgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ1cnXTtcbiAgICAgIGNvbnN0IHBvaW50NiA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snNiddO1xuICAgICAgbGV0IGRpc3R5ID0gZGlzdGR3IC0gZGlzdFBvaW50VG9Qb2ludChwb2ludFcsIHBvaW50Nik7XG4gICAgICBsZXQgeSA9IHBvaW50Ni55ICsgZGlzdHk7XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ2MnXSA9IHNldFBvaW50KHBvaW50Ni54LCB5KTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnNicsICdjJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ2InLCAnYycpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFRydWUgdXAgdGhlIG90aGVyIHNpZGUgb2YgdGhlIGRhcnQgZnJvbSBWIHRvIDQgdG8gZmluZCBhYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBsZXQgZGlzdGJWID0gZGlzdEFCQyhzdGF0dXMsICdiJywgJzUnLCAnVicpO1xuICAgICAgY29uc3QgcG9pbnRWID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydWJ107XG4gICAgICBjb25zdCBwb2ludDQgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzQnXTtcbiAgICAgIGNvbnN0IGRpc3R5ID0gZGlzdGJWIC0gZGlzdFBvaW50VG9Qb2ludChwb2ludFYsIHBvaW50NCk7XG4gICAgICBjb25zdCB5ID0gcG9pbnQ0LnkgKyBkaXN0eTtcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snYSddID0gc2V0UG9pbnQocG9pbnQ0LngsIHkpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICc0JywgJ2EnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnTTEnLCAnYScpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IGYgaXMgMS8yIGluY2ggcmlnaHQgb2YgZWB9LFxuICAgIGFjdGlvbjogKHN0YXR1cykgPT4ge1xuICAgICAgY29uc3QgcG9pbnRlID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydlJ107XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJ2YnXSA9IHNldFBvaW50KHBvaW50ZS54ICsgaW5jaGVzVG9QcmVjaXNpb24oc3RhdHVzLCAwLjUpLCBwb2ludGUueSk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJzliJywgJ2YnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnOCcsICdlJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ2QnLCAnZScpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IDE1IGlzIDMvOCBvZiB0aGUgYmxhZGUgbWVhc3VyZSBsZWZ0IG9mIEExIGFuZCAxLzIgaW5jaCBiZWxvdyBWYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBibGFkZSA9IHBhcnNlRmxvYXQoc3RhdHVzLm1lYXN1cmVtZW50cy5ibGFkZS52YWx1ZSk7XG4gICAgICBjb25zdCBwb2ludEExID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydBMSddO1xuICAgICAgY29uc3QgcG9pbnRWID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydWJ107XG4gICAgICBzdGF0dXMucGF0dGVybi5wb2ludHNbJzE1J10gPSBzZXRQb2ludChwb2ludEExLnggLSBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIGJsYWRlICogMy84KSwgcG9pbnRWLnkgKyBpbmNoZXNUb1ByZWNpc2lvbihzdGF0dXMsIDAuNSkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IDE2IGlzIDEvMyBvZiB0aGUgd2F5IGZyb20gZiB0byBEYH0sXG4gICAgYWN0aW9uOiAoc3RhdHVzKSA9PiB7XG4gICAgICBjb25zdCBwb2ludGYgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJ2YnXTtcbiAgICAgIGNvbnN0IHBvaW50RCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRCddO1xuICAgICAgY29uc3QgZGlzdCA9IE1hdGguYWJzKHBvaW50Zi54IC0gcG9pbnRELngpIC8gMztcbiAgICAgIHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snMTYnXSA9IHNldFBvaW50KHBvaW50Zi54ICsgZGlzdCwgcG9pbnRmLnkpO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9XG4gIH0sXG4gIHtcbiAgICBkZXNjcmlwdGlvbjogKF9zdGF0dXMpID0+IHtyZXR1cm4gYFBvaW50IEQxIGlzIHJpZ2h0IGJlbG93IEQuIFBvaW50IGcgaXMgcmlnaHQgb2YgZi4gRCB0byBEMSBhbmQgRDEgdG8gZyBhcmUgdGhlIHNhbWUgZGlzdGFuY2VgfSxcbiAgICBhY3Rpb246IChzdGF0dXMpID0+IHtcbiAgICAgIGNvbnN0IHBvaW50RCA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snRCddO1xuICAgICAgY29uc3QgcG9pbnRmID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydmJ107XG4gICAgICBcbiAgICAgIC8vRDEgaXMgaW4gdGhlIGNlbnRlciwgZyBhbmQgRCBhcmUgb24gdGhlIGNpcmN1bWZlcmVuY2UuIHRoZSBsaW5lIGZyb20gRDEgdG8gRCBpcyBhdCAxMiBvJ2Nsb2NrLCB0aGUgbGluZSBmcm9tIEQxIHRvIEcgaXMgYXQgOCBvJ2Nsb2NrXG4gICAgICBsZXQgYW5nbGUgPSA1MDtcbiAgICAgIGNvbnN0IGFuZ2xlUmFkID0gYW5nbGUgKiAoTWF0aC5QSSAvIDE4MCk7XG4gICAgICBsZXQgciA9IChwb2ludEQueSAtIHBvaW50Zi55KS8oMSArIE1hdGguc2luKGFuZ2xlUmFkKSk7XG4gICAgICBsZXQgeGcgPSBwb2ludEQueCArIHIgKiBNYXRoLmNvcyhhbmdsZVJhZCk7XG5cbiAgICAgIGxldCBwb2ludEQxID0ge3g6IHBvaW50RC54LCB5OiBwb2ludEQueSAtIHJ9O1xuICAgICAgbGV0IHBvaW50RyA9IHt4OiB4ZywgeTogcG9pbnRmLnl9O1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydEMSddID0gc2V0UG9pbnQocG9pbnREMS54LCBwb2ludEQxLnkpO1xuICAgICAgc3RhdHVzLnBhdHRlcm4ucG9pbnRzWydnJ10gPSBzZXRQb2ludChwb2ludEcueCwgcG9pbnRHLnkpO1xuICAgICAgc3RhdHVzID0gc2V0TGluZShzdGF0dXMsICdEJywgJ0QxJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ0QxJywgJ2cnKTtcbiAgICAgIHN0YXR1cyA9IHNldExpbmUoc3RhdHVzLCAnMTUnLCAnMTYnLCAnZGFzaGVkJyk7XG4gICAgICBzdGF0dXMgPSBzZXRMaW5lKHN0YXR1cywgJ2cnLCAnZicsICdkYXNoZWQnKTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfVxuICB9XG5dO1xuZnVuY3Rpb24gd2lkdGhUb3BCYWNrKHN0YXR1cyl7XG4gIGNvbnNvbGUubG9nKHN0YXR1cyk7XG4gIC8vcmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIHRvcCBvZiB0aGUgYmFjaywgdGhlIHF1YXJ0ZXIgZWxsaXBzZSAxLTIgYXJvdW5kIE9cbiAgY29uc3QgcG9pbnQxID0gc3RhdHVzLnBhdHRlcm4ucG9pbnRzWycxJ107XG5cbiAgLy9jb25zdCBwb2ludDEgPSB7eDogMjAsIHk6IDB9O1xuICBjb25zdCBwb2ludDIgPSBzdGF0dXMucGF0dGVybi5wb2ludHNbJzInXTsgXG4gIGNvbnN0IGNlbnRlciA9IHN0YXR1cy5wYXR0ZXJuLnBvaW50c1snTyddO1xuICBjb25zdCBwID0gcGVyaW1ldGVyRWxsaXBzZShzdGF0dXMsIGNlbnRlciwgcG9pbnQxLCBwb2ludDIpO1xuICByZXR1cm4gcCAvIDQ7XG59XG5cbmZ1bmN0aW9uIGZpbmRQb2ludEUoc3RhdHVzLCBwb2ludEosIHBvaW50UCl7XG4gIGNvbnN0IHBvaW50aiA9IHNldFBvaW50KHBvaW50Si54IC0gKDEgKiBzdGF0dXMucHJlY2lzaW9uKSwgcG9pbnRKLnkpO1xuICBjb25zdCBmcm9udExlbmd0aCA9IHBhcnNlRmxvYXQoc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHMuZnJvbnRMZW5ndGgudmFsdWUpICogc3RhdHVzLnByZWNpc2lvbjtcblxuICAvL3RoZSBcIndpZHRoIG9mIHRvcCBiYWNrXCIgbm90IGNsZWFyIGluIHRoZSBpbnN0cnVjdGlvbnMuIEJ1dCBpdCBzZWVtcyB0aGF0IDEvMTIgb2YgdGhlIGJyZWFzdCB2YWx1ZSBnZXRzIHRoZSByaWdodCByZXN1bHRcbiAgLy9JIGRpZCB0cnkgZnJvbSBPIHRvIDIsIGFzIHdlbGwgYXMgZmluZGluZyB0aGUgY2lyY3VtZmVyZW5jZSBvZiB0aGUgZWxsaXBzZSwgYnV0IG5laXRoZXIgc2VlbWVkIHRvIHdvcmsuXG4gIGNvbnN0IHd0YjIgPSBNYXRoLmFicyhwYXJzZUZsb2F0KHN0YXR1cy5kZXNpZ24ubWVhc3VyZW1lbnRzLmJyZWFzdC52YWx1ZSkgLyAxMiAqIHN0YXR1cy5wcmVjaXNpb24pO1xuICAvL3dlIG5lZWQgdG8gZmluZCB0aGUgeSBmb3IgcG9pbnQgRVxuICAvL3dlIGhhdmUgYSB0cmlhbmdsZSwgd2l0aCBsaW5lcyBhLCBiLCBhbmQgYy5cbiAgLy9hIGlzIGFsb25nIHgsIGZyb20gcG9pbnRqIHRvIHBvaW50UFxuICBjb25zdCBhID0gTWF0aC5hYnMocG9pbnRQLnggLSBwb2ludGoueCk7XG4gIGNvbnN0IGMgPSBmcm9udExlbmd0aCAtIHd0YjI7XG4gIC8vYiBpcyBhbG9uZyB5LCBvbiB4IG9mIHBvaW50IFAuXG4gIC8vYV4yICsgYl4yID0gY14yXG4gIC8vYiA9IHNxcnQoY14yIC0gYV4yKVxuICBjb25zdCBiID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoYyAqIGMgLSBhICogYSkpO1xuICBjb25zdCBleSA9IE1hdGgucm91bmQocG9pbnRKLnkgLSBiKTtcbiAgcmV0dXJuIHNldFBvaW50KHBvaW50UC54LCBleSwge2w6IHRydWV9KTtcbn1cblxuZnVuY3Rpb24gZGlzdE90b0Eoc3RhdHVzKXtcbiAgY29uc3QgYiA9IHN0YXR1cy5tZWFzdXJlbWVudHMuYmFja0xlbmd0aC52YWx1ZSArIDAuNzU7XG4gIGNvbnN0IGEgPSBzdGF0dXMubWVhc3VyZW1lbnRzLmhlaWdodFVuZGVyQXJtLnZhbHVlO1xuICByZXR1cm4gYiAtIGE7XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCB7IGRlc2lnbl9pbmZvLCBtZWFzdXJlbWVudHMsIHN0ZXBzIH07XG4iLCAiaW1wb3J0IGtleXN0b25lX3NpbmdsZSBmcm9tICcuL2tleXN0b25lX3NpbmdsZS1icmVhc3RlZC12ZXN0LmpzJztcblxuY29uc3QgZGVzaWducyA9IFtcbiAga2V5c3RvbmVfc2luZ2xlXG5dLm1hcCgoZGVzaWduKSA9PiB7XG4gIHJldHVybiB7XG4gICAgbGFiZWw6IGRlc2lnbi5kZXNpZ25faW5mby50aXRsZSxcbiAgICBkZXNpZ25faW5mbzogZGVzaWduLmRlc2lnbl9pbmZvLFxuICAgIG1lYXN1cmVtZW50czogZGVzaWduLm1lYXN1cmVtZW50cyxcbiAgICBwb2ludHM6IGRlc2lnbi5wb2ludHMsXG4gICAgc3RlcHM6IGRlc2lnbi5zdGVwc1xuICB9O1xufSk7XG5cbmV4cG9ydCB7IGRlc2lnbnMgfTtcbiIsICJleHBvcnQgZnVuY3Rpb24gbWFrZVBpeGVscyhzdGF0dXMpIHtcbiAgY29uc3QgcGF0dGVybiA9IHN0YXR1cy5wYXR0ZXJuO1xuICBjb25zdCBtYXJnaW4gPSBzdGF0dXMuY2FudmFzSW5mby5tYXJnaW47XG4gIGNvbnN0IHBpeGVsc1BlckluY2ggPSBzdGF0dXMuY2FudmFzSW5mby5waXhlbHNQZXJJbmNoO1xuICBjb25zdCBkZWZhdWx0U2l6ZSA9IHsuLi5zdGF0dXMuY2FudmFzSW5mby5kZWZhdWx0U2l6ZX07XG4gIGNvbnN0IHByZWNpc2lvbiA9IHN0YXR1cy5wcmVjaXNpb247XG4gIGxldCBwaXhlbFBhdHRlcm4gPSB7XG4gICAgcG9pbnRzOiB7fSxcbiAgICBsaW5lczogWy4uLnBhdHRlcm4ubGluZXNdLFxuICAgIGN1cnZlczogWy4uLnBhdHRlcm4uY3VydmVzXSxcbiAgICBjYW52YXNTaXplOiBkZWZhdWx0U2l6ZSxcbiAgfTtcblxuICBsZXQgc21hbGxlc3RYID0gbWFyZ2luO1xuICBsZXQgc21hbGxlc3RZID0gbWFyZ2luO1xuICBsZXQgbGFyZ2VzdFggPSBtYXJnaW47XG4gIGxldCBsYXJnZXN0WSA9IG1hcmdpbjtcblxuICBmb3IgKGxldCBwb2ludCBpbiBwYXR0ZXJuLnBvaW50cykge1xuICAgIGxldCBwaXhlbFBvaW50ID0gY29udmVydFBvaW50KHBvaW50LCBwYXR0ZXJuLnBvaW50c1twb2ludF0sIHBpeGVsc1BlckluY2gsIHByZWNpc2lvbik7XG4gICAgcGl4ZWxQYXR0ZXJuLnBvaW50c1twb2ludF0gPSBwaXhlbFBvaW50O1xuXG4gICAgbGV0IHggPSBwaXhlbFBvaW50Lng7XG4gICAgbGV0IHkgPSBwaXhlbFBvaW50Lnk7XG5cbiAgICBpZiAoeCA8IHNtYWxsZXN0WCkge1xuICAgICAgc21hbGxlc3RYID0geDtcbiAgICB9XG4gICAgaWYgKHkgPCBzbWFsbGVzdFkpIHtcbiAgICAgIHNtYWxsZXN0WSA9IHk7XG4gICAgfVxuICAgIGlmICh4ID4gbGFyZ2VzdFgpIHtcbiAgICAgIGxhcmdlc3RYID0geDtcbiAgICB9XG4gICAgaWYgKHkgPiBsYXJnZXN0WSkge1xuICAgICAgbGFyZ2VzdFkgPSB5O1xuICAgIH1cbiAgfVxuXG4gIGxldCB4T2Zmc2V0ID0gMDtcbiAgbGV0IHlPZmZzZXQgPSAwO1xuICBpZiAoc21hbGxlc3RYIDwgbWFyZ2luKSB7XG4gICAgeE9mZnNldCA9IG1hcmdpbiAtIHNtYWxsZXN0WDtcbiAgfVxuICBpZiAoc21hbGxlc3RZIDwgbWFyZ2luKSB7XG4gICAgeU9mZnNldCA9IG1hcmdpbiAtIHNtYWxsZXN0WTtcbiAgfVxuXG4gIGZvciAobGV0IHBvaW50IGluIHBpeGVsUGF0dGVybi5wb2ludHMpIHtcbiAgICBwaXhlbFBhdHRlcm4ucG9pbnRzW3BvaW50XS54ICs9IHhPZmZzZXQ7XG4gICAgcGl4ZWxQYXR0ZXJuLnBvaW50c1twb2ludF0ueSArPSB5T2Zmc2V0O1xuICB9XG5cbiAgbGV0IG5ld0xhcmdlc3RYID0gbGFyZ2VzdFggKyB4T2Zmc2V0O1xuICBsZXQgbmV3TGFyZ2VzdFkgPSBsYXJnZXN0WSArIHlPZmZzZXQ7XG5cbiAgbGV0IHdpZHRoID0gbmV3TGFyZ2VzdFggKyBtYXJnaW47XG4gIGxldCBoZWlnaHQgPSBuZXdMYXJnZXN0WSArIG1hcmdpbjtcblxuICBpZiAod2lkdGggPiBkZWZhdWx0U2l6ZS54KSB7XG4gICAgcGl4ZWxQYXR0ZXJuLmNhbnZhc1NpemUueCA9IHdpZHRoO1xuICB9XG4gIGlmIChoZWlnaHQgPiBkZWZhdWx0U2l6ZS55KSB7XG4gICAgcGl4ZWxQYXR0ZXJuLmNhbnZhc1NpemUueSA9IGhlaWdodDtcbiAgfVxuXG4gIHJldHVybiBwaXhlbFBhdHRlcm47XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQb2ludChsYWJlbCwgcG9pbnQsIHBpeGVsc1BlckluY2gsIHByZWNpc2lvbikge1xuICBsZXQgeCA9IChwb2ludC54IC8gcHJlY2lzaW9uKSAqIHBpeGVsc1BlckluY2g7XG4gIGxldCB5ID0gKHBvaW50LnkgLyBwcmVjaXNpb24pICogcGl4ZWxzUGVySW5jaDtcbiAgcmV0dXJuIHsgbGFiZWw6IGxhYmVsLCB4OiB4LCB5OiB5LCBndWlkZXM6IHBvaW50Lmd1aWRlcyB9O1xufVxuIiwgImltcG9ydCB7IG1ha2VQaXhlbHMgfSBmcm9tICcuL3BpeGVscy5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3UGF0dGVybihzdGF0dXMpIHtcbiAgbGV0IHBpeGVsUGF0dGVybiA9IG1ha2VQaXhlbHMoc3RhdHVzKTtcbiAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBjYW52YXMud2lkdGggPSBwaXhlbFBhdHRlcm4uY2FudmFzU2l6ZS54O1xuICBjYW52YXMuaGVpZ2h0ID0gcGl4ZWxQYXR0ZXJuLmNhbnZhc1NpemUueTtcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBjdHguZm9udCA9ICcxMnB4IHNlcmlmJztcbiAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gIGN0eC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gIGN0eC5saW5lV2lkdGggPSAxO1xuXG4gIGxldCBkcmF3aW5nID0ge1xuICAgIHBvaW50czogW10sXG4gICAgbGluZXM6IFtdLFxuICAgIGN1cnZlczogW11cbiAgfTtcblxuICBmb3IgKGxldCBwb2ludCBpbiBwaXhlbFBhdHRlcm4ucG9pbnRzKSB7XG4gICAgZHJhd1BvaW50KGN0eCwgc3RhdHVzLCBwaXhlbFBhdHRlcm4sIHBvaW50KTtcbiAgfVxuXG4gIGZvciAobGV0IGxpbmUgb2YgcGl4ZWxQYXR0ZXJuLmxpbmVzKSB7XG5cbiAgICBsZXQgc3RhcnQgPSBwaXhlbFBhdHRlcm4ucG9pbnRzW2xpbmUuc3RhcnRdO1xuICAgIGxldCBlbmQgPSBwaXhlbFBhdHRlcm4ucG9pbnRzW2xpbmUuZW5kXTtcblxuICAgIGlmIChsaW5lLnN0eWxlID09PSAnZGFzaGVkJykge1xuICAgICAgY3R4LnNldExpbmVEYXNoKFs1LCA1XSk7XG4gICAgfSBlbHNlIHsgIC8vc29saWRcbiAgICAgIGN0eC5zZXRMaW5lRGFzaChbXSk7XG4gICAgfVxuICAgIGlmIChsaW5lLmxlbmd0aCA9PT0gJ2RlZmluZWQnKSB7XG4gICAgICBkcmF3TGluZShjdHgsIHN0YXJ0LCBlbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkcmF3TGluZShjdHgsIHN0YXJ0LCBlbmQsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGN1cnZlIG9mIHBpeGVsUGF0dGVybi5jdXJ2ZXMpIHtcbiAgICBkcmF3UXVhcnRlckVsbGlwc2UoY3R4LCBzdGF0dXMsIHBpeGVsUGF0dGVybiwgY3VydmUpO1xuICAgIFxuICB9XG5cbiAgc3RhdHVzLmNhbnZhc0luZm8uZHJhd2luZyA9IGRyYXdpbmc7XG4gIHJldHVybiBzdGF0dXM7XG59XG5cbmZ1bmN0aW9uIGRyYXdQb2ludChjdHgsIHN0YXR1cywgcGl4ZWxQYXR0ZXJuLCBwb2ludExhYmVsKSB7XG4gIGxldCBwb2ludCA9IHBpeGVsUGF0dGVybi5wb2ludHNbcG9pbnRMYWJlbF07XG4gIGxldCBwb2ludFNpemUgPSBzdGF0dXMuY2FudmFzSW5mby5wb2ludFNpemU7XG4gIGxldCBtYXJnaW4gPSBzdGF0dXMuY2FudmFzSW5mby5tYXJnaW47XG4gIGxldCB4ID0gcG9pbnQueDtcbiAgbGV0IHkgPSBwb2ludC55O1xuICBsZXQgZ3VpZGVzID0gcG9pbnQuZ3VpZGVzO1xuXG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgLy9tYWtlIGEgc21hbGwgc29saWQgYmxhY2sgc3F1YXJlIGZvciB0aGUgcG9pbnRcblxuICBjdHgucmVjdCh4IC0gcG9pbnRTaXplIC8gMiwgeSAtIHBvaW50U2l6ZSAvIDIsIHBvaW50U2l6ZSwgcG9pbnRTaXplKTtcbiAgY3R4LmZpbGwoKTtcbiAgLy9zZXQgbGFiZWwgdG8gdGhlIHVwcGVyIHJpZ2h0IGJ5IDE1IHBpeGVsc1xuICBjdHguZmlsbFRleHQocG9pbnRMYWJlbCwgeCArIDUsIHkgLSA1KTtcblxuICBjdHguc2V0TGluZURhc2goWzUsIDVdKTtcbiAgaWYgKGd1aWRlcy51KSB7XG4gICAgY3R4Lm1vdmVUbyh4LCB5KTtcbiAgICBjdHgubGluZVRvKHgsIG1hcmdpbik7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG4gIGlmIChndWlkZXMuZCkge1xuICAgIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgY3R4LmxpbmVUbyh4LCBwaXhlbFBhdHRlcm4uY2FudmFzU2l6ZS55IC0gbWFyZ2luKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cbiAgaWYgKGd1aWRlcy5sKSB7XG4gICAgY3R4Lm1vdmVUbyh4LCB5KTtcbiAgICBjdHgubGluZVRvKG1hcmdpbiwgeSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG4gIGlmIChndWlkZXMucikge1xuICAgIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgY3R4LmxpbmVUbyhwaXhlbFBhdHRlcm4uY2FudmFzU2l6ZS54IC0gbWFyZ2luLCB5KTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhd0xpbmUoY3R4LCBzdGFydCwgZW5kLCBjb250aW51ZWQgPSBmYWxzZSkge1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5tb3ZlVG8oc3RhcnQueCwgc3RhcnQueSk7XG4gIGlmIChjb250aW51ZWQpIHtcbiAgICBsZXQgZHggPSBlbmQueCAtIHN0YXJ0Lng7XG4gICAgbGV0IGR5ID0gZW5kLnkgLSBzdGFydC55O1xuICAgIGxldCBsZW5ndGggPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIGxldCBzY2FsZSA9IDQwMCAvIGxlbmd0aDtcbiAgICBsZXQgb2Zmc2V0WCA9IGR4ICogc2NhbGU7XG4gICAgbGV0IG9mZnNldFkgPSBkeSAqIHNjYWxlO1xuICAgIGN0eC5saW5lVG8oZW5kLnggKyBvZmZzZXRYLCBlbmQueSArIG9mZnNldFkpO1xuICB9IGVsc2Uge1xuICAgIGN0eC5saW5lVG8oZW5kLngsIGVuZC55KTtcbiAgfVxuICBjdHguc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdRdWFydGVyRWxsaXBzZShjdHgsIF9zdGF0dXMsIHBpeGVsUGF0dGVybiwgY3VydmUsIHN0eWxlID0gJ3NvbGlkJykge1xuICAvL2Fzc3VtZSBxdWFydGVyIG9mIGFuIGVsbGlwc2VcbiAgbGV0IHBvaW50MSA9IHBpeGVsUGF0dGVybi5wb2ludHNbY3VydmUuc3RhcnRdO1xuICBsZXQgcG9pbnQyID0gcGl4ZWxQYXR0ZXJuLnBvaW50c1tjdXJ2ZS5lbmRdO1xuICBsZXQgcXVhcnRlciA9IGN1cnZlLnF1YXJ0ZXI7XG4gIC8vcXVhcnRlciAxLCAyLCAzLCBvciA0LCBjbG9ja3dpc2UgZnJvbSAxMiBvJ2Nsb2NrIChzbyAxIGlzIHRvcCByaWdodCwgMiBpcyBib3R0b20gcmlnaHQsIDMgaXMgYm90dG9tIGxlZnQsIDQgaXMgdG9wIGxlZnQpXG4gIC8vY2FsY3VsYXRlIGNlbnRlciBmcm9tIHN0YXJ0LCBlbmQsIGFuZCBxdWFydGVyXG4gIGxldCBzdGFydCA9IHsgeDogMCwgeTogMCB9O1xuICBsZXQgZW5kID0geyB4OiAwLCB5OiAwIH07XG4gIGxldCBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfTtcbiAgbGV0IHN0YXJ0QW5nbGUgPSAwO1xuICBsZXQgZW5kQW5nbGUgPSAwO1xuICBsZXQgcmFkaXVzWCA9IDA7XG4gIGxldCByYWRpdXNZID0gMDtcblxuXG5cbiAgaWYgKHF1YXJ0ZXIgPT09IDEpIHtcbiAgICAvL2NlbnRlciBpcyBiZWxvdyB0aGUgc3RhcnQgcG9pbnQgYW5kIHRvIHRoZSBsZWZ0IG9mIHRoZSBlbmQgcG9pbnRcbiAgICAvL3NldCBzdGFydCBhbmQgZW5kIHBvaW50cywgYmFzZWQgb24gZGlyZWN0aW9uIGZyb20gY2VudGVyXG4gICAgaWYgKHBvaW50MS54IDwgcG9pbnQyLngpIHtcbiAgICAgIC8vcG9pbnQxIGlzIHRvIHRoZSBsZWZ0IG9mIHBvaW50MlxuICAgICAgc3RhcnQgPSBwb2ludDE7XG4gICAgICBlbmQgPSBwb2ludDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gcG9pbnQyO1xuICAgICAgZW5kID0gcG9pbnQxO1xuICAgIH1cbiAgICBzdGFydEFuZ2xlID0gMSAqIE1hdGguUEk7XG4gICAgZW5kQW5nbGUgPSAwLjUgKiBNYXRoLlBJO1xuICAgIGNlbnRlciA9IHsgeDogc3RhcnQueCwgeTogZW5kLnkgfTtcbiAgICByYWRpdXNYID0gTWF0aC5hYnMoY2VudGVyLnggLSBzdGFydC54KTtcbiAgICByYWRpdXNZID0gTWF0aC5hYnMoY2VudGVyLnkgLSBzdGFydC55KTtcblxuICB9IGVsc2UgaWYgKHF1YXJ0ZXIgPT09IDIpIHtcbiAgICAvL2NlbnRlciBpcyB0byB0aGUgbGVmdCBvZiB0aGUgc3RhcnQgcG9pbnQgYW5kIGFib3ZlIHRoZSBlbmQgcG9pbnRcbiAgICAvL3NldCBzdGFydCBhbmQgZW5kIHBvaW50cywgYmFzZWQgb24gZGlyZWN0aW9uIGZyb20gY2VudGVyXG4gICAgaWYgKHBvaW50MS54ID4gcG9pbnQyLngpIHtcbiAgICAgIC8vcG9pbnQxIGlzIHRvIHRoZSByaWdodCBvZiBwb2ludDJcbiAgICAgIHN0YXJ0ID0gcG9pbnQxO1xuICAgICAgZW5kID0gcG9pbnQyO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IHBvaW50MjtcbiAgICAgIGVuZCA9IHBvaW50MTtcbiAgICB9XG4gICAgc3RhcnRBbmdsZSA9IDIgKiBNYXRoLlBJO1xuICAgIGVuZEFuZ2xlID0gMC41ICogTWF0aC5QSTtcbiAgICBjZW50ZXIgPSB7IHg6IGVuZC54LCB5OiBzdGFydC55IH07XG4gICAgcmFkaXVzWCA9IE1hdGguYWJzKGNlbnRlci54IC0gc3RhcnQueCk7XG4gICAgcmFkaXVzWSA9IE1hdGguYWJzKGNlbnRlci55IC0gZW5kLnkpO1xuICB9IGVsc2UgaWYgKHF1YXJ0ZXIgPT09IDMpIHtcbiAgICAvL2NlbnRlciBpcyBhYm92ZSB0aGUgc3RhcnQgcG9pbnQgYW5kIHRvIHRoZSByaWdodCBvZiB0aGUgZW5kIHBvaW50XG4gICAgLy9zZXQgc3RhcnQgYW5kIGVuZCBwb2ludHMsIGJhc2VkIG9uIGRpcmVjdGlvbiBmcm9tIGNlbnRlclxuICAgIGlmIChwb2ludDEueCA+IHBvaW50Mi54KSB7XG4gICAgICAvL3BvaW50MSBpcyB0byB0aGUgcmlnaHQgb2YgcG9pbnQyXG4gICAgICBzdGFydCA9IHBvaW50MTtcbiAgICAgIGVuZCA9IHBvaW50MjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSBwb2ludDI7XG4gICAgICBlbmQgPSBwb2ludDE7XG4gICAgfVxuICAgIHN0YXJ0QW5nbGUgPSAwLjUgKiBNYXRoLlBJO1xuICAgIGVuZEFuZ2xlID0gTWF0aC5QSTtcbiAgICBjZW50ZXIgPSB7IHg6IHN0YXJ0LngsIHk6IGVuZC55IH07XG4gICAgcmFkaXVzWCA9IE1hdGguYWJzKGNlbnRlci54IC0gZW5kLngpO1xuICAgIHJhZGl1c1kgPSBNYXRoLmFicyhjZW50ZXIueSAtIHN0YXJ0LnkpO1xuXG4gIH0gZWxzZSBpZiAocXVhcnRlciA9PT0gNCkge1xuICAgIC8vY2VudGVyIGlzIHRvIHRoZSByaWdodCBvZiB0aGUgc3RhcnQgcG9pbnQgYW5kIGJlbG93IHRoZSBlbmQgcG9pbnRcbiAgICAvL3NldCBzdGFydCBhbmQgZW5kIHBvaW50cywgYmFzZWQgb24gZGlyZWN0aW9uIGZyb20gY2VudGVyXG4gICAgaWYgKHBvaW50MS54IDwgcG9pbnQyLngpIHtcbiAgICAgIC8vcG9pbnQxIGlzIHRvIHRoZSBsZWZ0IG9mIHBvaW50MlxuICAgICAgc3RhcnQgPSBwb2ludDE7XG4gICAgICBlbmQgPSBwb2ludDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gcG9pbnQyO1xuICAgICAgZW5kID0gcG9pbnQxO1xuICAgIH1cbiAgICBzdGFydEFuZ2xlID0gMSAqIE1hdGguUEk7XG4gICAgZW5kQW5nbGUgPSAxLjUgKiBNYXRoLlBJO1xuICAgIGNlbnRlciA9IHsgeDogZW5kLngsIHk6IHN0YXJ0LnkgfTtcbiAgICByYWRpdXNYID0gTWF0aC5hYnMoY2VudGVyLnggLSBzdGFydC54KTtcbiAgICByYWRpdXNZID0gTWF0aC5hYnMoY2VudGVyLnkgLSBlbmQueSk7XG4gIH1cbiAgICAvL2RyYXcgcXVhcnRlciBlbGxpcHNlIGZyb20gc3RhcnQgdG8gZW5kLCBjZW50ZXJlZCBvbiBjZW50ZXJcbiAgICBpZiAoY3VydmUuc3R5bGUgPT09ICdkYXNoZWQnKSB7XG4gICAgICBjdHguc2V0TGluZURhc2goWzUsIDVdKTtcbiAgICB9IGVsc2UgeyAgLy9zb2xpZFxuICAgICAgY3R4LnNldExpbmVEYXNoKFtdKTtcbiAgICB9XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5lbGxpcHNlKGNlbnRlci54LCBjZW50ZXIueSwgcmFkaXVzWCwgcmFkaXVzWSwgMCwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpO1xuICAgIGN0eC5zdHJva2UoKTtcbn0iLCAiaW1wb3J0IHsgZGVzaWducyB9IGZyb20gJy4vZGVzaWducy9kZXNpZ25fbGlzdC5qcyc7XG5pbXBvcnQgeyBtYWtlUGF0dGVybiB9IGZyb20gJy4vcGF0dGVybi5qcyc7XG5pbXBvcnQgeyBkcmF3UGF0dGVybiB9IGZyb20gJy4vZHJhd2luZy5qcyc7XG5cbmNvbnN0IGRlZmF1bHRDYW52YXNTaXplID0geyB4OiA1MDAsIHk6IDUwMCB9O1xuY29uc3QgZGVmYXVsdFBpeGVsc1BlckluY2ggPSAzMjtcbmNvbnN0IGRlZmF1bHRDYW52YXNNYXJnaW4gPSBkZWZhdWx0UGl4ZWxzUGVySW5jaCAvIDI7XG5jb25zdCBkZWZhdWx0RGVzaWduID0gZGVzaWduc1swXTtcbmNvbnN0IGRlZmF1bHRQcmVjaXNpb24gPSA4OyAvLzEvOCBvZiBhbiBpbmNoXG5cbmxldCBzdGF0dXMgPSB7XG4gIGRlc2lnbjogZGVmYXVsdERlc2lnbixcbiAgbWVhc3VyZW1lbnRzOiBkZWZhdWx0RGVzaWduLm1lYXN1cmVtZW50cyxcbiAgcHJlY2lzaW9uOiBkZWZhdWx0UHJlY2lzaW9uLCBcbiAgY2FudmFzSW5mbzoge1xuICAgIGRlZmF1bHRTaXplOiBkZWZhdWx0Q2FudmFzU2l6ZSxcbiAgICBzaXplOiB7Li4uZGVmYXVsdENhbnZhc1NpemV9LFxuICAgIG1hcmdpbjogZGVmYXVsdENhbnZhc01hcmdpbixcbiAgICBwaXhlbHNQZXJJbmNoOiBkZWZhdWx0UGl4ZWxzUGVySW5jaCxcbiAgICBkcmF3aW5nOiB7XG4gICAgICBwb2ludHM6IFtdLFxuICAgICAgbGluZXM6IFtdLFxuICAgICAgY3VydmVzOiBbXVxuICAgIH0sXG4gICAgcG9pbnRTaXplOiA1LFxuICB9LFxuICBwYXR0ZXJuOiB7XG4gICAgcG9pbnRzOiB7fSxcbiAgICBsaW5lczogW10sXG4gICAgY3VydmVzOiBbXSxcbiAgICBzdGVwczogW11cbiAgfVxufVxuXG5sZXQgbGlNYXhXaWR0aCA9IDA7XG5cbmxldCBtZWFzdXJlbWVudHNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lYXN1cmVtZW50c0xpc3QnKTtcbmxldCBzdGVwc0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RlcHNMaXN0Jyk7XG5sZXQgZGVzaWduZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduRGVzaWduZXInKTtcbmxldCBkZXNpZ25Tb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduU291cmNlJyk7XG5sZXQgZGVzaWduU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rlc2lnblNlbGVjdCcpO1xuXG5kZXNpZ25zLmZvckVhY2goKGRlc2lnbiwgaW5kZXgpID0+IHtcbiAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gIG9wdGlvbi52YWx1ZSA9IGluZGV4O1xuICBvcHRpb24udGV4dENvbnRlbnQgPSBkZXNpZ24ubGFiZWw7XG4gIGRlc2lnblNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xufSk7XG5cbmZ1bmN0aW9uIGlucHV0RGVzaWduKGRlc2lnbil7XG4gIGRlc2lnbmVyLnRleHRDb250ZW50ID0gZGVzaWduLmRlc2lnbl9pbmZvLmRlc2lnbmVyO1xuICBkZXNpZ25Tb3VyY2UudGV4dENvbnRlbnQgPSBkZXNpZ24uZGVzaWduX2luZm8uc291cmNlLmxhYmVsO1xuICBkZXNpZ25Tb3VyY2UuaHJlZiA9IGRlc2lnbi5kZXNpZ25faW5mby5zb3VyY2UubGluaztcbiAgZGVzaWduU291cmNlLnRhcmdldCA9IFwiX2JsYW5rXCI7XG59XG5cbmZ1bmN0aW9uIGlucHV0TWVhc3VyZW1lbnRzKG1lYXN1cmVtZW50cyl7XG4gIGZvciAoY29uc3QgbWVhc3VyZW1lbnQgaW4gbWVhc3VyZW1lbnRzKSB7XG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgbGFiZWwuZm9yID0gbWVhc3VyZW1lbnQ7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBtZWFzdXJlbWVudHNbbWVhc3VyZW1lbnRdLmxhYmVsO1xuICAgIGlucHV0LnR5cGUgPSBcIm51bWJlclwiO1xuICAgIGlucHV0LmlkID0gbWVhc3VyZW1lbnQ7XG4gICAgaW5wdXQudmFsdWUgPSBgJHttZWFzdXJlbWVudHNbbWVhc3VyZW1lbnRdLnZhbHVlfWA7XG5cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVkcmF3U3RlcHNGcm9tTWVhc3VyZShpbnB1dCwgaW5wdXQudmFsdWUpO1xuICAgIH0pO1xuXG4gICAgbGkuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGxpLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICBtZWFzdXJlbWVudHNMaXN0LmFwcGVuZENoaWxkKGxpKTtcbiAgICBsZXQgbGlXaWR0aCA9IGxpLm9mZnNldFdpZHRoO1xuICAgIGlmIChsaVdpZHRoID4gbGlNYXhXaWR0aCkge1xuICAgICAgbGlNYXhXaWR0aCA9IGxpV2lkdGg7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlucHV0U3RlcHMoc3RlcHMpe1xuICBsZXQgY3VycmVudFN0ZXAgPSAxO1xuICBmb3IgKGNvbnN0IHN0ZXAgb2Ygc3RlcHMpIHtcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGNvbnN0IGluc3RydWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gYFN0ZXAgJHtjdXJyZW50U3RlcH0uKWA7XG4gICAgaW5zdHJ1Y3Rpb24udGV4dENvbnRlbnQgPSBzdGVwO1xuICAgIGxpLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBsaS5hcHBlbmRDaGlsZChpbnN0cnVjdGlvbik7XG4gICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpKTtcbiAgICBjdXJyZW50U3RlcCsrO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpc3RMYXlvdXQoKSB7XG4gIGNvbnN0IGRvY19tZWFzdXJlbWVudHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lYXN1cmVtZW50c0xpc3QnKTtcbiAgY29uc3QgbGlFbGVtZW50cyA9IGRvY19tZWFzdXJlbWVudHNMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG5cbiAgY29uc3QgbGlzdFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jX21lYXN1cmVtZW50c0xpc3QpO1xuICBjb25zdCBsaXN0UGFkZGluZyA9IHBhcnNlRmxvYXQobGlzdFN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQobGlzdFN0eWxlLnBhZGRpbmdSaWdodCk7XG5cbiAgbGlFbGVtZW50cy5mb3JFYWNoKChsaSkgPT4ge1xuICAgIGNvbnN0IGxpV2lkdGggPSBsaS5vZmZzZXRXaWR0aDtcbiAgICBpZiAobGlXaWR0aCA+IGxpTWF4V2lkdGgpIHtcbiAgICAgIGxpTWF4V2lkdGggPSBsaVdpZHRoO1xuICAgIH1cbiAgfSk7XG4gIFxuICBpZiAoZG9jX21lYXN1cmVtZW50c0xpc3Qub2Zmc2V0V2lkdGggPCBsaU1heFdpZHRoICsgbGlzdFBhZGRpbmcpIHtcbiAgICBkb2NfbWVhc3VyZW1lbnRzTGlzdC5jbGFzc0xpc3QuYWRkKCduYXJyb3cnKTtcbiAgfSBlbHNlIHtcbiAgICBkb2NfbWVhc3VyZW1lbnRzTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCduYXJyb3cnKTtcbiAgfVxufVxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdGVwc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RlcHNMaXN0Jyk7XG4gIHN0ZXBzTGlzdC5zY3JvbGxUb3AgPSBzdGVwc0xpc3Quc2Nyb2xsSGVpZ2h0O1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlTGlzdExheW91dCk7XG51cGRhdGVMaXN0TGF5b3V0KCk7XG5cbmlucHV0RGVzaWduKHN0YXR1cy5kZXNpZ24pO1xuaW5wdXRNZWFzdXJlbWVudHMoc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHMpO1xuc3RhdHVzID0gbWFrZVBhdHRlcm4oc3RhdHVzKTtcbmlucHV0U3RlcHMoc3RhdHVzLnBhdHRlcm4uc3RlcHMpO1xuZHJhd1BhdHRlcm4oc3RhdHVzKTtcblxuZnVuY3Rpb24gcmVkcmF3U3RlcHNGcm9tTWVhc3VyZShpbnB1dCwgdmFsdWUpIHtcbiAgc3RlcHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICBzdGF0dXMubWVhc3VyZW1lbnRzW2lucHV0LmlkXS52YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICBzdGF0dXMgPSBtYWtlUGF0dGVybihzdGF0dXMpO1xuICBpbnB1dFN0ZXBzKHN0YXR1cy5wYXR0ZXJuLnN0ZXBzKTtcbiAgZHJhd1BhdHRlcm4oc3RhdHVzKTtcbn1cblxuZGVzaWduU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICBzdGF0dXMuZGVzaWduID0gZGVzaWduc1tkZXNpZ25TZWxlY3QudmFsdWVdO1xuICBzdGF0dXMubWVhc3VyZW1lbnRzID0gc3RhdHVzLmRlc2lnbi5tZWFzdXJlbWVudHM7XG4gIHN0YXR1cy5zdGVwc19mdW5jdGlvbnMgPSBzdGF0dXMuZGVzaWduLnN0ZXBzO1xuICBtZWFzdXJlbWVudHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICBzdGVwc0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gIGlucHV0RGVzaWduKHN0YXR1cy5kZXNpZ24pO1xuICBpbnB1dE1lYXN1cmVtZW50cyhzdGF0dXMuZGVzaWduLm1lYXN1cmVtZW50cyk7XG4gIHN0YXR1cyA9IG1ha2VQYXR0ZXJuKHN0YXR1cyk7XG4gIGlucHV0U3RlcHMoc3RhdHVzLnBhdHRlcm4uc3RlcHMpO1xuICBkcmF3UGF0dGVybihzdGF0dXMpO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRU8sU0FBUyxrQkFBa0JBLFNBQVEsUUFBTztBQUMvQyxRQUFNLFlBQVlBLFFBQU87QUFDekIsU0FBTyxLQUFLLE1BQU0sU0FBUyxTQUFTO0FBQ3RDO0FBRU8sU0FBUyxTQUFTLEdBQUcsR0FBRyxRQUFPO0FBQ3BDLE1BQUksWUFBWSxFQUFDLEdBQUcsT0FBTyxHQUFHLE9BQU8sR0FBRyxPQUFPLEdBQUcsTUFBSztBQUN2RCxNQUFJLFdBQVcsUUFBVTtBQUN2QixhQUFTO0FBQUEsRUFDWCxPQUFPO0FBQ0wsYUFBUyxFQUFDLEdBQUcsV0FBVyxHQUFHLE9BQU07QUFBQSxFQUNuQztBQUNBLE1BQUksUUFBUSxFQUFDLEdBQU0sR0FBTSxPQUFjO0FBQ3ZDLFNBQU87QUFDVDtBQUVPLFNBQVMsUUFBUUEsU0FBUSxPQUFPLEtBQUssUUFBUSxTQUFTLFNBQVMsV0FBVTtBQUM5RSxNQUFJLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQ0EsRUFBQUEsUUFBTyxRQUFRLE1BQU0sS0FBSyxJQUFJO0FBRTlCLFNBQU9BO0FBQ1Q7QUFFTyxTQUFTLGNBQWNBLFNBQVEsUUFBUSxRQUFRLEdBQUcsUUFBTztBQUc5RCxNQUFJLEtBQUssT0FBTztBQUNoQixNQUFJLEtBQUssT0FBTztBQUNoQixNQUFJLEtBQUssT0FBTztBQUNoQixNQUFJLEtBQUssT0FBTztBQUVoQixNQUFJLElBQUksS0FBSyxNQUFNLE1BQU0sS0FBSyxPQUFPLElBQUksT0FBTyxLQUFLLEdBQUc7QUFDeEQsRUFBQUEsVUFBUyxTQUFTLEdBQUcsR0FBRyxNQUFNO0FBRTlCLFNBQU9BO0FBQ1Q7QUFDTyxTQUFT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QUFFQSxPQUFPLFNBQVMsV0FBVztBQUN6QixNQUFJQyxhQUFZLFNBQVMsY0FBYyxZQUFZO0FBQ25ELEVBQUFBLFdBQVUsWUFBWUEsV0FBVTtBQUNsQztBQUVBLE9BQU8saUJBQWlCLFVBQVUsZ0JBQWdCO0FBQ2xELGlCQUFpQjtBQUVqQixZQUFZLE9BQU8sTUFBTTtBQUN6QixrQkFBa0IsT0FBTyxPQUFPLFlBQVk7QUFDNUMsU0FBUyxZQUFZLE1BQU07QUFDM0IsV0FBVyxPQUFPLFFBQVEsS0FBSztBQUMvQixZQUFZLE1BQU07QUFFbEIsU0FBUyx1QkFBdUIsT0FBTyxPQUFPO0FBQzVDLFlBQVUsWUFBWTtBQUN0QixTQUFPLGFBQWEsTUFBTSxFQUFFLEVBQUUsUUFBUSxXQUFXLEtBQUs7QUFDdEQsV0FBUyxZQUFZLE1BQU07QUFDM0IsYUFBVyxPQUFPLFFBQVEsS0FBSztBQUMvQixjQUFZLE1BQU07QUFDcEI7QUFFQSxhQUFhLGlCQUFpQixVQUFVLFdBQVc7QUFDakQsU0FBTyxTQUFTLFFBQVEsYUFBYSxLQUFLO0FBQzFDLFNBQU8sZUFBZSxPQUFPLE9BQU87QUFDcEMsU0FBTyxrQkFBa0IsT0FBTyxPQUFPO0FBQ3ZDLG1CQUFpQixZQUFZO0FBQzdCLFlBQVUsWUFBWTtBQUN0QixjQUFZLE9BQU8sTUFBTTtBQUN6QixvQkFBa0IsT0FBTyxPQUFPLFlBQVk7QUFDNUMsV0FBUyxZQUFZLE1BQU07QUFDM0IsYUFBVyxPQUFPLFFBQVEsS0FBSztBQUMvQixjQUFZLE1BQU07QUFDcEIsQ0FBQzsiLAogICJuYW1lcyI6IFsic3RhdHVzIiwgInN0YXR1cyIsICJzdGVwcyIsICJzdGF0dXMiLCAic3RhdHVzIiwgInN0YXR1cyIsICJzdGF0dXMiLCAibWVhc3VyZW1lbnRzIiwgInN0ZXBzIiwgInN0ZXBzTGlzdCJdCn0K
