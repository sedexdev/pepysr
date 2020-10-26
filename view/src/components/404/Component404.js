import React from "react";
import { Link } from "react-router-dom";

import "./component404.css";

/**
 * @description    React functional component for rendering
 *                 a message to the user in the event that
 *                 they attempt to navigate to a page that
 *                 doesn't exist
 * @return         React JSX element containing the
 *                 content to be displayed
 */
const Component404 = () => {
    return (
        <section>
            <div className='container-404'>
                <p className='msg-404'>
                    404: Oops, we couldn't find that page :(
                </p>
                <Link to='/'>
                    <button className='button' type='button'>
                        Back
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default Component404;
