/* eslint-disable */

const readline = require("readline");
const process = require("process");


/**
 * Add animated progress indicator.
 */
function animateProgress(message, amountOfDots) {
    if (typeof amountOfDots !== "number") {
        amountOfDots = 3;
    }

    let index = 0;
    return setInterval(
        function () {
            readline.cursorTo(process.stdout, 0, 0);
            index = (index + 1) % (amountOfDots + 1);
            let dots = new Array(index + 1).join(".");
            process.stdout.write(message + dots);
        }, 500
    );
}


module.exports = animateProgress;
