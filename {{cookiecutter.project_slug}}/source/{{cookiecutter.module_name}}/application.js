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
import {translationMessages} from "{{ cookiecutter.module_name }}/i18n";


const _INITIAL_STATE = {};

/**
 * Create Redux store with history.
 */
const STORE = configureStore(_INITIAL_STATE, browserHistory);


/**
 * Sync history and store.
 */
const HISTORY = syncHistoryWithStore(
    browserHistory, STORE, {
        selectLocationState: makeSelectLocationState(),
    }
);


/**
 * Set up the router, wrapping all Routes in the application component.
 */
const ROOT_ROUTE = {
    component: App,
    childRoutes: createRoutes(STORE),
};

/**
 * Render the application.
 */
const render = (translatedMessages) => {
    ReactDOM.render(
        <Provider store={STORE}>
            <LanguageProvider messages={translatedMessages}>
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
            render(translationMessages);
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
            ]
        )
    )
    .then(() => render(translationMessages))
    .catch(
        (err) => {
            throw err;
        }
    );
}
else {
    render(translationMessages);
}


// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
install();
