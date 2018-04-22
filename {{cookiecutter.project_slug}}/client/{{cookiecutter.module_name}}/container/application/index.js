/**
 * Application.
 *
 */

import React from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import {withRouter, Switch, Route} from "react-router-dom";
import {withStyles} from "material-ui/styles";

import HomePage from "{{ cookiecutter.module_name }}/container/home/loadable";
import NotFoundPage from "{{ cookiecutter.module_name }}/container/not_found/loadable";


/** Style which will be applied to the component. */
const STYLE = {
    header: {
        padding: 10,
    },
    content: {
        margin: 10,
    },
};


/**
 * Application Container Component.
 *
 */
export function Application(props) {
    const {classes} = props;

    return (
        <div>
            <AppBar
                className={classes.header}
                position="static"
            >
                <Typography
                    variant="title"
                    color="inherit"
                >
                    {"{{ cookiecutter.project }}"}
                </Typography>
            </AppBar>

            <div className={classes.content}>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="" component={NotFoundPage} />
                </Switch>
            </div>
        </div>
    );
}


/**
 * Expected types for *props*.
 */
Application.propTypes = {
    classes: PropTypes.object.isRequired,
};


const withStyle = withStyles(STYLE);


/**
 * Application wrapped with the Router and Material-UI style.
 */
export default compose(
    withRouter,
    withStyle,
)(Application);
