/**
 * Combine all Reducers in this file and export the combined reducers.
 *
 * .. note::
 *
 *    If we were to do this in :mod:`{{ cookiecutter.module_name }}.store`,
 *    reducers wouldn't be hot reloadable.
 */

import {fromJS} from "immutable";
import {combineReducers} from "redux-immutable";
import {LOCATION_CHANGE} from "react-router-redux";

import globalReducer from "{{ cookiecutter.module_name }}/container/application/reducer";
import languageProviderReducer from "{{ cookiecutter.module_name }}/container/language_provider/reducer";


/**
 * Initial routing state.
 */
const ROUTE_INITIAL_STATE = fromJS({
    location: null,
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
                location: action.payload,
            });
        default:
            return state;
    }
}


/**
 * Return the main Reducer.
 *
 * Create the main reducer with the dynamically injected ones.
 */
export default function createReducer(injectedReducers) {
    return combineReducers({
        route: routeReducer,
        global: globalReducer,
        language: languageProviderReducer,
        ...injectedReducers,
    });
}
