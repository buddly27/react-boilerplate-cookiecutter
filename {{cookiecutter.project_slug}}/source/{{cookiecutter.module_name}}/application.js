/**
 * This is the entry file for the application.
 */

import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyRouterMiddleware, Router, browserHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import {useScroll} from "react-router-scroll";
import {install} from "offline-plugin/runtime";
import "sanitize.css/sanitize.css";

import App from "{{ cookiecutter.module_name }}/container/application";
import LanguageProvider from "{{ cookiecutter.module_name }}/container/language_provider";
import {makeSelectLocationState} from "{{ cookiecutter.module_name }}/container/application/selector";
import createRoutes from "{{ cookiecutter.module_name }}/route";
import configureStore from "{{ cookiecutter.module_name }}/store";
import {TRANSLATION_MESSAGES} from "{{ cookiecutter.module_name }}/i18n";


/**
 * Initial State of the application.
 *
 */
const INITIAL_STATE = {};

/**
 * Redux Store.
 *
 * Create redux store with the singleton *browserHistory* provided by
 * react-router.
 *
 */
const STORE = configureStore(INITIAL_STATE, browserHistory);


/**
 * History object.
 *
 * Synchronize Router history and Redux store.
 *
 * As the react-router-redux reducer is under the non-default key ("routing"),
 * selectLocationState must be provided for resolving how to retrieve the
 * "route" in the state.
 *
 */
const HISTORY = syncHistoryWithStore(
    browserHistory, STORE, {
        selectLocationState: makeSelectLocationState(),
    }
);


/**
 * Routes object.
 *
 * Set up the router, wrapping all Routes in the application component.
 */
const ROOT_ROUTE = {
    component: App,
    childRoutes: createRoutes(STORE),
};

/**
 * Render the application.
 *
 * *messages* represents an object of :term:`i18n` message descriptors.
 *
 */
const render = (messages) => {
    ReactDOM.render(
        <Provider store={STORE}>
            <LanguageProvider messages={messages}>
                <Router
                    history={HISTORY}
                    routes={ROOT_ROUTE}
                    render={
                        // Scroll to top when going to a new page, imitating
                        // default browser behaviour
                        applyRouterMiddleware(useScroll())
                    }
                />
            </LanguageProvider>
        </Provider>,
        document.getElementById("app")
    );
};


// Hot reloadable translation json files.
if (module.hot) {
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept(
        "./i18n", () => {
            render(TRANSLATION_MESSAGES);
        }
    );
}


// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
    (new Promise(
        (resolve) => {
            resolve(System.import("intl"));
        }
    ))
    .then(
        () => Promise.all(
            [
                System.import("intl/locale-data/jsonp/en.js"),
                System.import("intl/locale-data/jsonp/de.js"),
                System.import("intl/locale-data/jsonp/fr.js"),
            ]
        )
    )
    .then(() => render(TRANSLATION_MESSAGES))
    .catch(
        (err) => {
            throw err;
        }
    );
}
else {
    render(TRANSLATION_MESSAGES);
}


// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
install();
