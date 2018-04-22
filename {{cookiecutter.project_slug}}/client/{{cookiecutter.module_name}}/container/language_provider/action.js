/**
 * Language Provider Actions.
 *
 */

import {
    CHANGE_LOCALE,
} from "./constant";


/**
 * Action triggered when the user *locale* code is changed.
 */
export function changeLocale(locale) {
    return {
        type: CHANGE_LOCALE,
        locale,
    };
}
