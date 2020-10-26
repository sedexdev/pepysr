import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";

// Redux
import Alert from "../redux/Alert";
import { connect } from "react-redux";
import { loginUser } from "../../redux/actions/auth";

import PropTypes from "prop-types";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                email: "",
                password: ""
            },
            loading: false
        };
        this.onChange = this.onChange.bind(this);
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
    async componentDidMount() {
        document.title = "PepysR - Login";
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
     *
     * @param {Object} e - an object that contains event data
     * @description    makes an asynchronous request to the
     *                 backend to verify the users login details
     *                 by calling the Redux action <loginUser>. If
     *                 the credentials are good, the <loggedIn>
     *                 state property is set to <true> and the user
     *                 is redirected to the landing page
     * @return         None
     */
    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            loading: true
        });
        let { email, password } = this.state.formData;
        const res = await this.props.loginUser(email, password);
        if (!res) {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        const { user, data } = this.props;
        const { loading } = this.state;
        const spinner = require("../../img/index.triple-gears-loading-icon.svg");

        if (user.isLoggedIn) {
            if (data) {
                const url = `/journal${data.url}`;
                return <Redirect to={url} />;
            }
            return <Redirect to='/landing' />;
        }

        return (
            <div className='container'>
                <div className='headings'>
                    <h1 className='header'>PepysR</h1>
                    <h2>Login</h2>
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
                    <Alert />
                    <input className='button' type='submit' value='Login' />
                </form>
                <p className='account-link'>
                    Don't have an account? <Link to='/register'>Sign up</Link>
                </p>
                {loading && (
                    <div className='spinner-wrapper'>
                        <img src={spinner} alt='loading spinner' />
                    </div>
                )}
            </div>
        );
    }
}

Login.propTypes = {
    user: PropTypes.object,
    loginUser: PropTypes.func.isRequired
};

const mapProps = state => ({
    user: state.auth.user,
    data: state.journal.data
});

export default connect(mapProps, { loginUser })(withRouter(Login));
