/**
 * Common Webpack configuration.
 */

const path = require("path");
const webpack = require("webpack");


// Remove this line once the following warning goes away:
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value
// which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be
// replaced with getOptions() in the next major version of loader-utils.'
process.noDeprecation = true;


module.exports = (options) => ({
    entry: options.entry,
    output: Object.assign(
        {
            path: path.resolve(process.cwd(), "build"),
            publicPath: "",
        },
        options.output
    ),
    module: {
        loaders: [
            {
                // Transform all .js files required somewhere with Babel.
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                // Transform vis.js files.
                test: /node_modules[\\/]vis[\\/].*\.js$/, // vis.js files
                use: {
                    loader: "babel-loader",
                },
            },
            {
                // Preprocess 3rd party .css files located in node_modules.
                test: /\.css$/,
                include: /node_modules/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
                use: "file-loader",
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    "file-loader",
                    {
                        loader: "image-webpack-loader",
                        options: {
                            progressive: true,
                            optimizationLevel: 7,
                            interlaced: false,
                            pngquant: {
                                quality: "65-90",
                                speed: 4,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: "html-loader",
            },
            {
                test: /\.json$/,
                use: "json-loader",
            },
            {
                test: /\.(mp4|webm)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                    },
                },
            },
        ],
    },
    plugins: options.plugins.concat(
        [
            new webpack.ProvidePlugin({
                // Make fetch available.
                fetch: "exports-loader?self.fetch!whatwg-fetch",
            }),

            // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
            // inside your code for any environment checks; UglifyJS will automatically
            // drop any unreachable code.
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                },
            }),

            new webpack.NamedModulesPlugin(),

            // Fix moment bundled imported via ftrack-javascript-api
            // https://github.com/moment/moment/issues/1435#issuecomment-249773545
            new webpack.ContextReplacementPlugin(
                /^\.\/locale$/, (context) => {
                    if (!/\/moment\//.test(context.context)) {
                        return;
                    }
                    // context needs to be modified in place
                    Object.assign(context, {
                        // include only CJK
                        regExp: /^\.\/(ja|ko|zh)/,

                        // point to the locale data folder relative to
                        // moment's src/lib/locale
                        request: "../../locale",
                    });
                }
            ),

        ]
    ),
    resolve: {
        modules: [
            "client",
            "node_modules",
        ],
        extensions: [
            ".js",
        ],
        mainFields: [
            "browser",
            "jsnext:main",
            "main",
        ],
    },
    externals: [
        "fs",
        "tls",
        "net",
        "module",
    ],
    devtool: options.devtool,
    target: "web", // Make web variables accessible to webpack, e.g. window
    performance: options.performance || {},
});
