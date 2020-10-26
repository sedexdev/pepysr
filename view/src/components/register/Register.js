import React, { Fragment } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { displayAlert } from "../../redux/actions/alertPopUp";
import { registerUser } from "../../redux/actions/auth";

import Alert from "../redux/Alert";

import PropTypes from "prop-types";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                email: "",
                password: "",
                confirmPassword: ""
            },
            loading: false,
            redirect: false
        };
        this.onChange = this.onChange.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     *
     * @description    React lifecycle method that is automatically
     *                 called when the component mounts. Sets the
     *                 tab title and scrolls to the
     *                 top of the page on mount
     * @return         None
     */
    componentDidMount() {
        document.title = "PepysR - Register";
        window.scrollTo(0, 0);
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
            formData: {
                ...this.state.formData,
                [e.target.name]: e.target.value
            }
        });
    }

    /**
     * @description    sets the <loading> state property to
     *                 <false> so that the loading spinner is
     *                 no longer displayed on the UI
     * @return         None
     */
    stopLoading() {
        this.setState({
            loading: false
        });
    }

    /**
     *
     * @param {Object} e - an object that contains event data
     * @description    makes an asynchronous request to the
     *                 backend to register a new user in the database
     *                 by calling the Redux action <registerUser>. If
     *                 the credentials are good, the <redirect>
     *                 state property is set to <true> and the user
     *                 is redirected to the login page
     * @return         None
     */
    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            loading: true
        });
        const { email, password, confirmPassword } = this.state.formData;
        if (password !== confirmPassword) {
            this.props.displayAlert("Passwords do not match", "error");
            this.stopLoading();
        } else {
            const res = await this.props.registerUser({
                email,
                password
            });
            if (res) {
                this.setState({
                    redirect: true
                });
            } else {
                this.stopLoading();
            }
        }
    }

    render() {
        const { user, data } = this.props;
        const { loading, redirect } = this.state;
        const spinner = require("../../img/index.triple-gears-loading-icon.svg");

        if (user.isLoggedIn) {
            if (data) {
                const url = `/journal${data.url}`;
                return <Redirect to={url} />;
            } else {
                return <Redirect to='/landing' />;
            }
        }

        return (
            <Fragment>
                {redirect && <Redirect to='/' />}
                <div className='container'>
                    <div className='headings'>
                        <h1 className='header'>PepysR</h1>
                        <h2>Register</h2>
                    </div>
                    <form className='form' onSubmit={e => this.onSubmit(e)}>
                        <label className='label' htmlFor='email'>
                            Email
                        </label>
                        <input
                            className='input'
                            type='text'
                            placeholder='Email...'
                            name='email'
                            onChange={e => this.onChange(e)}
                            onFocus={e => (e.target.placeholder = "")}
                            onBlur={e => (e.target.placeholder = "Email...")}
                        />
                        <label className='label' htmlFor='Password'>
                            Password
                        </label>
                        <input
                            className='input'
                            type='password'
                            placeholder='Password...'
                            name='password'
                            onChange={e => this.onChange(e)}
                            onFocus={e => (e.target.placeholder = "")}
                            onBlur={e => (e.target.placeholder = "Password...")}
                        />
                        <label className='label' htmlFor='Password'>
                            Confirm Password
                        </label>
                        <input
                            className='input'
                            type='password'
                            placeholder='Confirm password...'
                            name='confirmPassword'
                            onChange={e => this.onChange(e)}
                            onFocus={e => (e.target.placeholder = "")}
                            onBlur={e =>
                                (e.target.placeholder = "Confirm Password...")
                            }
                        />
                        <Alert />
                        <input
                            className='button'
                            type='submit'
                            value='Register'
                        />
                    </form>
                    <p className='account-link'>
                        Already have an account? <Link to='/'>Sign in</Link>
                    </p>
                    {loading && (
                        <div className='spinner-wrapper'>
                            <img src={spinner} alt='loading spinner' />
                        </div>
                    )}
                </div>
            </Fragment>
        );
    }
}

Register.propTypes = {
    user: PropTypes.object,
    displayAlert: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired
};

const mapProps = state => ({
    user: state.auth.user,
    data: state.journal.data
});

export default connect(mapProps, { displayAlert, registerUser })(
    withRouter(Register)
);
