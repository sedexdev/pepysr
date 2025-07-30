const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectMongo = require("./model/database");
const session = require("express-session");
const config = require("config");
const mongoDBPassword = config.get("database.mongoDBPassword");
const MongoDBStore = require("connect-mongodb-session")(session);
const uuid = require("uuid");

// Routes
const registerRoute = require("./routes/api/register");
const loginRoute = require("./routes/api/login");
const logoutRoute = require("./routes/api/logout");
const userRoute = require("./routes/api/user");
const deleteRoute = require("./routes/api/delete");
const journalRoute = require("./routes/api/journal");

// Removes the x-powered-by header from any requests
// and therefore doesn't allow users to know the application is
// using Express. A recommended security feature
app.disable("x-powered-by");

// Connect to the MongoDB backend
connectMongo();

/**
 *
 * @param {Object} - an anonymous object that represents the
 *                 model for sessions that are stored in the database
 * @description    creates a new instance of MongoDBStore which
 *                 will store all user sessions server-side. When
 *                 a new session is started, the data will be
 *                 pulled from the session documents associated with
 *                 the current user in order to ensure they are
 *                 authenticated to navigate the app
 * @return         None
 */
const mdbStore = new MongoDBStore({
    uri: `mongodb://admin:${mongoDBPassword}@localhost:27017/pepysrdb?authSource=admin`,
    mongooseConnection: mongoose.connection,
    collection: "sessions",
    ttl: config.get("session.sessionLife") / 1000,
});

// Session middleware
app.use(
    session({
        name: config.get("session.sessionName"),
        genid: function () {
            return uuid.v4();
        },
        secret: config.get("session.sessionKey"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: true,
            httpOnly: true,
            maxAge: config.get("session.sessionLife"),
        },
        store: mdbStore,
    })
);

app.use(express.json({ extended: false }));

// Route middleware
app.use("/api/register", registerRoute());
app.use("/api/login", loginRoute());
app.use("/api/logout", logoutRoute());
app.use("/api/user", userRoute());
app.use("/api/delete", deleteRoute());
app.use("/api/journal", journalRoute());

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
