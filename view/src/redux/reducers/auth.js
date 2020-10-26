import {
    USER_LOADED,
    USER_ERROR,
    REGISTER_SUCCEEDED,
    REGISTER_FAILED,
    LOGIN_SUCCEEDED,
    LOGIN_FAILED,
    LOGGED_OUT,
    DELETE_SUCCESS,
    DELETE_FAILED
} from "../actions/actionTypes";

const initialState = {
    user: {}
};

/**
 *
 * @param {Object} state  - the initial application state
 *                 when the app loads
 * @param {Object} action - an action that has been dispatched
 * @description    returns a new application state
 *                 based on the action type that was
 *                 triggered with the application
 * @returns        an object setting the user to the payload or
 *                 an object setting the user to null or
 *                 the current state
 *
 */
export default function(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case LOGIN_SUCCEEDED:
        case USER_LOADED:
            return {
                ...state,
                user: payload
            };
        case USER_ERROR:
        case REGISTER_FAILED:
        case LOGIN_FAILED:
        case LOGGED_OUT:
        case DELETE_SUCCESS:
            return {
                ...state,
                user: {}
            };
        case REGISTER_SUCCEEDED:
        case DELETE_FAILED:
        default:
            return state;
    }
}
