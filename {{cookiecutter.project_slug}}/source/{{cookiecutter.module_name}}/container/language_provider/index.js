/**
 * Language Provider.
 *
 */

import React from "react";
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {IntlProvider} from "react-intl";

import {makeSelectLocale} from "./selector";


/**
 * Language Provider Container Component.
 *
 * Connect the Redux state language locale to the IntlProvider component and
 * i18n messages (loaded from `{{ cookiecutter.module_name }}/translations`).
 *
 * *props* should contain:
 *
 * * locale:
 *      Local code associated to the user language.
 *
 * * messages:
 *      List of i18n messages description.
 *
 * * children:
 *      Nested React children nodes.
 *
 */
// eslint-disable-next-line react/prefer-stateless-function
export class LanguageProvider extends React.Component {

    render() {
        return (
            <IntlProvider
                locale={this.props.locale}
                messages={this.props.messages[this.props.locale]}
            >
                {React.Children.only(this.props.children)}
            </IntlProvider>
        );
    }
}


/**
 * Expected types for *props*.
 */
LanguageProvider.propTypes = {
    locale: React.PropTypes.string,
    messages: React.PropTypes.object,
    children: React.PropTypes.element.isRequired,
};


const mapStateToProps = createSelector(
    makeSelectLocale(),
    (locale) => ({locale})
);


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
