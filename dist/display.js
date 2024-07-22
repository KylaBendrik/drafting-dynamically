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
