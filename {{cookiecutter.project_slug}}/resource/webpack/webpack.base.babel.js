/**
 * Common Webpack configuration.
 */

const process = require("process");
const path = require("path");
const webpack = require("webpack");


module.exports = (options) => ({
    entry: options.entry,
    output: Object.assign(
        {
            path: path.resolve(process.cwd(), "build"),
            publicPath: "/",
        },
        options.output
    ),
    module: {
        loaders: [
            {
                // Transform all .js files required somewhere with Babel.
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: options.babelQuery,
            }, {
                // Do not transform vendor's CSS with CSS-modules.
                // The point is that they remain in global scope.
                test: /\.css$/,
                include: /node_modules/,
                loaders: ["style-loader", "css-loader"],
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader",
            }, {
                test: /\.(jpg|png|gif)$/,
                loaders: [
                    "file-loader",
                    {
                        loader: "image-webpack-loader",
                        query: {
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
            }, {
                test: /\.html$/,
                loader: "html-loader",
            }, {
                test: /\.json$/,
                loader: "json-loader",
            }, {
                test: /\.(mp4|webm)$/,
                loader: "url-loader",
                query: {
                    limit: 10000,
                },
            },
        ],
    },
    plugins: options.plugins.concat(
        [
            new webpack.ProvidePlugin(
                {
                    // Make fetch available.
                    fetch: "exports-loader?self.fetch!whatwg-fetch",
                }
            ),

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
            "source",
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
    devtool: options.devtool,
    target: "web", // Make web variables accessible to webpack, e.g. window
    performance: options.performance || {},
});
