import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

import alertPopUp from "./alertPopUp";
import auth from "./auth";
import journal from "./journal";

const persistConfig = {
    key: "root",
    storage: sessionStorage,
    whitelist: ["auth", "journal"]
};

const rootReducer = combineReducers({ alertPopUp, auth, journal });

export default persistReducer(persistConfig, rootReducer);
