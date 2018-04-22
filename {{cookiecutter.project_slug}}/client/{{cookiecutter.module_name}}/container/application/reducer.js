/**
 * Application Reducer.
 *
 */

import {fromJS} from "immutable";


/**
 * Initiate state for the container component.
 */
const INITIAL_STATE = fromJS({});


/**
 * Return modified container *state* depending on *action*.
 */
export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return state;
    }
}
