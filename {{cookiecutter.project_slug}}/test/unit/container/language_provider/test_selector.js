import {fromJS} from "immutable";

import {
    selectLanguage,
} from "{{ cookiecutter.module_name }}/container/language_provider/selector";


describe("selectLanguage", () => {
    it("should select the global state", () => {
        const globalState = fromJS({});
        const mockedState = fromJS({
            language: globalState,
        });
        expect(selectLanguage(mockedState)).toEqual(globalState);
    });
});
