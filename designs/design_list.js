import {keystone_bodice} from './keystone_bodice.js';
import {keystone_single} from './keystone_single-breasted-vest.js';
import {keystone_skirt} from './keystone_skirt.js';
import {keystone_collars} from './keystone_collars.js';
import {keystone_plain_sleeve} from './keystone_plain_sleeve.js';
import {modified_plain_sleeve} from './modified_plain_sleeve.js';
import {alice_collar} from './alice_collar.js';
import {alice_sleeve} from './alice_sleeve.js';
import { alice_bodice } from './alice_bodice.js';
import { alice_skirt } from './alice_skirt.js';
import {symington_31400} from './symington_31400.js';

//during development, you can reorder the designs here to put the one you are working on first.
//Please return the designs to this order before submitting a pull request:
// All Alice designs first (alphabedically),
// then Keystone designs (alphabetically)
const designs = [
  alice_skirt,
  //symington_31400,
  alice_bodice,
  alice_sleeve,
  alice_collar,
  keystone_bodice,
  modified_plain_sleeve,
  keystone_skirt,
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
