import {
    JOURNAL_CREATED,
    JOURNAL_FAILED,
    LOAD_JOURNAL,
    CLEAR_JOURNAL_FROM_STATE,
    ENTRY_CREATED,
    ENTRY_FAILED
} from "../actions/actionTypes";

/**
 *
 * @param {Object} state  - the initial application state
 *                 when the app loads
 * @param {Object} action - an action that has been dispatched
 * @description    returns a new application state
 *                 based on the action type that was
 *                 triggered within the application
 * @returns        an object setting the data to the payload or
 *                 an object setting the data to null or
 *                 the current state
 *
 */
export default function(state = {}, action) {
    const { type, payload } = action;
    switch (type) {
        case JOURNAL_CREATED:
        case LOAD_JOURNAL:
        case ENTRY_CREATED:
            return {
                ...state,
                data: payload
            };
        case JOURNAL_FAILED:
            return {
                ...state,
                data: null
            };
        case CLEAR_JOURNAL_FROM_STATE:
            return {
                data: null
            };
        case ENTRY_FAILED:
        default:
            return state;
    }
}
