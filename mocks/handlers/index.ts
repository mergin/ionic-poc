export { socialMediaHandlers } from './posts';
export { picsumHandlers } from './picsum';
export { weatherHandlers } from './weather';

import { picsumHandlers } from './picsum';
import { socialMediaHandlers } from './posts';
import { weatherHandlers } from './weather';

export const handlers = [...socialMediaHandlers, ...picsumHandlers, ...weatherHandlers];
