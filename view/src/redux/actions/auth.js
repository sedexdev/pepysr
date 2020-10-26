import axios from "axios";

// Redux
import { displayAlert } from "./alertPopUp";
import { loadJournal } from "./journal";
import {
    USER_LOADED,
    USER_ERROR,
    REGISTER_SUCCEEDED,
    REGISTER_FAILED,
    LOGIN_SUCCEEDED,
    LOGIN_FAILED,
    LOGGED_OUT,
    DELETE_SUCCESS,
    DELETE_FAILED,
    CLEAR_JOURNAL_FROM_STATE
} from "./actionTypes";

/**
 * @description    dispatches a <USER_LOADED> event that sends
 *                 a HTTP GET request to /api/user so that the users
 *                 session data can be accessed from the backend. The data
 *                 from the response is sent to the reducer function via
 *                 the <payload> property. In the event of failure, an
 *                 <USER_ERROR> event is fired to reset the
 *                 application state to the initial state
 * @return         the users data
 */
export const loadUser = () => async dispatch => {
    try {
        const res = await axios.get("/api/user");
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: USER_ERROR
        });
    }
};

/**
 *
 * @param {String} email - a string containing the users email
 * @param {String} password - a string containing the users password
 * @description    dispatches a <REGISTER_SUCCEEDED> event that sends
 *                 a HTTP POST request to /api/register so that a
 *                 new user can be registered in the backend. The data
 *                 from the response is sent to the reducer function via
 *                 the <payload> property. In the event of failure, the function
 *                 dispatches an alert which contains any error messages.
 *                 After this, a <REGISTER_FAILED> event is fired to
 *                 reset the application state to the initial state
 * @return         true if the request was successful
 */
export const registerUser = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const reqBody = JSON.stringify({ email, password });
    try {
        const res = await axios.post("/api/register", reqBody, config);
        dispatch({
            type: REGISTER_SUCCEEDED,
            payload: res.data
        });
        return true;
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => {
                dispatch(displayAlert(error.msg, "error"));
            });
        }
        dispatch({
            type: REGISTER_FAILED
        });
    }
};

/**
 *
 * @param {String} email - a string containing the users email
 * @param {String} password - a string containing the users password
 * @description    dispatches a <LOGIN_SUCCEEDED> event that sends
 *                 a HTTP POST request to /api/register so that a
 *                 new user can be registered in the backend. The data
 *                 from the response is sent to the reducer function via
 *                 the <payload> property. On success, the user data and
 *                 journal data is loaded into the UI by dispatching the
 *                 <loadUser> and <loadJournal> actions. In the event of
 *                 failure, the function dispatches an alert which
 *                 contains any error messages. After this, a <LOGIN_FAILED>
 *                 event is fired to reset the application state to
 *                 the initial state
 * @return         true if the request was successful
 */
export const loginUser = (email, password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const reqBody = JSON.stringify({ email, password });
    try {
        const res = await axios.post("/api/login", reqBody, config);
        dispatch({
            type: LOGIN_SUCCEEDED,
            payload: res.data
        });
        dispatch(loadUser());
        dispatch(loadJournal());
        return true;
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => {
                dispatch(displayAlert(error.msg, "error"));
            });
        }
        dispatch({
            type: LOGIN_FAILED
        });
    }
};

/**
 *
 * @param {String} history - an object containing the navigation
 *                 history of the application
 * @description    makes a HTTP DELETE request to /api/logout which
 *                 destroys the users current session. The <LOGGED_OUT>
 *                 and <CLEAR_JOURNAL_FROM_STATE> events are then fired
 *                 to clear the users data out of the application state.
 *                 After these processes complete, the user is redirected
 *                 to the login page
 * @return         None
 */
export const logoutUser = history => async dispatch => {
    await axios.delete("/api/logout");
    dispatch({ type: LOGGED_OUT });
    dispatch({ type: CLEAR_JOURNAL_FROM_STATE });
    history.push("/");
};

/**
 *
 * @param {String} user - an object containing the session data for
 *                 the current user
 * @description    dispatches a <DELETE_SUCCESS> event that sends
 *                 a HTTP DELETE request to /api/delete so that the
 *                 current users data is removed from the backend. The data
 *                 from the response is sent to the reducer function via
 *                 the <payload> property. In the event of failure, an
 *                 <DELETE_FAILED> event is fired to reset the
 *                 application state to the initial state
 * @return         true if the request was successful
 */
export const deleteUser = user => async dispatch => {
    try {
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        const body = JSON.stringify(user);
        const res = await axios.delete("/api/delete", body, config);
        dispatch({
            type: DELETE_SUCCESS,
            payload: res.data
        });
        return true;
    } catch (err) {
        dispatch({ type: DELETE_FAILED });
    }
};
