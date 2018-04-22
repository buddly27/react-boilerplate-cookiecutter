import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles";
import {LinearProgress, CircularProgress} from "material-ui/Progress";


const style = {
    root: {
        width: "100%",
        marginTop: 0,
    },
};


const LoadingIndicator = (props) => {
    const {classes, circular} = props;
    return (
        <div className={classes.root}>
            {
                (circular) ?
                    <CircularProgress /> : <LinearProgress />
            }
        </div>
    );
};


LoadingIndicator.propTypes = {
    classes: PropTypes.object.isRequired,
    circular: PropTypes.bool,
};


LoadingIndicator.defaultProps = {
    circular: false,
};


export default withStyles(style)(LoadingIndicator);
