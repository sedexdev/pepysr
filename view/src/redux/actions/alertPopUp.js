import uuid from "uuid";

// Redux
import { SHOW_ALERT, DELETE_ALERT } from "./actionTypes";

/**
 *
 * @param {String} msg - a string containing the message
 *                 to be displayed in the UI
 * @param {String} alertType - a string containing the CSS class
 *                 that should be added to the rendered component
 * @description    dispatches a <SHOW_ALERT> event that updates
 *                 the application state with the return
 *                 value of the <alertPopUp> reducer function.
 *                 The alert message is removed from the UI
 *                 automatically after 3 seconds
 * @return         None
 */
export const displayAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SHOW_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: DELETE_ALERT, payload: id }), 3000);
};
