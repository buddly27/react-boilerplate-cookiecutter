const resolve = require("path").resolve;
const pullAll = require("lodash/pullAll");
const uniq = require("lodash/uniq");


const ReactBoilerplate = {
    // This refers to the react-boilerplate version this project is based on.
    version: "3.4.0",

    /**
     * The DLL Plugin provides a dramatic speed increase to webpack build and
     * hot module reloading by caching the module metadata for all of our npm
     * dependencies. It is enabled by default in development.
     *
     * To disable the DLL Plugin entirely, set this value to false.
     */
    dllPlugin: {
        defaults: {
             // Exclude dependencies not intended for the browser by listing
             // them here.
            exclude: [
                "chalk",
                "compression",
                "cross-env",
                "express",
                "ip",
                "minimist",
                "sanitize.css",
            ],

            // Specify any additional dependencies here.
            // core-js and lodash are included since a lot of the dependencies
            // depend on them and they get picked up by webpack.
            include: [
                "core-js", "eventsource-polyfill", "babel-polyfill", "lodash",
            ],

            // The path where the DLL manifest and bundle will get built.
            path: resolve("../node_modules/react-boilerplate-dlls"),
        },

        entry(pkg) {
            const dependencyNames = Object.keys(pkg.dependencies);
            const exclude = pkg.dllPlugin.exclude ||
                ReactBoilerplate.dllPlugin.defaults.exclude;
            const include = pkg.dllPlugin.include ||
                ReactBoilerplate.dllPlugin.defaults.include;
            const includeDependencies = uniq(dependencyNames.concat(include));

            return {
                reactBoilerplateDeps: pullAll(includeDependencies, exclude),
            };
        },
    },
};

module.exports = ReactBoilerplate;
