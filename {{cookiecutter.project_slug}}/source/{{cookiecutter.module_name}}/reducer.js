/**
 * Combine all Reducers in this file and export the combined reducers.
 *
 * .. note::
 *
 *    If we were to do this in :mod:`{{ cookiecutter.module_name }}.store`,
 *    reducers wouldn't be hot reloadable.
 */

import {combineReducers} from "redux-immutable";
import {fromJS} from "immutable";
import {LOCATION_CHANGE} from "react-router-redux";

import languageProviderReducer from "{{ cookiecutter.module_name }}/container/language_provider/reducer";


/**
 * Initial routing state.
 */
const ROUTE_INITIAL_STATE = fromJS({
    locationBeforeTransitions: null,
});


/**
 * Return the Route Reducer.
 *
 * Merge route into the global application state.
 */
function routeReducer(state = ROUTE_INITIAL_STATE, action) {
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
 * Return the main Reducer.
 *
 * Create the main reducer with the asynchronously loaded ones.
 */
export default function createReducer(asyncReducers) {
    return combineReducers({
        route: routeReducer,
        language: languageProviderReducer,
        ...asyncReducers,
    });
}
