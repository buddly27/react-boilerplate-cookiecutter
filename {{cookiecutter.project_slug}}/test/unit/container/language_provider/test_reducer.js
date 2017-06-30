import {fromJS} from "immutable";

import languageProviderReducer from "{{ cookiecutter.module_name }}/container/language_provider/reducer";
import {CHANGE_LOCALE} from "{{ cookiecutter.module_name }}/container/language_provider/constant";


describe("languageProviderReducer", () => {
    it("returns the initial state", () => {
        expect(languageProviderReducer(undefined, {})).toEqual(fromJS({
            locale: "en",
        }));
    });

    it("changes the locale", () => {
        expect(languageProviderReducer(undefined, {
            type: CHANGE_LOCALE,
            locale: "de",
        }).toJS()).toEqual({
            locale: "de",
        });
    });
});
