import React, { Fragment } from "react";
import { Redirect, withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { createJournal } from "../../redux/actions/journal";

import NavBar from "../navbar/NavBar";
import Alert from "../redux/Alert";

import PropTypes from "prop-types";

import "./landing.css";

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false
        };
        this.displaySpinner = this.displaySpinner.bind(this);
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
        document.title = "PepysR - Landing";
        window.scrollTo(0, 0);
    }

    /**
     *
     * @description    displays the loading spinner on the UI
     *                 during asynchronous processes by setting
     *                 the <spinner> state property to <true>
     * @return         None
     */
    displaySpinner() {
        this.setState(state => ({
            spinner: !state.spinner
        }));
    }

    /**
     *
     * @description    creates a new journal object on the
     *                 backend when the 'Create Journal'
     *                 button is clicked by calling the
     *                 redux action <createJournal>. A
     *                 loading spinner is then displayed
     *                 while this process completes
     */
    onSubmit(e) {
        e.preventDefault();
        this.props.createJournal();
        this.displaySpinner();
    }

    render() {
        const { data } = this.props;
        const { spinner } = this.state;
        const loading = require("../../img/index.triple-gears-loading-icon.svg");

        if (data) {
            const url = `/journal${data.url}`;
            return <Redirect to={url} />;
        }

        return (
            <Fragment>
                <NavBar />
                <h1 className='journal-header'>Create a new journal today</h1>
                <form className='journal-form' onSubmit={e => this.onSubmit(e)}>
                    <Alert />
                    <input
                        className='create-journal-button'
                        type='submit'
                        value='Click here...'
                    />
                </form>
                {spinner && (
                    <div className='spinner-container'>
                        <img
                            className='landing-spinner'
                            src={loading}
                            alt='loading spinner'
                        />
                    </div>
                )}
            </Fragment>
        );
    }
}

LandingPage.propTypes = {
    data: PropTypes.object,
    createJournal: PropTypes.func.isRequired
};

const mapProps = state => ({
    data: state.journal.data
});

export default connect(mapProps, { createJournal })(withRouter(LandingPage));
