/**
 * Create the store with asynchronously loaded reducers.
 */

import {createStore, applyMiddleware, compose} from "redux";
import {fromJS} from "immutable";
import {routerMiddleware} from "react-router-redux";
import createSagaMiddleware from "redux-saga";

import createReducer from "{{ cookiecutter.module_name }}/reducer";


const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => (noop) => noop);


/**
 * Return configured Redux store.
 *
 * Apply two middlewares:
 *
 * * sagaMiddleware:
 *    Makes redux-sagas work.
 *
 * * routerMiddleware:
 *    Syncs the location/URL path to the state.
 *
 * .. seealso:: http://redux.js.org/docs/advanced/Middleware.html
 *
 * .. note::
 *
 *    Use Redux DevTools Extension if available.
 *
 */
export default function configureStore(initialState = {}, history) {
    const middlewares = [
        sagaMiddleware,
        routerMiddleware(history),
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
        devtools(),
    ];

    const store = createStore(
        createReducer(),
        fromJS(initialState),
        compose(...enhancers)
    );

    // Create hook for async sagas
    store.runSaga = sagaMiddleware.run;

    // Make reducers hot reloadable, see http://mxs.is/googmo
    if (module.hot) {
        System.import("./reducer").then(
            (reducerModule) => {
                const createReducers = reducerModule.default;
                const nextReducers = createReducers(store.asyncReducers);

                store.replaceReducer(nextReducers);
            }
        );
    }

    // Initialise it with no other reducers
    store.asyncReducers = {};
    return store;
}
