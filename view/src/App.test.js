import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";

// Redux
import { Provider } from "react-redux";
import { reduxStore } from "./redux/store/reduxStore";

import App from "./App";

test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <Provider store={reduxStore}>
            <Router>
                <App />
            </Router>
        </Provider>,
        div
    );
    ReactDOM.unmountComponentAtNode(div);
});

it("renders correctly", () => {
    const tree = renderer
        .create(
            <Provider store={reduxStore}>
                <Router>
                    <App />
                </Router>
            </Provider>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
