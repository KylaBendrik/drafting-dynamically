import {
  inchesToPrecision,
  toInches,
  half,
  seeDist,
  registerPoints,
  registerPoint,
  registerLabels,
  setPoint,
  setLine,
  setPointLineY,
  setPointLineX,
  setPointAlongLine,
  setPointLineCircle,
  setPointCircleCircle,
  setEquilateralThirdPoint,
  setPointLineLine,
  makeTouchPoint,
  setCurve,
  distPointToPoint,
  distABC,
  printNum,
  printMeasure,
  perimeterEllipse
} from '../pattern.js';
  
  const design_info = {
    title: 'Symington 31400',
    source: {
      link: 'https://imageleicestershire.org.uk/view-item?i=18786&WINID=1754400374410',
      label: 'The Symington Corset Collection',
    },
    designer: 'R. & W.H. Symington and Co. Ltd. - edited by Kyla Bendrik (using instructions by Cathy Hay)'
  }
  
  let measurements = {
    bust: { label: "Bust", value: 36 },
    front_bust: { label: "Front Bust", value: 18.625 },
    underbust_to_nipple: { label: "Underbust to Nipple", value: 2.5 },
    nipple_to_nipple: { label: "Nipple to Nipple", value: 6.5 },
    bust_to_waist: { label: "Bust to Waist", value: 8 },
    waist: { label: "Waist", value: 28 },
    front_waist: { label: "Front Waist", value: 13.75 },
    upper_hip: { label: "Upper Hip", value: 35 },
    front_upper_hip: { label: "Front Upper Hip", value: 16.5 },
    lower_hip: { label: "Lower Hip", value: 40 },
    front_lower_hip: { label: "Front Lower Hip", value: 17 },
    lap: { label: "Lap", value: 5.75 },
    waist_to_base_front: { label: "Waist to Base Front", value: 7.625 },
    waist_to_waist_side: { label: "Waist to Waist Side", value: 5 },
    waist_to_waist_back: { label: "Waist to Waist Back", value: 6 },
    gap: { label: "Gap", value: 1.5 },
  };

  //all distances are in inches * precision
// starting point (in this case 'O') is always 0,0. All other points are defined in relation to this point. Negatives are expected

const steps = [
    {
      description: (_status) => { return 'Point CB is at center back, at the waist line.' },
      action: (status) => {
        //center back
        let pointCB = setPoint(0, 0, {d: true, l: true, u: true});

        status = registerPoints(status,{
          'CB': pointCB
        });
        
        return status;
      }
    },
    {
      description: (_status) => { return 'To figure out how far left to go for the center front, we need to know the longest circumference, half it, and add a little extra (1"), to allow for space between panels.' },
      action: (status) => {
        let pointCB = status.pattern.points['CB'];
        const margin = 16; //to allow for extra space between panels

        let bust = inchesToPrecision(status, measurements.bust.value);
        let waist = inchesToPrecision(status, measurements.waist.value);
        let upperHip = inchesToPrecision(status, measurements.upper_hip.value);
        let lowerHip = inchesToPrecision(status, measurements.lower_hip.value);

        let gap = inchesToPrecision(status, measurements.gap.value);

        let longestCircumference = Math.max(bust, waist, upperHip, lowerHip);
        let halfCircumference = half(longestCircumference, gap);


        let pointCF = setPoint(pointCB.x -halfCircumference - margin, 0, {d: true, u: true});

        status = registerPoints(status,{
          'CF': pointCF
        });


        return status;
      }
    },
    {
      description: (_status) => { return 'Point S is at the side seam, at the waist line, halfway between CB and CF.' },
      action: (status) => {
        let pointCB = status.pattern.points['CB'];
        let pointCF = status.pattern.points['CF'];

        let pointS = setPoint((pointCB.x + pointCF.x) / 2, 0, {d: true, u: true});

        status = registerPoints(status,{
          'S': pointS
        });

        return status;
      }

    },
    {
      description: (_status) => { return 'Point B is above point CF, at the bust level (bust to waist distance above the waist line).' },
      action: (status) => {
        let pointCF = status.pattern.points['CF'];
        let bustToWaist = inchesToPrecision(status, measurements.bust_to_waist.value);

        let pointB = setPoint(pointCF.x, pointCF.y - bustToWaist, {r: true});

        status = registerPoints(status,{
          'B': pointB
        });

        return status;
      }
    },
    {
      description: (_status) => { return 'Point UH is 3" below point CF, and point LH is 3" below UH.' },
      action: (status) => {
        let pointCF = status.pattern.points['CF'];
        let dist = inchesToPrecision(status, 3);
        let pointUH = setPoint(pointCF.x, pointCF.y + dist, {r: true});
        let pointLH = setPoint(pointCF.x, pointUH.y + dist, {r: true});

        status = registerPoints(status,{
          'UH': pointUH,
          'LH': pointLH
        });

        return status;
      }
    },
    {
      description: (_status) => { return 'There are 9 panels in this corset. The center front and center back panels are aligned with the vertical lines. The other panels need angled guide lines. First, we will place the points along the waist, as percentages right from CF. 2: 14%, 28%, 36%, 48%, 60%, 71%, 81%' },
      action: (status) => {
        let pointCF = status.pattern.points['CF'];
        let cftocb = distPointToPoint(pointCF, status.pattern.points['CB']);
        let panelCenters = [0.14, 0.28, 0.36, 0.48, 0.60, 0.71, 0.81].map(p => Math.round(cftocb * p));

        panelCenters.forEach((center, index) => {
          //let point = setPoint(pointCF.x + center, pointCF.y);
          status = registerPoints(status, {[`${index + 2}w`]: setPoint(pointCF.x + center, pointCF.y)});
        });

        return status;
      }
    },
    {
      description: (_status) => { return 'Now we will draw the angled guide lines from each of the panel points to the bust line. The angles are clockwise from vertical, and are as follows: 2: 20°, 3: 22°, 4: 22°, 5: 19°, 6: 12°, 7: 8°, 8: 5°' },
      action: (status) => {
        let angles = [0, 20, 22, 22, 19, 12, 8, 5];
        let points = Object.keys(status.pattern.points).filter(key => key.endsWith('w'));

        let pointB = status.pattern.points['B'];
        let distWaistToBust = distPointToPoint(status.pattern.points['CF'], pointB);

        points.forEach((pointKey, index) => {
          let point = status.pattern.points[pointKey];
          let angle = angles[index + 1]; // skip the first one, which is 0
          let radians = angle * (Math.PI / 180);
          // calculate dist x and dist y based on angle
          let distX = Math.tan(radians) * distWaistToBust;

          let newPoint = setPoint(point.x + distX, pointB.y);
          status = registerPoints(status, {[`${index + 2}b`]: newPoint});
        });



        status = setLine(status, '2w', '2b', 'dashed');
        return status;
      }
    },
    {
      description: (_status) => { return 'Now we will follow the angled lines for panels 3-8 down to the lower hip line. The angles are the same as above.' },
      action: (status) => {
        let points = Object.keys(status.pattern.points).filter(key => key.endsWith('w'));
        //remove the first one, which is 2w
        points.shift();
        let lowerHip = status.pattern.points['LH'];

        points.forEach((pointKey, index) => {
          let pointAtWaist = status.pattern.points[pointKey];
          let pointAtBust = status.pattern.points[`${index + 3}b`];

          let newPoint = setPointLineY(status, pointAtBust, pointAtWaist, lowerHip.y);
          status = registerPoints(status, {[`${index + 3}l`]: newPoint});
        });
        status = setLine(status, '3b', '3l', 'dashed');
        status = setLine(status, '4b', '4l', 'dashed');
        status = setLine(status, '5b', '5l', 'dashed');
        status = setLine(status, '6b', '6l', 'dashed');
        status = setLine(status, '7b', '7l', 'dashed');
        status = setLine(status, '8b', '8l', 'dashed');

        return status;
      }
    }, 
    {
      description: (_status) => { return 'Now we will place the point for the front waist, on either side of the guide points. (32%, 3%, 2%, 10%, 8%, 15%, 15%, 8%, 7%)' },
      action: (status) => {
        let pointCF = status.pattern.points['CF'];
        let frontWaist = inchesToPrecision(status, measurements.front_waist.value) / 2 ;
        let point2w = status.pattern.points['2w'];
        let point3w = status.pattern.points['3w'];
        let point4w = status.pattern.points['4w'];
        let point5w = status.pattern.points['5w'];

        let distances = [0.32, 0.03, 0.02, 0.10, 0.08, 0.15, 0.15, 0.08, 0.07].map(p => frontWaist * p);

        let point1rw = setPoint(pointCF.x + distances[0], pointCF.y); // labeling this as 1rw, because it is the right side of the first panel, at the waist
        let point2lw = setPoint(point2w.x - distances[1], point2w.y);
        let point2rw = setPoint(point2w.x + distances[2], point2w.y);
        let point3lw = setPoint(point3w.x - distances[1], point3w.y);
        let point3rw = setPoint(point3w.x + distances[2], point3w.y);
        let point4lw = setPoint(point4w.x - distances[3], point4w.y);
        let point4rw = setPoint(point4w.x + distances[4], point4w.y);
        let point5lw = setPoint(point5w.x - distances[3], point5w.y);
        let point5rw = setPoint(point5w.x + distances[4], point5w.y);

        status = registerPoints(status, {
          '1rw': point1rw,
          '2lw': point2lw,
          '2rw': point2rw,
          '3lw': point3lw,
          '3rw': point3rw,
          '4lw': point4lw,
          '4rw': point4rw,
          '5lw': point5lw,
          '5rw': point5rw
        });

        return status;
      }
    },
]

export const symington_31400 = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}