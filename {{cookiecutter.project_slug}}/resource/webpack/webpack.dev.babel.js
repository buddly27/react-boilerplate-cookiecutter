/**
 * Development Webpack configuration.
 */

const process = require("process");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const logger = require("../../resource/server/logger");
const cheerio = require("cheerio");
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve(process.cwd(), "package.json"));
const dllPlugin = pkg.dllPlugin;


const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin(
        {
            inject: true,
            // eslint-disable-next-line no-use-before-define
            templateContent: templateContent(),
        }
    ),
    new CircularDependencyPlugin(
        {
            exclude: /a\.js|node_modules/,
            failOnError: false,
        }
    ),
];


module.exports = require("./webpack.base.babel")(
    {
        // Add hot reloading in development.
        entry: [
            "eventsource-polyfill", // Necessary for hot reloading with IE.
            "webpack-hot-middleware/client?reload=true",
            path.join(process.cwd(), "source/{{ cookiecutter.module_name }}/application.js"),
        ],

        // Don't use hashes in dev mode for better performance.
        output: {
            filename: "[name].js",
            chunkFilename: "[name].chunk.js",
        },

        // Add development plugins
        // eslint-disable-next-line no-use-before-define
        plugins: dependencyHandlers().concat(plugins),

        // Load the CSS in a style tag in development
        cssLoaders: (
            "style-loader!css-loader?localIdentName=[local]__[path][name]__"
            + "[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader"
        ),

        // Notify Babel about hot reloading.
        babelQuery: {
            // require.resolve solves the issue of relative presets when dealing with
            // locally linked packages. This is an issue with babel and webpack.
            // See https://github.com/babel/babel-loader/issues/149 and
            // https://github.com/webpack/webpack/issues/1866
            presets: ["babel-preset-react-hmre"].map(require.resolve),
        },

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
            new webpack.DllReferencePlugin(
                {
                    context: process.cwd(),
                     // eslint-disable-next-line global-require, import/no-dynamic-require
                    manifest: require(manifestPath),
                }
            ),
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

            return new webpack.DllReferencePlugin(
                {
                    context: process.cwd(),
                    // eslint-disable-next-line global-require, import/no-dynamic-require
                    manifest: require(manifestPath),
                }
            );
        }
    );
}


/**
 * Dynamically generate the HTML content in development so that the different
 * DLL Javascript files are loaded in script tags and available to the
 * application.
 */
function templateContent() {
    const html = fs.readFileSync(
        path.resolve(process.cwd(), "source/{{ cookiecutter.module_name }}/index.html")
    ).toString();

    if (!dllPlugin) {
        return html;
    }

    const doc = cheerio(html);
    const body = doc.find("body");
    const dllNames = !dllPlugin.dlls ? ["reactBoilerplateDeps"] :
        Object.keys(dllPlugin.dlls);

    dllNames.forEach(
        (dllName) => body.append(
            `<script data-dll="true" src="/${dllName}.dll.js"></script>`
        )
    );

    return doc.toString();
}
