import React, { Fragment } from "react";

// Redux
import { connect } from "react-redux";
import { createEntry } from "../../redux/actions/journal";

import PropTypes from "prop-types";

import NavBar from "../navbar/NavBar";

import "./journal.css";

class Journal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            months: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],
            date: new Date(),
            todaysDate: "",
            content: "",
            searchDate: "",
            error: false
        };
        this.decreaseDate = this.decreaseDate.bind(this);
        this.increaseDate = this.increaseDate.bind(this);
        this.home = this.home.bind(this);
        this.getEntry = this.getEntry.bind(this);
        this.setEntry = this.setEntry.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.submitBtn = React.createRef();
    }

    /**
     *
     * @description    React lifecycle method that is automatically
     *                 called when the component mounts. The method
     *                 sets the <todaysDate> state property to todays
     *                 date by calling the appropriate <Date> object
     *                 methods. The method then sets the <content>
     *                 state property to the result of calling <getEntry>
     * @return         None
     */
    componentDidMount() {
        document.title = "PepysR - Journal";
        window.scrollTo(0, 0);
        const { months, date } = this.state;
        this.setState({
            todaysDate: `${date.getDate()} ${
                months[date.getMonth()]
            }, ${date.getUTCFullYear()}`
        });
        setTimeout(() => {
            this.setState({
                content: this.getEntry()
            });
        }, 1);
    }

    /**
     *
     * @description    sets the <todaysDate> state property
     *                 to the current value of <todaysDate>
     *                 minus 1 day. It then calls the <setEntry>
     *                 method to fetch any entry data for this
     *                 date
     * @return         None
     */
    decreaseDate() {
        const { months, date } = this.state;
        this.setState({
            date: new Date(date.setDate(date.getDate() - 1)),
            todaysDate: `${date.getDate()} ${
                months[date.getMonth()]
            }, ${date.getUTCFullYear()}`
        });
        this.setEntry();
    }

    /**
     *
     * @description    sets the <todaysDate> state property
     *                 to the current value of <todaysDate>
     *                 plus 1 day. It then calls the <setEntry>
     *                 method to fetch any entry data for this
     *                 date
     * @return         None
     */
    increaseDate() {
        const { months, date } = this.state;
        this.setState({
            date: new Date(date.setDate(date.getDate() + 1)),
            todaysDate: `${date.getDate()} ${
                months[date.getMonth()]
            }, ${date.getUTCFullYear()}`
        });
        this.setEntry();
    }

    /**
     *
     * @description    resets the <todaysDate> state property
     *                 to todays date. It then calls the <setEntry>
     *                 method to fetch any entry data for this
     *                 date
     * @return         None
     */
    home() {
        const { months } = this.state;
        const date = new Date();
        const todaysDate = `${date.getDate()} ${
            months[date.getMonth()]
        }, ${date.getUTCFullYear()}`;
        this.setState({
            date,
            todaysDate
        });
        this.setEntry();
    }

    /**
     *
     * @description    uses the <journal> state object to
     *                 search for a journal entry matching
     *                 date represented by the <todaysDate>
     *                 state property
     * @return         a string of the entry content if it
     *                 exists, or an empty string if it doesn't
     */
    getEntry() {
        const { todaysDate } = this.state;
        const { journal } = this.props;
        if (journal.data) {
            for (let entry of journal.data.entries) {
                if (entry.date === todaysDate) {
                    return entry.content;
                }
            }
            return "";
        }
        return "";
    }

    /**
     *
     * @description    sets the <content> state property to
     *                 the string value returned by calling
     *                 the <getEntry> method
     * @return         None
     */
    setEntry() {
        setTimeout(() => {
            this.setState({
                content: this.getEntry()
            });
        }, 1);
    }

    /**
     *
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
     * @param {Object} e - an object that contains event data
     * @description    submits the journal entry data to the
     *                 server for processing before being
     *                 stored in the database
     * @return         None
     */
    onSubmit(e) {
        e.preventDefault();
        let { todaysDate, content } = this.state;
        this.props.createEntry(todaysDate, content);
    }

    /**
     *
     * @param {Object} e - an object that contains event data
     * @description    creates a new date object based on the
     *                 input entered by the user and then
     *                 authenticates whether or not it is a
     *                 valid date. If it is, the <todaysDate>
     *                 state property is updated to that date
     *                 and the entry data is set by calling
     *                 <setEntry>. If an error occurs, the <error>
     *                 state property is updated to <true> to
     *                 add an error class to the input field
     * @return         None
     */
    onSubmitSearch(e) {
        e.preventDefault();
        const { months, searchDate } = this.state;
        const dateValues = searchDate.split("/");
        const date = new Date(dateValues[2], dateValues[1] - 1, dateValues[0]);
        const month =
            date.getMonth() < 10
                ? `0${date.getMonth() + 1}`
                : (date.getMonth() + 1).toString();
        if (date && month === dateValues[1]) {
            this.setState({
                date,
                todaysDate: `${date.getDate()} ${
                    months[date.getMonth()]
                }, ${date.getUTCFullYear()}`,
                error: false
            });
            this.setEntry();
        } else {
            this.setState({
                error: true
            });
        }
    }

    render() {
        const { todaysDate, content, error } = this.state;

        return (
            <Fragment>
                <main className='journal-main'>
                    <NavBar />
                    <div className='search-bar-form-container'>
                        <form
                            className='search-bar-form'
                            onSubmit={e => this.onSubmitSearch(e)}>
                            <input
                                className={
                                    error ? "search-bar error" : "search-bar"
                                }
                                type='text'
                                name='searchDate'
                                placeholder='DD/MM/YYYY'
                                onBlur={e => {
                                    e.target.placeholder = "DD/MM/YYYY";
                                }}
                                onFocus={e => (e.target.placeholder = "")}
                                onChange={e => this.onChange(e)}
                            />
                            <button className='search-btn'>&#8981;</button>
                        </form>
                    </div>
                    <div className='journal-container'>
                        <div>
                            <h1 className='journal-date'>{todaysDate}</h1>
                        </div>
                        <form
                            className='journal-form'
                            onSubmit={e => this.onSubmit(e)}>
                            <textarea
                                className='journal-data-container'
                                onChange={e => this.onChange(e)}
                                name='content'
                                value={content}
                                onBlur={e => {
                                    if (e.target !== this.submitBtn) {
                                        this.onSubmit(e);
                                    }
                                }}></textarea>
                            <button
                                className='journal-confirm-btn'
                                ref={this.submitBtn}>
                                &#10003;
                            </button>
                            <div className='journal-nav-container'>
                                <button
                                    className='journal-btn'
                                    type='button'
                                    onClick={this.decreaseDate}>
                                    &larr;
                                </button>
                                <button
                                    className='journal-btn'
                                    type='button'
                                    onClick={this.home}>
                                    Home
                                </button>
                                <button
                                    className='journal-btn'
                                    type='button'
                                    onClick={this.increaseDate}>
                                    &rarr;
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </Fragment>
        );
    }
}

Journal.propTypes = {
    journal: PropTypes.object,
    createEntry: PropTypes.func.isRequired
};

const setProps = state => ({
    journal: state.journal
});

export default connect(setProps, { createEntry })(Journal);
