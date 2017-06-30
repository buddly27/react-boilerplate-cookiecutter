/**
 * Not Found Page.
 *
 * This is the page we show when the user visits a url that doesn't have a
 * route.
 *
 *
 */

import React from "react";
import {FormattedMessage} from "react-intl";

import message from "./message";


/**
 * Return the NotFound Component.
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
export default class NotFound extends React.Component {

    render() {
        return (
            <h1>
                <FormattedMessage {...message.header} />
            </h1>
        );
    }
}
