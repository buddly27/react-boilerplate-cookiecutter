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
import Typography from "material-ui/Typography";

import message from "./message";


/**
 * Return the NotFound Component.
 *
 */
export default function NotFoundPage() {
    return (
        <article>
            <Typography variant="headline">
                <FormattedMessage {...message.header} />
            </Typography>
        </article>
    );
}
