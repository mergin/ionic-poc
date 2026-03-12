export { socialMediaHandlers } from './posts';
export { picsumHandlers } from './picsum';

import { picsumHandlers } from './picsum';
import { socialMediaHandlers } from './posts';

export const handlers = [...socialMediaHandlers, ...picsumHandlers];
