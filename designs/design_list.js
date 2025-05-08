import {keystone_bodice} from './keystone_bodice.js';
import {keystone_single} from './keystone_single-breasted-vest.js';
import {keystone_collars} from './keystone_collars.js';
import {keystone_plain_sleeve} from './keystone_plain_sleeve.js';

const designs = [
  keystone_bodice,
  keystone_single,
  keystone_collars,
  keystone_plain_sleeve
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
