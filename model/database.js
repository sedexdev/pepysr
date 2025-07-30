const mongoose = require("mongoose");
const config = require("config");
const mongoDBPassword = config.get("database.mongoDBPassword");

/**
 * @description  Asynchronously connects the the application to the MongoDB
 *               backend via a specific URI for the database. In the event
 *               of a connection failure the function exits the process with
 *               exit code 1
 * @return       None
 */
const mongoURI = `mongodb://admin:${mongoDBPassword}@localhost:27017/pepysrdb?authSource=admin`;
const connectMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {});
        console.log("MongoDB connected...");
    } catch (err) {
        process.exit(1);
    }
};

module.exports = connectMongo;
