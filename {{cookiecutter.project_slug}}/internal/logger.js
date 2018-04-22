/* eslint-disable no-console, prefer-template */

const chalk = require("chalk");
const ip = require("ip");

/**
 * Logger object.
 */
module.exports = {

    /**
     * Display error *message*.
     */
    error: (message) => {
        console.error(chalk.red(message));
    },

    /**
     * Indicate that the express application started.
     */
    appStarted: (port, host, tunnelStarted) => {
        console.log(`Server started ${chalk.green("✓")}`);

        // If the tunnel started, log that and the URL it's available at
        if (tunnelStarted) {
            console.log(`Tunnel initialised ${chalk.green("✓")}`);
        }

        console.log(
            `\n${chalk.bold("Access URLs:")}\n` +
            `${chalk.gray("-----------------------------------")}\n` +
            `Localhost: ${chalk.magenta(`http://${host}:${port}`)}\n` +
            `      LAN: ${chalk.magenta(`http://${ip.address()}:${port}\n`)}` +
            (tunnelStarted ?
            `    Proxy: ${chalk.magenta(tunnelStarted)}\n` : "") +
            `${chalk.gray("-----------------------------------")}\n` +
            `${chalk.blue(`Press ${chalk.italic("CTRL-C")} to stop\n`)}`
        );
    },
};
