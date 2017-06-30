/**
 * Setup i18n language files and locale data.
 *
 */

import {addLocaleData} from "react-intl";
import enLocaleData from "react-intl/locale-data/en";

import {DEFAULT_LOCALE} from "{{ cookiecutter.module_name }}/container/application/constant";

import enTranslationMessages from "{{ cookiecutter.module_name }}/translation/en.json";


export const appLocales = [
    "en",
];


addLocaleData(enLocaleData);


export const formatTranslationMessages = (locale, messages) => {
    const defaultFormattedMessages = locale !== DEFAULT_LOCALE
        ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
        : {};

    return Object.keys(messages).reduce((formattedMessages, key) => {
        const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE
            ? defaultFormattedMessages[key]
            : messages[key];
        return Object.assign(formattedMessages, {[key]: formattedMessage});
    }, {});
};


export const translationMessages = {
    en: formatTranslationMessages("en", enTranslationMessages),
};
