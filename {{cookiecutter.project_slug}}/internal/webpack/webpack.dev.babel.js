/**
 * Development Webpack configuration.
 */

const path = require("path");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve(process.cwd(), "package.json"));

// eslint-disable-next-line import/no-dynamic-require
const logger = require(path.resolve(process.cwd(), "internal/logger.js"));


const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
        inject: true,
        template: "client/{{ cookiecutter.module_name }}/index.html",
    }),
    new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: false,
    }),
];

const dllPlugin = pkg.dllPlugin;

if (dllPlugin) {
    glob.sync(`${dllPlugin.path}/*.dll.js`).forEach((dllPath) => {
        plugins.push(
            new AddAssetHtmlPlugin({
                filepath: dllPath,
                includeSourcemap: false,
            })
        );
    });
}


module.exports = require("./webpack.base.babel")(
    {
        // Add hot reloading in development.
        entry: [
            "eventsource-polyfill", // Necessary for hot reloading with IE.
            "webpack-hot-middleware/client?reload=true",
            path.join(process.cwd(), "client/{{ cookiecutter.module_name }}/application.js"),
        ],

        // Don't use hashes in dev mode for better performance.
        output: {
            filename: "[name].js",
            chunkFilename: "[name].chunk.js",
        },

        // Add development plugins
        // eslint-disable-next-line no-use-before-define
        plugins: dependencyHandlers().concat(plugins),

        // Emit a source map for easier debugging.
        devtool: "source-map",

        performance: {
            hints: false,
        },
    }
);


/**
 * Select which plugins to use to optimise the bundle's handling of
 * third party dependencies.
 *
 * If there is a dllPlugin key on the project's package.json, the
 * Webpack DLL Plugin will be used. Otherwise the CommonsChunkPlugin
 * will be used.
 */
function dependencyHandlers() {
    // Don't do anything during the DLL Build step.
    if (process.env.BUILDING_DLL) {
        return [];
    }

    // If the package.json does not have a dllPlugin property, use the
    // CommonsChunkPlugin.
    if (!dllPlugin) {
        return [
            new webpack.optimize.CommonsChunkPlugin(
                {
                    name: "vendor",
                    children: true,
                    minChunks: 2,
                    async: true,
                }
            ),
        ];
    }

    const dllPath = path.resolve(
        process.cwd(), dllPlugin.path || "node_modules/react-boilerplate-dlls"
    );

    /**
     * If DLLs aren't explicitly defined, assume all production dependencies
     * listed in package.json
     *
     * Reminder: Exclude any server side dependencies by listing them in
     * dllConfig.exclude
     */
    if (!dllPlugin.dlls) {
        const manifestPath = path.resolve(dllPath, "reactBoilerplateDeps.json");

        if (!fs.existsSync(manifestPath)) {
            logger.error(
                "The DLL manifest is missing. Please run `npm run build:dll`"
            );
            process.exit(0);
        }

        return [
            new webpack.DllReferencePlugin({
                context: process.cwd(),
                 // eslint-disable-next-line global-require, import/no-dynamic-require
                manifest: require(manifestPath),
            }),
        ];
    }

    // If DLLs are explicitly defined, automatically create a DLLReferencePlugin
    // for each of them.
    const dllManifests = Object.keys(dllPlugin.dlls)
        .map((name) => path.join(dllPath, `/${name}.json`));

    return dllManifests.map(
        (manifestPath) => {
            if (!fs.existsSync(path)) {
                if (!fs.existsSync(manifestPath)) {
                    logger.error(
                        `The following Webpack DLL manifest is missing:
                        ${path.basename(manifestPath)}`
                    );
                    logger.error(`Expected to find it in ${dllPath}`);
                    logger.error("Please run: npm run build:dll");

                    process.exit(0);
                }
            }

            return new webpack.DllReferencePlugin({
                context: process.cwd(),
                // eslint-disable-next-line global-require, import/no-dynamic-require
                manifest: require(manifestPath),
            });
        }
    );
}
