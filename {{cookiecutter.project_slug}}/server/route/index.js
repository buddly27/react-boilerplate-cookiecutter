const path = require("path");
const express = require("express");
const compression = require("compression");


module.exports = (app, developmentConfig) => {
    if (developmentConfig) {
        const {middleware, compiler} = developmentConfig;

        // Uses webpackDevMiddleware as it uses memory-fs internally to store
        // build artifacts
        const fs = middleware.fileSystem;

        app.get("*", (req, res) => {
            fs.readFile(
                path.join(compiler.outputPath, "index.html"), (error, file) => {
                    if (error) {
                        res.sendStatus(404);
                    }
                    else {
                        res.send(file.toString());
                    }
                }
            );
        });
    }
    else {
        const publicPath = "/";
        const outputPath = path.resolve(process.cwd(), "build");

        // compression middleware compresses your server responses which makes
        // them smaller (applies also to assets). You can read more about that
        // technique and other good practices on official Express.js docs
        // http://mxs.is/googmy
        app.use(compression());
        app.use(publicPath, express.static(outputPath));

        app.get(
            "*", (req, res) =>
                res.sendFile(path.resolve(outputPath, "index.html"))
        );
    }
};
