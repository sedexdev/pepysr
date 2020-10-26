import React from "react";
import { withRouter } from "react-router-dom";

import "./redirect.css";

/**
 *
 * @param {Object} props - an object containing the default
 *                 props available to React components via
 *                 the <withRouter> function
 * @description    React functional component for rendering
 *                 a message to the user stating that they
 *                 are being redirected
 * @return         React JSX element containing the
 *                 content to be displayed
 */
const Redirect = () => {
    const spinner = require("../../img/index.triple-gears-loading-icon.svg");

    return (
        <main>
            <div className='redirect-message'>
                <h1>We're sorry to see you go :(</h1>
                <p>Redirecting...</p>
                <img src={spinner} alt='loading spinner' />
            </div>
        </main>
    );
};

export default withRouter(Redirect);
