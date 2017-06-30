const chalk = require("chalk");


/**
 * Add checkmark symbol.
 */
function addCheckMark(callback) {
    process.stdout.write(chalk.green(" ✓"));
    if (callback) callback();
}


module.exports = addCheckMark;
