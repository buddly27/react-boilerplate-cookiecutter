/**
 * Language Provider Actions.
 *
 */

import {
    CHANGE_LOCALE,
} from "./constant";


export function changeLocale(languageLocale) {
    return {
        type: CHANGE_LOCALE,
        locale: languageLocale,
    };
}
