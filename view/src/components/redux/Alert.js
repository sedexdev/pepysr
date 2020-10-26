import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

import "./alert.css";

/**
 *
 * @param {Array}  alerts - an array of strings containing error
 *                 messages for any errors that have occurred
 *                 during interactions with the application
 * @description    React functional component for rendering
 *                 a message to the user in the event that
 *                 something they did created an error within
 *                 the system
 * @return         React JSX element/s containing the
 *                 content to be displayed
 */
const Alert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const setProps = state => ({
    alerts: state.alertPopUp
});

export default connect(setProps)(Alert);
