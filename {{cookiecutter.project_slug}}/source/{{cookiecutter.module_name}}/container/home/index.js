/**
 * Home.
 *
 */

import React from "react";
import {FormattedMessage} from "react-intl";

import messages from "./message";


/**
 * Home Container Component.
 *
 * .. note::
 *
 *    While this component should technically be a stateless functional
 *    component (SFC), hot reloading does not currently support SFCs. If hot
 *    reloading is not a necessity for you then you can refactor it and remove
 *    the linting exception.
 *
 */
// eslint-disable-next-line react/prefer-stateless-function
export default class Home extends React.Component {

    render() {
        return (
            <h1>
                <FormattedMessage {...messages.header} />
            </h1>
        );
    }
}
