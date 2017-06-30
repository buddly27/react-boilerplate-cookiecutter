import {conformsTo, isEmpty, isFunction, isObject, isString} from "lodash";
import invariant from "invariant";
import warning from "warning";

import createReducer from "{{ cookiecutter.module_name }}/reducer";


/**
 * Validate the shape of Redux store.
 */
export function checkStore(store) {
    const shape = {
        dispatch: isFunction,
        subscribe: isFunction,
        getState: isFunction,
        replaceReducer: isFunction,
        runSaga: isFunction,
        asyncReducers: isObject,
    };
    invariant(
        conformsTo(store, shape),
        "(source/utility...) asyncInjector: Expected a valid redux store"
    );
}


/**
 * Inject an asynchronously loaded reducer.
 */
export function injectAsyncReducer(store, isValid) {
    return function injectReducer(name, asyncReducer) {
        if (!isValid) checkStore(store);

        invariant(
            isString(name) && !isEmpty(name) && isFunction(asyncReducer),
            (
                "(source/utility...) injectAsyncReducer: Expected "
                + "`asyncReducer` to be a reducer function"
            )
        );

        if (Reflect.has(store.asyncReducers, name)) return;

        // eslint-disable-next-line no-param-reassign
        store.asyncReducers[name] = asyncReducer;
        store.replaceReducer(createReducer(store.asyncReducers));
    };
}


/**
 * Inject an asynchronously loaded Saga.
 */
export function injectAsyncSagas(store, isValid) {
    return function injectSagas(sagas) {
        if (!isValid) checkStore(store);

        invariant(
            Array.isArray(sagas),
            (
                "(source/utility...) injectAsyncSagas: Expected `sagas` to be "
                + "an array of generator functions"
            )
        );

        warning(
            !isEmpty(sagas),
            (
                "(source/utility...) injectAsyncSagas: Received an empty "
                + "`sagas` array"
            )
        );

        sagas.map(store.runSaga);
    };
}


/**
 * Helper for creating injectors.
 */
export function getAsyncInjectors(store) {
    checkStore(store);

    return {
        injectReducer: injectAsyncReducer(store, true),
        injectSagas: injectAsyncSagas(store, true),
    };
}
