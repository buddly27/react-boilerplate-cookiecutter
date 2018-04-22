/* eslint-disable */
/**
 * Extract the internationalization messages from all components and package
 * them in appropriate translation files.
 */

const fs = require("fs");
const path = require("path");
const nodeGlob = require("glob");
const transform = require("babel-core").transform;

const animateProgress = require("./helper/progress");
const addCheckmark = require("./helper/checkmark");

const pkg = require(path.resolve(process.cwd(), "package.json"));
const i18n = require(path.resolve(process.cwd(), "client/i18n.js"));

require("shelljs/global");

// Match all js files except test files.
const FILES_TO_PARSE = "client/**/*.js";
const locales = i18n.appLocales;

const newLine = () => process.stdout.write("\n");


// Progress logger.
let progress;
const task = (message) => {
    progress = animateProgress(message);
    process.stdout.write(message);

    return (error) => {
        if (error) {
            process.stderr.write(error);
        }
        clearTimeout(progress);
        return addCheckmark(() => newLine());
    }
};


// Wrap async functions below into a promise.
const glob = (pattern) => new Promise(
    (resolve, reject) => {
        nodeGlob(
            pattern, (error, value) => (error ? reject(error) : resolve(value))
        );
    }
);


const readFile = (fileName) => new Promise(
    (resolve, reject) => {
        fs.readFile(
            fileName, (error, value) => (error ? reject(error) : resolve(value))
        );
    }
);


const writeFile = (fileName, data) => new Promise(
    (resolve, reject) => {
        fs.writeFile(
            fileName, data,
            (error, value) => (error ? reject(error) : resolve(value))
        );
    }
);


// Store existing translations into memory
const oldLocaleMappings = [];
const localeMappings = [];


// Loop to run once per locale
for (const locale of locales) {
    oldLocaleMappings[locale] = {};
    localeMappings[locale] = {};

    // File to store translation messages into
    const translationFileName =
        `client/{{ cookiecutter.module_name }}/translations/${locale}.json`;

    try {
        // Parse the old translation message JSON files
        const messages = JSON.parse(fs.readFileSync(translationFileName));
        for (const message of messages) {
            oldLocaleMappings[locale][message.id] = message;
        }
    }
    catch (error) {
        if (error.code !== "ENOENT") {
            process.stderr.write(
                `There was an error loading this translation file: 
                 ${translationFileName}\n${error}`
            );
        }
    }
}


const extractFromFile = async(fileName) => {
    try {
        const code = await readFile(fileName);
        // Use babel plugin to extract instances where react-intl is used.
        const {metadata: result} = await transform(
            code, {
                presets: pkg.babel.presets,
                plugins: [
                    ["react-intl"],
                ],
            }
        );
        for (const message of result["react-intl"].messages) {
            for (const locale of locales) {
                const oldLocaleMapping = oldLocaleMappings[locale][message.id];
                // Merge old translations into the babel extracted instances
                // where react-intl is used.
                localeMappings[locale][message.id] = {
                    id: message.id,
                    description: message.description,
                    defaultMessage: message.defaultMessage,
                    message: (oldLocaleMapping && oldLocaleMapping.message)
                        ? oldLocaleMapping.message
                        : "",
                };
            }
        }
    }
    catch (error) {
        process.stderr.write(`Error transforming file: ${fileName}\n${error}`);
    }
};


(async function main() {
    const memoryTaskDone = task("Storing language files in memory");
    const files = await glob(FILES_TO_PARSE);
    memoryTaskDone();

    const extractTaskDone = task("Run extraction on all files");
    // Run extraction on all files that match the glob on line 16
    await Promise.all(files.map((fileName) => extractFromFile(fileName)));
    extractTaskDone();

    // Make the directory if it doesn't exist, especially for first run
    mkdir("-p", "client/{{ cookiecutter.module_name }}/translation");

    for (const locale of locales) {
        const translationFileName =
            `client/{{ cookiecutter.module_name }}/translation/${locale}.json`;

        try {
            const localeTaskDone = task(
                `Writing translation messages for ${locale} to: 
                 ${translationFileName}`
            );

            // Sort the translation JSON file so that git diffing is easier.
            // Otherwise the translation messages will jump around every time
            // extracted.
            let messages = Object.values(localeMappings[locale]).sort(
                (a, b) => {
                    a = a.id.toUpperCase();
                    b = b.id.toUpperCase();

                    if (a < b) {
                        return -1;
                    }
                    else if (a > b) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            );

            // Write the JSON representation of the translation messages.
            const prettified = `${JSON.stringify(messages, null, 2)}\n`;
            await writeFile(translationFileName, prettified);

            localeTaskDone();
        }
        catch (error) {
            localeTaskDone(
                `There was an error saving this translation file: 
                ${translationFileName}\n${error}`
            );
        }
    }

    process.exit()
}());
