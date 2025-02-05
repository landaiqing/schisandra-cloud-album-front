// src/directives/index.ts

import clickOutside from '@/directives/v-click-outside.ts';
import lazyLoad from "@/directives/v-lazy-load.ts";
import focus from "@/directives/v-focus.ts";

/**
 * Register all directives
 * @param app
 */
export const registerDirectives = (app: any) => {
    app.directive('click-outside', clickOutside);
    app.directive('lazy.ts-load', lazyLoad);
    app.directive('v-focus', focus);
};
