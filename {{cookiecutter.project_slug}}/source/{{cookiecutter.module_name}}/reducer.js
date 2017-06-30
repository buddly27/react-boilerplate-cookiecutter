import {combineReducers} from "redux-immutable";
import {fromJS} from "immutable";
import {LOCATION_CHANGE} from "react-router-redux";

import languageProviderReducer from "{{ cookiecutter.module_name }}/container/language_provider/reducer";


/**
 * Initial routing state.
 */
const routeInitialState = fromJS({
    locationBeforeTransitions: null,
});


/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
    switch (action.type) {
        case LOCATION_CHANGE:
            return state.merge({
                locationBeforeTransitions: action.payload,
            });
        default:
            return state;
    }
}


/**
 * Create the main reducer with the asynchronously loaded ones.
 */
export default function createReducer(asyncReducers) {
    return combineReducers({
        route: routeReducer,
        language: languageProviderReducer,
        ...asyncReducers,
    });
}
