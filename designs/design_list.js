import keystone_single from './keystone_single-breasted-vest.js';

const designs = [
  keystone_single
].map((design) => {
  return {
    label: design.design_info.title,
    design_info: design.design_info,
    measurements: design.measurements,
    points: design.points,
    steps: design.steps
  };
});

export { designs };
