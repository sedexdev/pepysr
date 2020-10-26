import React, { Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { logoutUser, deleteUser } from "../../redux/actions/auth";

import PropTypes from "prop-types";

import "./navbar.css";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMenu: false,
            displayDeleteWindow: false,
            deleteCode: "",
            deleteCodeInput: "",
            error: false,
            redirect: false
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.displayDeleteWindow = this.displayDeleteWindow.bind(this);
        this.closeDeleteWindow = this.closeDeleteWindow.bind(this);
        this.onSubmitDelete = this.onSubmitDelete.bind(this);
    }

    /**
     *
     * @description    sets the <displayMenu> state property
     *                 to the opposite <boolean> value that
     *                 it is currently set to. This toggles
     *                 the logout/delete account menu display
     * @return         None
     */
    onClick() {
        this.setState(state => ({
            displayMenu: !state.displayMenu
        }));
    }

    /**
     * @param {Object} e - an object that contains event data
     * @description    sets an <e.target.name> state property to
     *                 the string value entered into an input field
     *                 by the user
     * @return         None
     */
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    /**
     *
     * @description    sets the <displayDeleteWindow> state property
     *                 to <true>. This toggles the delete account window
     *                 display in the UI. The method also generates a
     *                 random integer that must be entered in order to
     *                 delete an account and set the <deleteCode> state
     *                 property to that integer
     * @return         None
     */
    displayDeleteWindow() {
        this.setState({
            displayDeleteWindow: true,
            deleteCode: Math.floor(Math.random() * 10000000 + 86545).toString()
        });
    }

    /**
     *
     * @description    sets the <displayDeleteWindow> state property
     *                 to <false>, removing it from the UI. Sets the
     *                 <deleteCode> state property value back to an
     *                 empty string. Sets the <deleteCodeInput> state
     *                 property back to an empty string. Sets the
     *                 <error> state property to <false>, removing the
     *                 code mismatch error message from the UI
     * @return         None
     */
    closeDeleteWindow() {
        this.setState({
            displayDeleteWindow: false,
            deleteCode: "",
            deleteCodeInput: "",
            error: false
        });
    }

    /**
     *
     * @param {Object} e - an object that contains event data
     * @description    checks if the code entered by the user
     *                 matches the random integer stored in the
     *                 <deleteCode> state property. Then makes
     *                 a request to the backend to delete a users
     *                 account details of the codes match by
     *                 calling the Redux action <deleteUser>
     * @return         None
     */
    onSubmitDelete(e) {
        e.preventDefault();
        const { deleteCode, deleteCodeInput } = this.state;
        const { user, deleteUser } = this.props;
        if (deleteCode !== deleteCodeInput) {
            this.setState({
                error: true
            });
        } else {
            this.setState({
                redirect: true
            });
            deleteUser(user);
        }
    }

    render() {
        const {
            displayMenu,
            displayDeleteWindow,
            deleteCode,
            error,
            redirect
        } = this.state;
        const { user, logoutUser, history } = this.props;

        const spinner = require("../../img/loading.svg");
        const menuIcon = require("../../img/menu.png");

        return (
            <Fragment>
                {redirect && <Redirect to='/redirect' />}
                <header className='navbar'>
                    <p className='banner-heading'>PepysR</p>
                    <div className='account-container'>
                        {user ? (
                            <p className='user-email'>{user.email}</p>
                        ) : (
                            <img
                                className='spinner'
                                src={spinner}
                                alt='email address loading spinner'
                            />
                        )}
                        <button className='menu-btn' onClick={this.onClick}>
                            <img
                                src={menuIcon}
                                className='menu-icon'
                                alt='Menu icon'
                            />
                        </button>
                        {displayMenu && (
                            <div className='drop-menu-container'>
                                <ul className='menu-list'>
                                    <li className='menu-list-item'>
                                        <button
                                            className='account-btn'
                                            onClick={() => logoutUser(history)}>
                                            Logout
                                        </button>
                                    </li>
                                    <li className='menu-list-item'>
                                        <button
                                            className='account-btn danger'
                                            type='button'
                                            onClick={this.displayDeleteWindow}>
                                            Delete account
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {displayDeleteWindow && (
                            <div className='delete-account-popup'>
                                <h2>Delete your account?</h2>
                                <p className='delete-message'>
                                    Please be aware that this action is
                                    irreversible. All of your account data and
                                    any journal entries you have made will be
                                    deleted from the system. If you think you
                                    have anything important saved in an entry,
                                    please recover that information before
                                    continuing
                                </p>
                                <p>
                                    Enter the code to confirm account deletion:{" "}
                                    <span className='delete-code'>
                                        {deleteCode}
                                    </span>
                                </p>
                                <form onSubmit={this.onSubmitDelete}>
                                    <input
                                        className='delete-verification-input'
                                        name='deleteCodeInput'
                                        type='text'
                                        placeholder='Enter code'
                                        onFocus={e =>
                                            (e.target.placeholder = "")
                                        }
                                        onBlur={e =>
                                            (e.target.placeholder =
                                                "Enter code")
                                        }
                                        onChange={e => this.onChange(e)}
                                    />
                                    {error && (
                                        <p className='error-message'>
                                            Codes do not match
                                        </p>
                                    )}
                                    <div className='delete-window-btns'>
                                        <button
                                            className='delete-btn cancel'
                                            onClick={this.closeDeleteWindow}>
                                            Cancel
                                        </button>
                                        <button className='delete-btn delete'>
                                            Delete
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </header>
            </Fragment>
        );
    }
}

NavBar.propTypes = {
    user: PropTypes.object,
    logoutUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
};

const setProps = state => ({
    user: state.auth.user
});

export default connect(setProps, { logoutUser, deleteUser })(
    withRouter(NavBar)
);
