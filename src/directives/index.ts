// src/directives/index.ts

import clickOutside from '@/directives/v-click-outside.ts';
import lazyLoad from "@/directives/v-lazy-load.ts";

/**
 * Register all directives
 * @param app
 */
export const registerDirectives = (app: any) => {
    app.directive('click-outside', clickOutside);
    app.directive('lazy-load', lazyLoad);
};
