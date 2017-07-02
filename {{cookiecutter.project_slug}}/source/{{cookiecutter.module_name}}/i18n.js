/**
 * Setup :term:`i18n` language files and locale data.
 *
 * .. seealso:: https://github.com/yahoo/react-intl/wiki
 *
 */

import {addLocaleData} from "react-intl";
import EN_LOCALE_DATA from "react-intl/locale-data/en";
import DE_LOCALE_DATA from "react-intl/locale-data/de";
import FR_LOCALE_DATA from "react-intl/locale-data/fr";

import {DEFAULT_LOCALE} from "{{ cookiecutter.module_name }}/container/application/constant";

import EN_TRANSLATION_MESSAGES from "{{ cookiecutter.module_name }}/translation/en.json";
import DE_TRANSLATION_MESSAGES from "{{ cookiecutter.module_name }}/translation/de.json";
import FR_TRANSLATION_MESSAGES from "{{ cookiecutter.module_name }}/translation/fr.json";


/**
 * List of locale codes available.
 */
export const APPLICATION_LOCALES = [
    "en", "fr", "de"
];


addLocaleData(EN_LOCALE_DATA);
addLocaleData(DE_LOCALE_DATA);
addLocaleData(FR_LOCALE_DATA);


/**
 * Combine messages descriptors with default locale if necessary.
 *
 * *locale* should be the language code for which the message descriptors
 * should be returned.
 *
 * *messages* should be an object representing :term:`i18n` messages
 * description.
 *
 * Return an object representing :term:`i18n` messages descriptors.
 *
 */
export const formatTranslationMessages = (locale, messages) => {
    const defaultFormattedMessages = (locale !== DEFAULT_LOCALE) ?
        formatTranslationMessages(DEFAULT_LOCALE, EN_TRANSLATION_MESSAGES) : {};

    return Object.keys(messages).reduce((formattedMessages, key) => {
        const formattedMessage = (!messages[key] && locale !== DEFAULT_LOCALE) ?
            defaultFormattedMessages[key] : messages[key];
        return Object.assign(formattedMessages, {[key]: formattedMessage});
    }, {});
};

/**
 * Object regrouping all :term:`i18n` message descriptors per locale code.
 */
export const TRANSLATION_MESSAGES = {
    en: formatTranslationMessages("en", EN_TRANSLATION_MESSAGES),
    de: formatTranslationMessages("de", DE_TRANSLATION_MESSAGES),
    fr: formatTranslationMessages("fr", FR_TRANSLATION_MESSAGES),
};
