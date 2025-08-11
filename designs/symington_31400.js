import {
  H,
  inchesToPrecision,
  toInches,
  measure,
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
    underbust_to_nipple: { label: "Underbust to Nipple", value: 3 },
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
        const margin = inchesToPrecision(status, 3.5); //to allow for extra space between panels

        let bust = inchesToPrecision(status, H.bust(status));
        let waist = inchesToPrecision(status, H.waist(status));
        let upperHip = inchesToPrecision(status, H.upper_hip(status));
        let lowerHip = inchesToPrecision(status, H.lower_hip(status));

        let gap = inchesToPrecision(status, H.gap(status));

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
      description: (_status) => { return 'Point B is above point CF, at the bust level (86% of the bust to waist distance above the waist line). This is because the "actual" bust point is above this guide line.' },
      action: (status) => {
        let pointCF = status.pattern.points['CF'];
        let bustToWaist = inchesToPrecision(status, status.measurements.bust_to_waist.value);

        let pointB = setPoint(pointCF.x, pointCF.y - bustToWaist * 0.85, {r: true});

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

        return status;
      }
    },
    {
      description: (_status) => { return 'Now we will follow the angled lines for panels 3-8 down to the upper and lower hip lines. The angles are the same as above.' },
      action: (status) => {
        let points = Object.keys(status.pattern.points).filter(key => key.endsWith('w'));
        //remove the first one, which is 2w
        points.shift();
        let lowerHip = status.pattern.points['LH'];
        let upperHip = status.pattern.points['UH'];

        points.forEach((pointKey, index) => {
          let pointAtWaist = status.pattern.points[pointKey];
          let pointAtBust = status.pattern.points[`${index + 3}b`];

          let newPoint = setPointLineY(status, pointAtBust, pointAtWaist, lowerHip.y);
          status = registerPoints(status, {[`${index + 3}lh`]: newPoint});
        });
        points.forEach((pointKey, index) => {
          let pointAtWaist = status.pattern.points[pointKey];
          let pointAtBust = status.pattern.points[`${index + 3}b`];

          let newPoint = setPointLineY(status, pointAtBust, pointAtWaist, upperHip.y);
          status = registerPoints(status, {[`${index + 3}uh`]: newPoint});
        });
        //bust to waist
        status = setLine(status, '2b', '2w', 'dashed');
        status = setLine(status, '3b', '3w', 'dashed');
        status = setLine(status, '4b', '4w', 'dashed');
        status = setLine(status, '5b', '5w', 'dashed');
        status = setLine(status, '6b', '6w', 'dashed');
        status = setLine(status, '7b', '7w', 'dashed');
        status = setLine(status, '8b', '8w', 'dashed');

        //waist to upper hip
        status = setLine(status, '3w', '3uh', 'dashed');
        status = setLine(status, '4w', '4uh', 'dashed');
        status = setLine(status, '5w', '5uh', 'dashed');
        status = setLine(status, '6w', '6uh', 'dashed');
        status = setLine(status, '7w', '7uh', 'dashed');
        status = setLine(status, '8w', '8uh', 'dashed');

        //upper hip to lower hip
        status = setLine(status, '3uh', '3lh', 'dashed');
        status = setLine(status, '4uh', '4lh', 'dashed');
        status = setLine(status, '5uh', '5lh', 'dashed');
        status = setLine(status, '6uh', '6lh', 'dashed');
        status = setLine(status, '7uh', '7lh', 'dashed');
        status = setLine(status, '8uh', '8lh', 'dashed');

        return status;
      }
    }, 
    {
      description: (_status) => { return 'Now we will place the point for the front waist, on either side of the guide points. (32%, 3%, 2%, 10%, 8%, 15%, 15%, 8%, 7%)' },
      action: (status) => {
        let pointCF = status.pattern.points['CF'];
        let frontWaist = inchesToPrecision(status, half(status.measurements.front_waist.value, 0)); //no gap for the fronts
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
    {
      description: (_status) => { return 'Now we will place the point for the back waist, on either side of the guide points. (14%, 14% 7%, 6%, 14%, 14%, 29% )' },
      action: (status) => {
        let pointCB = status.pattern.points['CB'];
        let backWaist = inchesToPrecision(status, half(H.waist(status) - status.measurements.front_waist.value, status.measurements.gap.value));
        let point6w = status.pattern.points['6w'];
        let point7w = status.pattern.points['7w'];
        let point8w = status.pattern.points['8w'];

        let distances = [0.14, 0.14, 0.07, 0.06, 0.14, 0.14, 0.29].map(p => backWaist * p);

        let point6lw = setPoint(point6w.x - distances[0], point6w.y);
        let point6rw = setPoint(point6w.x + distances[1], point6w.y);
        let point7lw = setPoint(point7w.x - distances[2], point7w.y);
        let point7rw = setPoint(point7w.x + distances[3], point7w.y);
        let point8lw = setPoint(point8w.x - distances[4], point8w.y);
        let point8rw = setPoint(point8w.x + distances[5], point8w.y);
        let point9rw = setPoint(pointCB.x - distances[6], pointCB.y); // labeling this as 9rw, because it is the right side of the last panel, at the waist

        status = registerPoints(status, {
          '6lw': point6lw,
          '6rw': point6rw,
          '7lw': point7lw,
          '7rw': point7rw,
          '8lw': point8lw,
          '8rw': point8rw,
          '9lw': point9rw
        });

        return status;
      }
    },
    {
      description: (_status) => { return 'Now we will find the points for the bust line. First, the front bust: (36%, 17%, 20%, 16%, 11%), then the back bust: (8%, 8%, 8%, 6%, 9%, 9%, 10%, 8%, 9%, 9%, 18%)' },
      action: (status) => {
        let pointB = status.pattern.points['B'];
        let pointCB = status.pattern.points['CB'];
        let frontBust = inchesToPrecision(status, half(status.measurements.front_bust.value, 0)); //no gap for the fronts
        let backBust = inchesToPrecision(status, half(status.measurements.bust.value - status.measurements.front_bust.value, status.measurements.gap.value));

        let frontDistances = [0.36, 0.17, 0.20, 0.16, 0.11].map(p => frontBust * p);
        let backDistances = [0.08, 0.08, 0.08, 0.06, 0.09, 0.09, 0.10, 0.08, 0.09, 0.09, 0.18].map(p => backBust * p);

        let point2b = status.pattern.points['2b'];
        let point3b = status.pattern.points['3b'];
        let point4b = status.pattern.points['4b'];
        let point5b = status.pattern.points['5b'];
        let point6b = status.pattern.points['6b'];
        let point7b = status.pattern.points['7b'];
        let point8b = status.pattern.points['8b'];

        let point1rb = setPoint(pointB.x + frontDistances[0], pointB.y);
        let point2lb = setPoint(point2b.x - frontDistances[1], pointB.y);
        let point2rb = setPoint(point2b.x + frontDistances[2], pointB.y);
        let point3lb = setPoint(point3b.x - frontDistances[3], pointB.y);
        let point3rb = setPoint(point3b.x + frontDistances[4], pointB.y);

        let point4lb = setPoint(point4b.x - backDistances[0], pointB.y);
        let point4rb = setPoint(point4b.x + backDistances[1], pointB.y);
        let point5lb = setPoint(point5b.x - backDistances[2], pointB.y);
        let point5rb = setPoint(point5b.x + backDistances[3], pointB.y);
        let point6lb = setPoint(point6b.x - backDistances[4], pointB.y);
        let point6rb = setPoint(point6b.x + backDistances[5], pointB.y);
        let point7lb = setPoint(point7b.x - backDistances[6], pointB.y);
        let point7rb = setPoint(point7b.x + backDistances[7], pointB.y);
        let point8lb = setPoint(point8b.x - backDistances[8], pointB.y);
        let point8rb = setPoint(point8b.x + backDistances[9], pointB.y);
        let point9lb = setPoint(pointCB.x - backDistances[10], pointB.y); // labeling this as 9lb, because it is the left side of the last panel, at the bust
        let point9rb = setPoint(pointCB.x, pointB.y); // labeling this as 9rb, because it is the right side of the last panel, at the bust

        status = registerPoints(status, {
          '1rb': point1rb,
          '2lb': point2lb,
          '2rb': point2rb,
          '3lb': point3lb,
          '3rb': point3rb,
          '4lb': point4lb,
          '4rb': point4rb,
          '5lb': point5lb,
          '5rb': point5rb,
          '6lb': point6lb,
          '6rb': point6rb,
          '7lb': point7lb,
          '7rb': point7rb,
          '8lb': point8lb,
          '8rb': point8rb,
          '9lb': point9lb,
          '9rb': point9rb
        });

      return status;
      }

    },
    {
      description: (_status) => { return 'Now we will draw the points for the upper hip line. The points for the front are (29%, 8%, 9%, 10%, 10%, 13%, 20%), and for the back (11%, 11%, 12%, 14%, 11%, 11%, 30%)' },
      action: (status) => {
        let pointUH = status.pattern.points['UH'];
        let pointCB = status.pattern.points['CB'];

        let frontUpperHip = inchesToPrecision(status, half(status.measurements.front_upper_hip.value, 0)); //no gap for the fronts
        let backUpperHip = inchesToPrecision(status, half(status.measurements.upper_hip.value - status.measurements.front_upper_hip.value, status.measurements.gap.value));

        let frontDistances = [0.29, 0.08, 0.09, 0.10, 0.10, 0.13, 0.20].map(p => frontUpperHip * p);
        let backDistances = [0.11, 0.11, 0.12, 0.14, 0.11, 0.11, 0.30].map(p => backUpperHip * p);

        let point3uh = status.pattern.points['3uh'];
        let point4uh = status.pattern.points['4uh'];
        let point5uh = status.pattern.points['5uh'];
        let point6uh = status.pattern.points['6uh'];
        let point7uh = status.pattern.points['7uh'];
        let point8uh = status.pattern.points['8uh'];

        let point1ruh = setPoint(pointUH.x + frontDistances[0], pointUH.y);
        let point3luh = setPoint(point3uh.x - frontDistances[1], pointUH.y);
        let point3ruh = setPoint(point3uh.x + frontDistances[2], pointUH.y);
        let point4luh = setPoint(point4uh.x - frontDistances[3], pointUH.y);
        let point4ruh = setPoint(point4uh.x + frontDistances[4], pointUH.y);
        let point5luh = setPoint(point5uh.x - frontDistances[5], pointUH.y);
        let point5ruh = setPoint(point5uh.x + frontDistances[6], pointUH.y);

        let point6luh = setPoint(point6uh.x - backDistances[0], pointUH.y);
        let point6ruh = setPoint(point6uh.x + backDistances[1], pointUH.y);
        let point7luh = setPoint(point7uh.x - backDistances[2], pointUH.y);
        let point7ruh = setPoint(point7uh.x + backDistances[3], pointUH.y);
        let point8luh = setPoint(point8uh.x - backDistances[4], pointUH.y);
        let point8ruh = setPoint(point8uh.x + backDistances[5], pointUH.y);
        let point9luh = setPoint(pointCB.x - backDistances[6], pointUH.y); // labeling this as 9luh, because it is the left side of the last panel, at the upper hip
        let point9ruh = setPoint(pointCB.x, pointUH.y); // labeling this as 9ruh, because it is the right side of the last panel, at the upper hip

        status = registerPoints(status, {
          '1ruh': point1ruh,
          '3luh': point3luh,
          '3ruh': point3ruh,
          '4luh': point4luh,
          '4ruh': point4ruh,
          '5luh': point5luh,
          '5ruh': point5ruh,
          '6luh': point6luh,
          '6ruh': point6ruh,
          '7luh': point7luh,
          '7ruh': point7ruh,
          '8luh': point8luh,
          '8ruh': point8ruh,
          '9luh': point9luh,
          '9ruh': point9ruh
        });

        return status;
      }
    },
    {
      description: (_status) => { return 'Now we will draw the points for the lower hip line. The points for the front are (28%, 2%, 13%, 8%, 8%, 14%, 27%) and for the back (9%, 9%, 18%, 17%, 9%, 9%, 29%)' },
      action: (status) => {
        let pointLH = status.pattern.points['LH'];
        let pointCB = status.pattern.points['CB'];

        let frontLowerHip = inchesToPrecision(status, half(status.measurements.front_lower_hip.value, 0)); //no gap for the fronts
        let backLowerHip = inchesToPrecision(status, half(status.measurements.lower_hip.value - status.measurements.front_lower_hip.value, status.measurements.gap.value));

        let frontDistances = [0.28, 0.02, 0.13, 0.08, 0.08, 0.14, 0.27].map(p => frontLowerHip * p);
        let backDistances = [0.09, 0.09, 0.18, 0.17, 0.09, 0.09, 0.29].map(p => backLowerHip * p);

        let point3lh = status.pattern.points['3lh'];
        let point4lh = status.pattern.points['4lh'];
        let point5lh = status.pattern.points['5lh'];
        let point6lh = status.pattern.points['6lh'];
        let point7lh = status.pattern.points['7lh'];
        let point8lh = status.pattern.points['8lh'];

        let point1rlh = setPoint(pointLH.x + frontDistances[0], pointLH.y);
        let point3llh = setPoint(point3lh.x - frontDistances[1], pointLH.y);
        let point3rlh = setPoint(point3lh.x + frontDistances[2], pointLH.y);
        let point4llh = setPoint(point4lh.x - frontDistances[3], pointLH.y);
        let point4rlh = setPoint(point4lh.x + frontDistances[4], pointLH.y);
        let point5llh = setPoint(point5lh.x - frontDistances[5], pointLH.y);
        let point5rlh = setPoint(point5lh.x + frontDistances[6], pointLH.y);

        let point6llh = setPoint(point6lh.x - backDistances[0], pointLH.y);
        let point6rlh = setPoint(point6lh.x + backDistances[1], pointLH.y);
        let point7llh = setPoint(point7lh.x - backDistances[2], pointLH.y);
        let point7rlh = setPoint(point7lh.x + backDistances[3], pointLH.y);
        let point8llh = setPoint(point8lh.x - backDistances[4], pointLH.y);
        let point8rlh = setPoint(point8lh.x + backDistances[5], pointLH.y);
        let point9llh = setPoint(pointCB.x - backDistances[6], pointLH.y); // labeling this as 9llh, because it is the left side of the last panel, at the lower hip
        let point9rlh = setPoint(pointCB.x, pointLH.y); // labeling this as 9rlh, because it is the right side of the last panel, at the lower hip  

        status = registerPoints(status, {
          '1rlh': point1rlh,
          '3llh': point3llh,
          '3rlh': point3rlh,  
          '4llh': point4llh,
          '4rlh': point4rlh,
          '5llh': point5llh,
          '5rlh': point5rlh,
          '6llh': point6llh,
          '6rlh': point6rlh,
          '7llh': point7llh,
          '7rlh': point7rlh,
          '8llh': point8llh,
          '8rlh': point8rlh,
          '9llh': point9llh,
          '9rlh': point9rlh
        });

        //pieces 4-9 are mostly done. So let's set the curves and lines.
        //pieces 4, 6, and 8 are all straight lines, so we can just set the lines
        status = setLine(status, '4lb', '4llh');
        status = setLine(status, '4rb', '4rlh');
        status = setLine(status, '6lb', '6llh');
        status = setLine(status, '6rb', '6rlh');
        status = setLine(status, '8lb', '8llh');
        status = setLine(status, '8rb', '8rlh');

        //pieces 5, 7, and 9 are curves, so we will set the curves
        let g1 = 0.35;
        let g2 = g1 + ((1-g1) / 2) + 0.07; //this is the ratio of the curve, so that it is symmetrical
        console.log('g1', g1, 'g2', g2);
        status = setCurve(status, {s: '5lb', g1: '5lw', g2: '5luh', e: '5llh'}, [g1, g2]);
        status = setCurve(status, {s: '5rb', g1: '5rw', g2: '5ruh', e: '5rlh'}, [g1, g2]);
        status = setCurve(status, {s: '7lb', g1: '7lw', g2: '7luh', e: '7llh'}, [g1, g2]);
        status = setCurve(status, {s: '7rb', g1: '7rw', g2: '7ruh', e: '7rlh'}, [g1, g2]);
        status = setCurve(status, {s: '9lb', g1: '9lw', g2: '9luh', e: '9llh'}, [g1, g2]);
        status = setLine(status, '9rb', '9rlh');


        return status;
    }
  },
  {
    description: (_status) => { return 'Now we will draw the under bust line. First, go down from the bust line to the underbust level, by the nipple to underbust distance.' },
    action: (status) => {
      let pointB = status.pattern.points['B'];
      let underbustToNipple = inchesToPrecision(status, status.measurements.underbust_to_nipple.value);
      let pointUB = setPoint(pointB.x, pointB.y + underbustToNipple, {r: true});

      //find 2ub and 3ub, which are the points on the underbust line, following their guide lines
      let point2b = status.pattern.points['2b'];
      let point2w = status.pattern.points['2w'];
      let point3b = status.pattern.points['3b'];
      let point3w = status.pattern.points['3w'];

      let point2ub = setPointLineY(status, point2b, point2w, pointUB.y);
      let point3ub = setPointLineY(status, point3b, point3w, pointUB.y);

      status = registerPoints(status,{
        'UB': pointUB,
        '2ub': point2ub,
        '3ub': point3ub
      });



      return status;
    }  
  },
  {
    description: (_status) => { return 'Now we will draw the points for the underbust line. Since this measurement is hard to pinpoint on the original, these are percentages of (fb + fb + fw) / 3, so they will not add up to 100%. (39%, 6%, 16%, 8%, 14%)' },
    action: (status) => {
      let point2ub = status.pattern.points['2ub'];
      let point3ub = status.pattern.points['3ub'];
      let pointUB = status.pattern.points['UB'];

      //find the average of the front waist and front bust (halves of each)
      let frontwaist = inchesToPrecision(status, status.measurements.front_waist.value) / 2;
      let frontbust = inchesToPrecision(status, status.measurements.front_bust.value) / 2;
      let avgFront = (frontwaist + frontbust) / 2;

      let distances = [0.39, 0.06, 0.16, 0.08, 0.14].map(p => avgFront * p);

      //set the points for the underbust line
      let point1rub = setPoint(pointUB.x + distances[0], pointUB.y);
      let point2lub = setPoint(point2ub.x - distances[1], point2ub.y);
      let point2rub = setPoint(point2ub.x + distances[2], point2ub.y);
      let point3lub = setPoint(point3ub.x - distances[3], point3ub.y);
      let point3rub = setPoint(point3ub.x + distances[4], point3ub.y);


      status = registerPoints(status,{
        '2ub': point2ub,
        '3ub': point3ub,
        '1rub': point1rub,
        '2lub': point2lub,
        '2rub': point2rub,
        '3lub': point3lub,
        '3rub': point3rub
      });

      return status;
    }
  },

  {
    description: (_status) => { return `Let's finish panel 1. Point a is 2" down from the underbust line, at the same x as 1rw. Draw from a to 1rw, 1ruh, and 1rlh.` },
    action: (status) => {
      let distDown = inchesToPrecision(status, 2);
      let pointUB = status.pattern.points['UB'];
      let point1rw = status.pattern.points['1rw'];
      let pointA = setPoint(point1rw.x, pointUB.y + distDown);
      status = registerPoints(status, {
        'a': pointA
      });
      status = setCurve(status, {s: 'a', g1: '1rw', g2: '1ruh', e: '1rlh'}, [0.35, 0.65]);

      return status;
    }
  },
  {
    description: (_status) => { return `Next, go down from CF to the center base, using the waist to base front measurement. Then, draw a line from 1rlh to the center base.` },
    action: (status) => {
      let point1rlh = status.pattern.points['1rlh'];
      let pointCF = status.pattern.points['CF'];
      let centerBase = setPoint(pointCF.x, pointCF.y + inchesToPrecision(status, status.measurements.waist_to_base_front.value));
      status = registerPoints(status, {
        '1cf': centerBase
      });
      status = setLine(status, '1rlh', '1cf');
      status = setLine(status, 'B', '1cf');

      return status;
    }
  },
  {
    description: (_status) => { return `The top point of the bust is a percentage of the bust to waist distance: 14% up from 1rb.` },
    action: (status) => {
      let point1rb = status.pattern.points['1rb'];
      let bustToWaist = inchesToPrecision(status, status.measurements.bust_to_waist.value);
      let distUp = bustToWaist * 0.14; // 14% of bust to waist distance

      let pointTopBust = setPoint(point1rb.x, point1rb.y - distUp, {r: true});
      status = registerPoints(status, {
        '1rtb': pointTopBust
      });

      status = setLine(status, 'B', '1rtb');
      status = setCurve(status, {s: '1rtb', g1: '1rb', g2: '1rub', e: 'a'}, [0.15, 0.7]);

      return status;
    }
  },
  {
    description: (_status) => { return `Now we will finish panel 2. Point 2rib is at the same level as point a at the guide line.` },
    action: (status) => {
      let point2w = status.pattern.points['2w'];
      let point2b = status.pattern.points['2b'];
      let pointA = status.pattern.points['a'];
      let point2rib = setPointLineY(status, point2b, point2w, pointA.y);
      status = registerPoints(status, {
        '2r': point2rib
      });
      return status;
    }
  },
  {
    description: (_status) => { return `Point b is left of 2r, at a percentage of front waist: 17%` },
    action: (status) => {
      let point2r = status.pattern.points['2r'];
      let point2w = status.pattern.points['2w'];
      let distB = inchesToPrecision(status, status.measurements.front_waist.value / 2) * 0.17; // 17% of front waist
      let pointb = setPoint(point2r.x - distB, point2r.y);

      status = registerPoints(status, {
        'b': pointb,
      });
      return status;
    }
  },
  {
    description: (_status) => { return `To find the top and bottom of panel 2, find the length of the guideline between the waist and bust. Then, follow the line 7% below the waist (2z), and 13% above the bust (2ct). 15% above the bust is 2al, only 9% above the bust is 2ar.` },
    action: (status) => {
      let point2w = status.pattern.points['2w'];
      let point2b = status.pattern.points['2b'];
      let distWaistToBust = distPointToPoint(point2w, point2b);
      let dist2z = distWaistToBust * 0.07; // 7% below waist
      let dist2ct = distWaistToBust * 0.13; // 13% above bust for center top
      let dist2al = distWaistToBust * 0.15; // 15% above bust for left side
      let dist2ar = distWaistToBust * 0.09; // 9% above bust for the center point to find the right side

      let point2z = setPointAlongLine(status, point2b, point2w, toInches(status, distWaistToBust + dist2z));
      let point2ct = setPointAlongLine(status, point2w, point2b, toInches(status, distWaistToBust + dist2ct));
      let point2al = setPointAlongLine(status, point2w, point2b, toInches(status, distWaistToBust + dist2al));
      let point2ar = setPointAlongLine(status, point2w, point2b, toInches(status, distWaistToBust + dist2ar));

      status = registerPoints(status, {
        '2ct': point2ct, //center top of panel 2
        '2z': point2z,
        '2al': point2al,
        '2ar': point2ar
      });

      status = setLine(status, 'b', '2z');
      return status;
    }
  },
  {
    description: (_status) => { return `To finish the top of panel 2, got left from 2al to find 2lt, using 110% of the distance from 2lb to 2b. To find the 2rt, follow the line from 2lt through 2ar, going the same distance.`},
    action: (status) => {
      let point2lb = status.pattern.points['2lb'];
      let point2b = status.pattern.points['2b'];
      let point2al = status.pattern.points['2al'];
      let point2ar = status.pattern.points['2ar'];

      let distLeft = distPointToPoint(point2lb, point2b) * 1.1; // 110% of the distance from 2lb to 2b
      let point2lt = setPoint(point2al.x - distLeft, point2al.y);

      let distRight = toInches(status, distPointToPoint(point2lt, point2ar));

      let point2rt = setPointAlongLine(status, point2lt, point2ar, distRight * 2); // go the same distance from 2lt through 2ar

      status = registerPoints(status, {
        '2lt': point2lt,
        '2rt': point2rt
      });

      status = setLine(status, '2lt', '2rt', 'dashed');
      status = setCurve(status, {s: '2lt', g: '2ct', e: '2rt'}, 0.5);
      status = setCurve(status, {s: '2lt', g1: '2lb', g2: '2lub', e: 'b'}, [0.19, 0.7]);
      status = setCurve(status, {s: '2rt', g: '2rub', e: '2z'}, 0.5);

      let pointB = status.pattern.points['B'];
      let point1rtb = status.pattern.points['1rtb'];

      seeDist(status, distPointToPoint(point1rtb, pointB), 'bust point');


      return status;
    }
  }
]

export const symington_31400 = {
  design_info: design_info,
  measurements: measurements,
  steps: steps
}