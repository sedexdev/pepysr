import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { Provider } from "react-redux";
import { reduxStore, persistor } from "./redux/store/reduxStore";
import { PersistGate } from "redux-persist/integration/react";
import { loadUser } from "./redux/actions/auth";
import { loadJournal } from "./redux/actions/journal";

import Login from "./components/login/Login";
import Register from "./components/register/Register";
import LandingPage from "./components/landing/LandingPage";
import Journal from "./components/journal/Journal";
import Component404 from "./components/404/Component404";
import RedirectTo from "./components/redirect/Redirect";

import PropTypes from "prop-types";

import "./App.css";

/**
 *
 * @param {Object} user - an object containing the users session
 *                 data
 * @param {Object} journal - an object containing the users journal
 *                 data
 * @description    React functional component for rendering the entire
 *                 application. Navigation routes are managed in this
 *                 component using the <react-router-dom> npm package
 * @return         React JSX element/s containing the
 *                 content to be displayed
 */
const App = withRouter(({ user, data }) => {
    useEffect(() => {
        reduxStore.dispatch(loadUser());
    }, []);

    useEffect(() => {
        reduxStore.dispatch(loadJournal());
    }, []);

    const journalPath = data ? `/journal${data.url}` : "";
    const isLoggedIn = user.isLoggedIn ? user.isLoggedIn : false;

    return (
        <Provider store={reduxStore}>
            <PersistGate persistor={persistor}>
                <div className='App'>
                    <Router>
                        <Switch>
                            <Route exact path='/' component={Login} />
                            <Route
                                exact
                                path='/register'
                                component={Register}
                            />
                            <Private
                                isLoggedIn={isLoggedIn}
                                exact
                                path='/landing'
                                component={LandingPage}
                            />
                            <Private
                                isLoggedIn={isLoggedIn}
                                exact
                                path={journalPath}
                                component={Journal}
                            />
                            <Private
                                isLoggedIn={isLoggedIn}
                                exact
                                path='/redirect'
                                component={RedirectTo}
                            />
                            <Route component={Component404} />
                        </Switch>
                    </Router>
                </div>
            </PersistGate>
        </Provider>
    );
});

const Private = ({ isLoggedIn, component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to='/' {...props} />
                )
            }
        />
    );
};

App.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object
};

const setProps = state => ({
    user: state.auth.user,
    data: state.journal.data
});

export default connect(setProps)(App);
