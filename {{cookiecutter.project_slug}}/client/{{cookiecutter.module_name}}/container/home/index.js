/**
 * Home.
 *
 */

import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {FormattedMessage} from "react-intl";
import Typography from "material-ui/Typography";

import messages from "./message";


/**
 * Home Container Component.
 *
 */
export function HomePage() {
    return (
        <Typography variant="headline">
            <FormattedMessage {...messages.header} />
        </Typography>
    );
}


const mapStateToProps = createStructuredSelector({
});


export function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}


/**
 * Home Container wrapped with the Redux connector.
 */
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
