import {keystone_bodice} from './keystone_bodice.js';
import {keystone_single} from './keystone_single-breasted-vest.js';
import {keystone_collars} from './keystone_collars.js';
import {keystone_plain_sleeve} from './keystone_plain_sleeve.js';
import {modified_plain_sleeve} from './modified_plain_sleeve.js';
import {alice_collar} from './alice_collar.js';
import {alice_slim_sleeve} from './alice_slim_sleeve.js';
import {alice_yoke } from './alice_yoke.js';
import { alice_bodice_lining } from './alice_bodice_lining.js';

const designs = [
  alice_bodice_lining,
  alice_yoke,
  alice_collar,
  keystone_bodice,
  alice_slim_sleeve,
  modified_plain_sleeve,
  keystone_single,
  keystone_collars,
  keystone_plain_sleeve,
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
