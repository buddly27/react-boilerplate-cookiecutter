import {DEFAULT_LOCALE} from "{{ cookiecutter.module_name }}/container/application/constant";
import {formatTranslationMessages} from "{{ cookiecutter.module_name }}/i18n";


jest.mock("{{ cookiecutter.module_name }}/translation/en.json", () => (
    {
        message1: "default message",
        message2: "default message 2",
    }
));


const esTranslationMessages = {
    message1: "mensaje predeterminado",
    message2: "",
};


describe("formatTranslationMessages", () => {
    it("should build only defaults when DEFAULT_LOCALE", () => {
        const result = formatTranslationMessages(DEFAULT_LOCALE, {a: "a"});

        expect(result).toEqual({a: "a"});
    });


    it("should combine default locale and current locale when not DEFAULT_LOCALE", () => {
        const result = formatTranslationMessages("", esTranslationMessages);

        expect(result).toEqual({
            message1: "mensaje predeterminado",
            message2: "default message 2",
        });
    });
});
