import {createStore, applyMiddleware, compose} from "redux";
import {fromJS} from "immutable";
import {routerMiddleware} from "react-router-redux";
import createSagaMiddleware from "redux-saga";

import createReducer from "{{ cookiecutter.module_name }}/reducer";


const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => (noop) => noop);


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
