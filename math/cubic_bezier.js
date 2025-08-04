// accepts a curve object with s, g1, g2, t1, t2, c1 and c2. 
// returns a curve object with the same properties.
// This overarching function makes sure there are c1 and c2 properties
// and that they are set to the correct values.
export function cubicBezier(curve) {
  //prepare c1 and c2 as objects with x and y properties, both set to 0
  let c1 = {
    x: 0,
    y: 0
  }
  let c2 = {
    x: 0,
    y: 0
  }
  let t1 = curve.times[0];
  let t2 = curve.times[1];

    // return the curve object with c1 and c2 properties set to the correct values
    c1 = {
      x: findC1(curve.s.x, curve.e.x, curve.g1.x, curve.g2.x, t1, t2),
      y: findC1(curve.s.y, curve.e.y, curve.g1.y, curve.g2.y, t1, t2)
    };
    c2 = {
      x: findC2(curve.s.x, curve.e.x, curve.g1.x, t1, c1.x),
      y: findC2(curve.s.y, curve.e.y, curve.g1.y, t1, c1.y)
    };

      //estimate t1 and t2, just in case the editor doesn't know what to set.
      let times = estimateTimes(curve.s, curve.e, curve.g1, curve.g2);
      console.log(`estimate times for ${curve.s.label}-${curve.g1.label}-${curve.g2.label}-${curve.e.label}: ${times}`);

    return {
      s: curve.s,
      e: curve.e,
      g1: curve.g1,
      g2: curve.g2,
      t1: curve.t1,
      t2: curve.t2,
      c1: c1,
      c2: c2
    };
}

function estimateTimes(s, e, g1, g2, rounding = 3) {
  //literally just return the estimated times. This is ONLY for designers
  //to see what the times are. 
  //This is not a function that should be used in production code.

  //measure the distance between s and g1
  const d1 = Math.sqrt((g1.x - s.x) ** 2 + (g1.y - s.y) ** 2);
  //measure the distance between g1 and g2
  const d2 = Math.sqrt((g2.x - g1.x) ** 2 + (g2.y - g1.y) ** 2);
  //measure the distance between g2 and e
  const d3 = Math.sqrt((e.x - g2.x) ** 2 + (e.y - g2.y) ** 2); 
  //total distance
  const d = d1 + d2 + d3;
  //estimate t1 and t2 based on the distance
  let t1 = d1 / d;
  let t2 = (d1 + d2) / d;

  //round t1 and t2 to the specified number of decimal places
  t1 = Math.round(t1 * (10 ** rounding)) / (10 ** rounding);
  t2 = Math.round(t2 * (10 ** rounding)) / (10 ** rounding);
  return (`t1: ${t1}, t2: ${t2}`);
}

function A(t){
  return (1 - t) ** 3;
}
function B(t){
  return 3 * t * (1 - t) ** 2;
}
function C(t){
  return 3 * (1 - t) * (t ** 2);
}

function D(t){
  return t ** 3;
}

function E(s, e, g, t) {
  return (g - s * A(t) - e * D(t)) / B(t);
};

function F(s, e, g_2, t_1, t_2) {
  return (C(t_1) * (g_2 - s * A(t_2) - e * D(t_2))) / (B(t_1) * C(t_2));
};

function findC1(s, e, g_1, g_2, t_1, t_2) {
  //console.log("findC1", s, e, g_1, g_2, t_1, t_2);
  const e_for_c = E(s, e, g_1, t_1);
  const f_for_c = F(s, e, g_2, t_1, t_2);

  return Math.round(((e_for_c - f_for_c) * B(t_1) * C(t_2)) / (B(t_1) * C(t_2) - B(t_2) * C(t_1)));
};

function findC2(s, e, g, t, c_1) {
  return Math.round((g - s * A(t) - c_1 * B(t) - e * D(t)) / C(t));
};

