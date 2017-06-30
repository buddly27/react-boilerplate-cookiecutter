/**
 * Language Provider Selectors.
 *
 */

import {createSelector} from "reselect";


/**
 * Direct selector to the language state domain.
 */
const selectLanguage = (state) => state.get("language");


/**
 * Select the language locale.
 */
const makeSelectLocale = () => createSelector(
    selectLanguage,
    (languageState) => languageState.get("locale")
);


export {
    selectLanguage,
    makeSelectLocale,
};
