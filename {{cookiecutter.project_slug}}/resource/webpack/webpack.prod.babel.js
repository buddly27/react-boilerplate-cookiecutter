/**
 * Production Webpack configuration.
 */

const process = require("process");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OfflinePlugin = require("offline-plugin");


module.exports = require("./webpack.base.babel")(
    {
        entry: [
            path.join(process.cwd(), "source/{{ cookiecutter.module_name }}/application.js"),
        ],

        // Utilise long-term caching by adding content hashes (not compilation
        // hashes) to compiled assets.
        output: {
            filename: "[name].[chunkhash].js",
            chunkFilename: "[name].[chunkhash].chunk.js",
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin(
                {
                    name: "vendor",
                    children: true,
                    minChunks: 2,
                    async: true,
                }
            ),

            // Minify and optimise index.html.
            new HtmlWebpackPlugin(
                {
                    template: "source/{{ cookiecutter.module_name }}/index.html",
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    },
                    inject: true,
                }
            ),

            // Support offline usage.
            new OfflinePlugin(
                {
                    relativePaths: false,
                    publicPath: "/",

                    caches: {
                        main: [":rest:"],

                        // Mark all chunks as `additional` to be loaded after
                        // main section.
                        additional: ["*.chunk.js"],
                    },

                    // Remove warning for about `additional` section usage.
                    safeToUseOptionalCaches: true,

                    AppCache: false,
                }
            ),
        ],
        performance: {
            assetFilter: (assetFilename) => !(/(\.map$)/.test(assetFilename)),
        },

    }
);
