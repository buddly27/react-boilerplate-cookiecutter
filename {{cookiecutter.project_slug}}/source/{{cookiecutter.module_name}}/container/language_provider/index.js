/**
 * Language Provider.
 *
 */

import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {IntlProvider} from "react-intl";

import {makeSelectLocale} from "./selector";


/**
 * Language Provider Container Component.
 *
 * Connect the Redux state language locale to the IntlProvider component and
 * :term:`i18n` messages (loaded from
 * `{{ cookiecutter.module_name }}/translations`).
 *
 * *props* should contain:
 *
 * * locale:
 *      Local code associated to the user language.
 *
 * * messages:
 *      Object representing :term:`i18n` message descriptors.
 *
 * * children:
 *      Nested React children nodes.
 *
 * .. seealso:: https://github.com/yahoo/react-intl/wiki/Components#intlprovider
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
    locale: PropTypes.string,
    messages: PropTypes.object,
    children: PropTypes.element.isRequired,
};


const mapStateToProps = createSelector(
    makeSelectLocale(), (locale) => ({locale})
);


/**
 * Language Provider wrapped with the Redux connector.
 */
export default connect(mapStateToProps)(LanguageProvider);
