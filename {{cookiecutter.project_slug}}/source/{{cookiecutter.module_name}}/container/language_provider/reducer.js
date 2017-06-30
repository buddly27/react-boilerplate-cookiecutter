/**
 * Language Provider Reducer.
 *
 */

import {fromJS} from "immutable";

import {
    CHANGE_LOCALE,
} from "./constant";


const initialState = fromJS({
    locale: "en",
});


export default function languageProviderReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LOCALE:
            return state.set("locale", action.locale);
        default:
            return state;
    }
}
