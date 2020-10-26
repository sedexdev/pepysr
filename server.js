const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectMongo = require("./model/database");
const path = require("path");
const session = require("express-session");
const config = require("config");
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
    uri: config.get("mongoURI"),
    mongooseConnection: mongoose.connection,
    collection: "sessions",
    ttl: config.get("sessionLife") / 1000
});

// Session middleware
app.use(
    session({
        name: config.get("sessionName"),
        genid: function() {
            return uuid.v4();
        },
        secret: config.get("sessionKey"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: true,
            httpOnly: true,
            maxAge: config.get("sessionLife")
        },
        store: mdbStore
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

// Serve up static assets in production
if (process.env.NODE_ENV === "production") {
    // This is the location of the static build assets
    app.use(express.static("./view/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "view", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
