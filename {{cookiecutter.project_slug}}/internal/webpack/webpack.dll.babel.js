/**
 * Webpack DLL generator.
 *
 * Cache Webpack's module contexts for external library and framework type
 * dependencies tgat usually do not change often enough to warrant building them
 * from scratch each time.
 */

const {join} = require("path");
const defaults = require("lodash/defaultsDeep");
const webpack = require("webpack");
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(join(process.cwd(), "package.json"));
const dllPlugin = require("../config").dllPlugin;

if (!pkg.dllPlugin) {
    process.exit(0);
}

const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults);
const outputPath = join(process.cwd(), dllConfig.path);


module.exports = require("./webpack.base.babel")(
    {
        context: process.cwd(),
        entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(pkg),
        devtool: "eval",
        output: {
            filename: "[name].dll.js",
            path: outputPath,
            library: "[name]",
        },
        plugins: [
            // eslint-disable-next-line no-new
            new webpack.DllPlugin({
                name: "[name]",
                path: join(outputPath, "[name].json"),
            }),
        ],
        performance: {
            hints: false,
        },
    }
);
