import { SHOW_ALERT, DELETE_ALERT } from "../actions/actionTypes";

/**
 *
 * @param {Array}  state  - the initial application state
 *                 when the app loads
 * @param {Object} action - an action that has been dispatched
 * @description    returns a new application state
 *                 based on the action type that was
 *                 triggered with the application
 * @returns        an array setting state to an array of strings
 *                 representing error messages or
 *                 an array with alerts that have timed out filtered out or
 *                 the current state
 *
 */
export default function(state = [], action) {
    const { type, payload } = action;
    switch (type) {
        case SHOW_ALERT:
            return [...state, payload];
        case DELETE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}
