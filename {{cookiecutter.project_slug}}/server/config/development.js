const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const webpackConfig = require("../../internal/webpack/webpack.dev.babel");


/**
 * Setup development middlewares.
 */
module.exports = (app) => {
    const compiler = webpack(webpackConfig);
    const middleware = webpackDevMiddleware(
        compiler, {
            noInfo: true,
            publicPath: webpackConfig.output.publicPath,
            silent: true,
            stats: "errors-only",
        }
    );

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    return {
        compiler, middleware,
    };
};
