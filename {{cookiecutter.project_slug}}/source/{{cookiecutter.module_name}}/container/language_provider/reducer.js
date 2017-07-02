/**
 * Language Provider Reducer.
 *
 */

import {fromJS} from "immutable";

import {
    CHANGE_LOCALE,
} from "./constant";


/**
 * Initiate state for the container component.
 */
const INITIAL_STATE = fromJS({
    locale: "en",
});


/**
 * Return modified container *state* depending on *action*.
 */
export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case CHANGE_LOCALE:
            return state.set("locale", action.locale);
        default:
            return state;
    }
}
