/**
 * This is the entry file for the application.
 */

import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {ConnectedRouter} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import "sanitize.css/sanitize.css";
import {MuiThemeProvider, createMuiTheme} from "material-ui/styles";

import Application from "{{ cookiecutter.module_name }}/container/application";
import LanguageProvider from "{{ cookiecutter.module_name }}/container/language_provider";
import configureStore from "{{ cookiecutter.module_name }}/store";
import {TRANSLATION_MESSAGES} from "{{ cookiecutter.module_name }}/i18n";


/**
 * Theme of the application.
 */
export const THEME = createMuiTheme();


/**
 * Initial State of the application.
 *
 */
const INITIAL_STATE = {};

/**
 * Initiate the history object.
 *
 */
const HISTORY = createHistory();

/**
 * Redux Store.
 *
 * Create redux store with the singleton *browserHistory* provided by
 * react-router.
 *
 */
const STORE = configureStore(INITIAL_STATE, HISTORY);


/**
 * Mounting node within the Html DOM.
 */
const MOUNT_NODE = document.getElementById("app");


/**
 * Render the application.
 *
 * *messages* represents an object of :term:`i18n` message descriptors.
 *
 */
const render = (messages) => {
    ReactDOM.render(
        <MuiThemeProvider theme={THEME}>
            <Provider store={STORE}>
                <LanguageProvider messages={messages}>
                    <ConnectedRouter history={HISTORY}>
                        <Application />
                    </ConnectedRouter>
                </LanguageProvider>
            </Provider>
        </MuiThemeProvider>,
        MOUNT_NODE
    );
};


// Hot reloadable translation json files.
if (module.hot) {
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept(["./i18n", "{{ cookiecutter.module_name }}/container/application"], () => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render(TRANSLATION_MESSAGES);
    });
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
if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line global-require
    require("offline-plugin/runtime").install();
}
