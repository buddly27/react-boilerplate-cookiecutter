#!/usr/bin/env node
/* eslint-disable prefer-template */

const shelljs = require("shelljs");
const animateProgress = require("./helper/progress");
const chalk = require("chalk");
const addCheckMark = require("./helper/checkmark");


const progress = animateProgress("Generating stats");


// Generate stats.json file with Webpack.
shelljs.exec(
    "webpack --config resource/webpack/webpack.prod.babel.js --profile "
    + "--json > stats.json",
    addCheckMark.bind(null, callback) // Output a checkmark on completion.
);


// Called after webpack has finished generating the stats.json file.
function callback() {
    clearInterval(progress);
    process.stdout.write(
        "\n\nOpen " + chalk.magenta("http://webpack.github.io/analyse/") +
        " in your browser and upload the stats.json file!" +
        chalk.blue(
            "\n(Tip: " + chalk.italic("CMD + double-click") + " the link!)\n\n"
        )
    );
}
