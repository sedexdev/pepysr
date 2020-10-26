import axios from "axios";

// Redux
import { displayAlert } from "../actions/alertPopUp";
import {
    JOURNAL_CREATED,
    JOURNAL_FAILED,
    LOAD_JOURNAL,
    ENTRY_CREATED,
    ENTRY_FAILED
} from "./actionTypes";

/**
 * @description    dispatches a <JOURNAL_CREATED> event that sends
 *                 a HTTP GET request to /api/journal so that a new
 *                 journal can be created for the user on the
 *                 backend. The data from the response is sent to the
 *                 reducer function via the <payload> property.
 *                 In the event of failure, the function
 *                 dispatches an alert which contains any error messages.
 *                 After this, a <JOURNAL_FAILED> event is fired to
 *                 reset the application state to the initial state
 * @return         None
 */
export const createJournal = () => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.get("/api/journal", {}, config);
        dispatch({
            type: JOURNAL_CREATED,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => {
                dispatch(displayAlert(error.msg, "error"));
            });
        }
        dispatch({ type: JOURNAL_FAILED });
    }
};

/**
 * @description    dispatches a <LOAD_JOURNAL> event that sends
 *                 a HTTP GET request to /api/journal/data so that an
 *                 existing journal can be loaded into the client from
 *                 the backend. The data from the response is sent to the
 *                 reducer function via the <payload> property. In the
 *                 event of failure, a <JOURNAL_FAILED> event is fired
 *                 to reset the application state to the initial state
 * @return         the journal data
 */
export const loadJournal = () => async dispatch => {
    try {
        const res = await axios.get("/api/journal/data");
        dispatch({
            type: LOAD_JOURNAL,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: JOURNAL_FAILED
        });
    }
};

/**
 *
 * @param {String} date - a string containing the date of the
 *                 journal entry
 * @param {String} content - a string containing the users journal
 *                 entry
 * @description    dispatches an <ENTRY_CREATED> event that sends
 *                 a HTTP GET request to /api/journal/entry so that a
 *                 journal entry can be saved in the backend. The data
 *                 from the response is sent to the reducer function via
 *                 the <payload> property. In the event of failure, an
 *                 <ENTRY_FAILED> event is fired to reset the
 *                 application state to the initial state
 * @return         None
 */
export const createEntry = (date, content) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const body = JSON.stringify({ date, content });
        const res = await axios.post("/api/journal/entry", body, config);
        dispatch({
            type: ENTRY_CREATED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ENTRY_FAILED
        });
    }
};
