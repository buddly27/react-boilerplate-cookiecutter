import React from "react";
import {shallow, mount} from "enzyme";
import {FormattedMessage, defineMessages} from "react-intl";
import {Provider} from "react-redux";
import {browserHistory} from "react-router";

import ConnectedLanguageProvider, {LanguageProvider} from "{{ cookiecutter.module_name }}/container/language_provider/index";
import configureStore from "{{ cookiecutter.module_name }}/store";
import {TRANSLATION_MESSAGES} from "{{ cookiecutter.module_name }}/i18n";


const messages = defineMessages({
    someMessage: {
        id: "some.id",
        defaultMessage: "This is some default message",
        en: "This is some en message",
    },
});


describe("<LanguageProvider />", () => {
    it("should render its children", () => {
        const children = (<h1>Test</h1>);
        const renderedComponent = shallow(
            <LanguageProvider messages={messages} locale="en">
                {children}
            </LanguageProvider>
        );
        expect(renderedComponent.contains(children)).toBe(true);
    });
});


describe("<ConnectedLanguageProvider />", () => {
    let store;

    beforeAll(() => {
        store = configureStore({}, browserHistory);
    });

    it("should render the default language messages", () => {
        const renderedComponent = mount(
            <Provider store={store}>
                <ConnectedLanguageProvider messages={TRANSLATION_MESSAGES}>
                    <FormattedMessage {...messages.someMessage} />
                </ConnectedLanguageProvider>
            </Provider>
        );
        expect(renderedComponent.contains(
            <FormattedMessage {...messages.someMessage} />)).toBe(true);
    });
});
