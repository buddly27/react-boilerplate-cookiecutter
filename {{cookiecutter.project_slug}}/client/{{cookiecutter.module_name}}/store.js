/**
 * Create the store with asynchronously loaded reducers.
 */

import {createStore, applyMiddleware, compose} from "redux";
import {fromJS} from "immutable";
import {routerMiddleware} from "react-router-redux";
import createSagaMiddleware from "redux-saga";

import createReducer from "{{ cookiecutter.module_name }}/reducer";


const SAGA_MIDDLEWARE = createSagaMiddleware();


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
        SAGA_MIDDLEWARE,
        routerMiddleware(history),
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    // If Redux DevTools Extension is installed use it, otherwise use
    // Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
        process.env.NODE_ENV !== "production" &&
        typeof window === "object" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                // TODO Try to remove when `react-router-redux` is out of
                // beta, LOCATION_CHANGE should not be fired more than once
                // after hot reloading.
                // Prevent recomputing reducers for `replaceReducer`
                shouldHotReload: false,
            })
            : compose;
    /* eslint-enable */

    const store = createStore(
        createReducer(),
        fromJS(initialState),
        composeEnhancers(...enhancers)
    );

    // Create hook for async sagas
    store.runSaga = SAGA_MIDDLEWARE.run;
    store.injectedReducers = {}; // Reducer registry
    store.injectedSagas = {}; // Saga registry

    // Make reducers hot reloadable, see http://mxs.is/googmo
    if (module.hot) {
        module.hot.accept("./reducer", () => {
            store.replaceReducer(createReducer(store.injectedReducers));
        });
    }

    return store;
}
