const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("mongoURI");

/**
 * @description  Asynchronously connects the the application to the MongoDB
 *               backend via a specific URI for the database. In the event
 *               of a connection failure the function exits the process with
 *               exit code 1
 * @return       None
 */
const connectMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("MongoDB connected...");
    } catch (err) {
        process.exit(1);
    }
};

module.exports = connectMongo;
