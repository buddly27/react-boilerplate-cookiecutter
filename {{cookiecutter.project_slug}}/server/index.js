/* eslint consistent-return:0 */

const minimist = require("minimist");
const express = require("express");
const bodyParser = require("body-parser");

const configureHotReloading = require("./config/development");
const configureRoute = require("./route");
const logger = require("../internal/logger");


// Extract argument mapping.
const argv = minimist(process.argv.slice(2));

// Extract the server port.
const port = parseInt(argv.port || process.env.PORT || "3000", 10);

// Extract the server host.
const host = argv.host || process.env.HOST || null;

// Indicate whether the node environment is in development mode.
const isDevelopment = process.env.NODE_ENV !== "production";

// Initiate the Express application.
const app = express();

// Setup Hot-Reloading and return development config if necessary.
const developmentConfig = (isDevelopment) ?
    configureHotReloading(app) : null;

// Configure Express application.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

configureRoute(app, developmentConfig);

// Start the application.
app.listen(port, host, (error) => {
    if (error) {
        return logger.error(error.message);
    }

    // Display 'localhost' if no host is set.
    const displayedHost = host || "localhost";

    // Connect tunnel if necessary.
    if ((isDevelopment && process.env.ENABLE_TUNNEL) || argv.tunnel) {
        // eslint-disable-next-line global-require
        const ngrok = require("ngrok");

        ngrok.connect(
            port, (innerError, url) => {
                if (innerError) {
                    return logger.error(innerError);
                }

                logger.appStarted(port, displayedHost, url);
            }
        );
    }
    else {
        logger.appStarted(port, displayedHost);
    }
});
