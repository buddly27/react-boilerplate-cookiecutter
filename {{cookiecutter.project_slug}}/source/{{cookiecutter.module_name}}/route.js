import {getAsyncInjectors} from "{{ cookiecutter.module_name }}/utility/async_injector";


const errorLoading = (err) => {
    // eslint-disable-next-line no-console
    console.error("Dynamic page loading failed", err);
};


const loadModule = (cb) => (componentModule) => {
    cb(null, componentModule.default);
};


export default function createRoutes(store) {
    // eslint-disable-next-line no-unused-vars
    const {injectReducer, injectSagas} = getAsyncInjectors(store);

    return [
        {
            path: "/",
            name: "home",
            getComponent(nextState, cb) {
                const importModules = Promise.all([
                    System.import("{{ cookiecutter.module_name }}/container/home/reducer"),
                    System.import("{{ cookiecutter.module_name }}/container/home/index"),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(
                    ([reducer, component]) => {
                        injectReducer("home", reducer.default);
                        renderRoute(component);
                    }
                );

                importModules.catch(errorLoading);
            },
        }, {
            path: "*",
            name: "not_found",
            getComponent(nextState, cb) {
                System.import("{{ cookiecutter.module_name }}/container/not_found/index")
                .then(loadModule(cb))
                .catch(errorLoading);
            },
        },
    ];
}
